import React, {useRef, useState, useEffect, useCallback, useMemo} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Alert,
  Platform,
  findNodeHandle,
  AppState,
  BackHandler,
  KeyboardAvoidingView,
} from 'react-native';
import {ZegoTextureView} from 'zego-express-engine-reactnative';
import {useSelector} from 'react-redux';
import {NativeStackScreenProps} from '@react-navigation/native-stack';

// Services and hooks
import {
  initEngineForViewer,
  engine,
  startPlayingStream,
  destoryInstance,
} from '@hooks/zegoService';

// Components
import CustomPlayerHeader from '@components/PlayerScreenComponent/CustomPlayerHeader';
import LIveChatList from '@components/ScreenLayouts/LiveComp/LIveChatList';
import LiveInputAndDetails from '@components/ScreenLayouts/LiveComp/LiveBottomCompoment';

// Constants and utilities
import {Colors} from '@constant/colors';
import {fonts} from '@constant/fontfamily';
import {fontSize, hp} from '@constant/fontSize';
import {convertMessageObject, showToast} from '@utils/general';
import {MainStackParamList} from '@navigation/screens';
import {RootState} from '@store/index';
import CustomButton from '@components/CustomButtons/CustomButton';
import {useGetLiveByIdQuery} from '@rtkServices/LiveStreamServices';
import {StreamDetails} from '@rtkServices/LiveStreamServices/LiveServices';
import Loader from '@components/CustomLoader/Loader';
import {
  useFollowUnfollowUserMutation,
  useLikeContentMutation,
} from '@rtkServices/ContentActionService';
import {ZEGO_NEW_APP_ID} from '@rtkServices/endpoints';

// Types
interface StreamData {
  appId: string;
  userId: string;
  zegoToken: string;
  roomId: string;
  streamId: string;
}

interface ConvertedMessage {
  id: string;
  username: string;
  message: string;
  timestamp?: number;
}

type LiveViewerProps = NativeStackScreenProps<MainStackParamList, 'LiveViewer'>;

// Constants
const MAX_CONNECTION_ATTEMPTS = 3;
const STREAM_SETUP_DELAY = 500;
const RETRY_DELAY = 3000;

// Error code mappings
const ERROR_MESSAGES: Record<number, string> = {
  1000002: 'Stream does not exist or has ended',
  1000001: 'System error occurred',
  1000003: 'Network connection failed',
  1004020: 'Stream is not available or broadcaster has stopped streaming',
  1003001: 'Room login failed',
  1002001: 'Authentication failed - invalid token',
  1002002: 'Token expired',
};

export default function LiveViewer({navigation, route}: LiveViewerProps) {
  const {liveID} = route.params;

  // Redux state
  const user = useSelector((state: RootState) => state.user);

  // Refs
  const playViewRef = useRef<ZegoTextureView>(null);
  const appStateRef = useRef(AppState.currentState);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isComponentMountedRef = useRef(true);

  // State management
  const [streamData, setStreamData] = useState<StreamData>({
    appId: ZEGO_NEW_APP_ID,
    userId: '',
    zegoToken: '',
    roomId: '',
    streamId: '',
  });

  const [item, setItem] = useState<StreamDetails>();
  const [viewerState, setViewerState] = useState({
    isEngineInitialized: false,
    isPlaying: false,
    isLoading: false,
    connectionAttempts: 0,
  });
  const liveStreamDataRef = useRef<any>({});
  const [streamError, setStreamError] = useState<string | null>(null);
  const [message, setMessage] = useState('');
  const [messagesList, setMessagesList] = useState<ConvertedMessage[]>([]);
  const [viewerCount, setViewerCount] = useState(0);
  const [followUnfollowUser] = useFollowUnfollowUserMutation();
  const [like, setLike] = useState<boolean>(item?.isLiked || false);
  const [likeContent] = useLikeContentMutation();
  const [showChat, setShowChat] = useState<boolean>(true);
  const [isFollowingState, setIsFollowingState] = useState<any>(
    item?.isFollowing,
  );
  const [likeCount, setLikeCount] = useState<number>(
    typeof item?.likesCount === 'number' ? item?.likesCount : 0,
  );
  // console.log("viewerCountviewerCountviewerCount",viewerCount)
  // API query
  const {
    data: liveStreamData,
    isLoading: isLiveStreamLoading,
    error: liveStreamError,
  } = useGetLiveByIdQuery({id: liveID});

  // Update stream data when API data changes
  useEffect(() => {
    liveStreamDataRef.current = liveStreamData?.data;
    if (liveStreamData?.data && isComponentMountedRef.current) {
      const data = liveStreamData.data;
      setItem(data);

      const newStreamData = {
        appId: ZEGO_NEW_APP_ID,
        userId: user?.user?._id || '',
        zegoToken: data.token || '',
        roomId: data.roomId || '',
        streamId: data.roomId || '', // Use roomId as streamId
      };

      setStreamData(newStreamData);
      console.log('Stream data updated:', newStreamData);
    }
  }, [liveStreamData, user?.user?._id]);

  useEffect(() => {
    return () => {
      destoryInstance(liveStreamDataRef.current?.roomId);
    };
  }, []);

  // Memoized computed values
  const isReadyToPlay = useMemo(
    () =>
      viewerState.isEngineInitialized &&
      streamData.streamId &&
      streamData.zegoToken,
    [
      viewerState.isEngineInitialized,
      streamData.streamId,
      streamData.zegoToken,
    ],
  );

  const canRetry = useMemo(
    () => viewerState.connectionAttempts < MAX_CONNECTION_ATTEMPTS,
    [viewerState.connectionAttempts],
  );

  // Error message helper
  const getErrorMessage = useCallback((errorCode: number): string => {
    return ERROR_MESSAGES[errorCode] || `Stream error (Code: ${errorCode})`;
  }, []);

  // Cleanup function
  const cleanup = useCallback(async () => {
    console.log('Starting cleanup...');

    try {
      // Clear timeout
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
        reconnectTimeoutRef.current = null;
      }

      // Stop playing stream
      if (viewerState.isPlaying && engine && streamData.streamId) {
        console.log('Stopping stream playback...');
        await engine.stopPlayingStream(streamData.streamId);
      }
    } catch (error) {
      console.error('Cleanup error:', error);
    }
  }, [viewerState.isPlaying, streamData.streamId]);

  // Engine event listeners
  useEffect(() => {
    if (!engine || !viewerState.isEngineInitialized) return;

    const handleBroadcastMessage = (roomID: string, messageList: any[]) => {
      console.log('Received broadcast messages:', {roomID, messageList});

      try {
        const newMessages = convertMessageObject({roomID, messageList});
        setMessagesList(prevMessages => [...prevMessages, ...newMessages]);
      } catch (error) {
        console.error('Error processing broadcast messages:', error);
      }
    };

    const handleRoomUserUpdate = (
      roomID: string,
      updateType: number,
      userList: any[],
    ) => {
      if (!isComponentMountedRef.current) return;

      console.log('Room user update:', {
        roomID,
        updateType,
        userList,
      });
      if (updateType == 0 && userList?.length) {
         setViewerCount(userList?.length);
      }
    };

    const handleRoomOnlineUserCountUpdate = (roomID: string, count: number) => {
      console.log(count, 'countcountcountcountcountcount');
      // if (count < 2) {
      //   navigation.goBack();
      // }
      setViewerCount(count);
    };

    const handleRoomStreamUpdate = (
      roomID: string,
      updateType: number,
      streamList: any[],
    ) => {
      if (!isComponentMountedRef.current) return;

      console.log('Room stream update:', {
        roomID,
        updateType,
        streamList,
      });
      const hostUserID = liveStreamDataRef.current?.creator?._id;
      if (
        updateType === 1 &&
        streamList?.some?.(s => s?.user?.userID === hostUserID)
      ) {
        // All streams ended
        setStreamError('Stream has ended');
        setViewerState(prev => ({...prev, isPlaying: false}));
      }
    };

    const handlePlayerStateUpdate = (
      streamID: string,
      state: number,
      errorCode: number,
      extendedData: any,
    ) => {
      if (!isComponentMountedRef.current) return;

      console.log('Player state update:', {
        streamID,
        state,
        errorCode,
        extendedData,
      });

      if (errorCode !== 0) {
        const errorMessage = getErrorMessage(errorCode);
        setStreamError(errorMessage);
        setViewerState(prev => ({...prev, isPlaying: false}));
      }
    };

    // Register event listeners
    engine.on('IMRecvBroadcastMessage', handleBroadcastMessage);
    engine.on('roomUserUpdate', handleRoomUserUpdate);
    engine.on('roomOnlineUserCountUpdate', handleRoomOnlineUserCountUpdate);
    engine.on('roomStreamUpdate', handleRoomStreamUpdate);
    engine.on('playerStateUpdate', handlePlayerStateUpdate);

    return () => {
      try {
        if (engine && typeof engine.off === 'function') {
          engine.off('IMRecvBroadcastMessage', handleBroadcastMessage);
          engine.off('roomUserUpdate', handleRoomUserUpdate);
          engine.off(
            'roomOnlineUserCountUpdate',
            handleRoomOnlineUserCountUpdate,
          );
          engine.off('roomStreamUpdate', handleRoomStreamUpdate);
          engine.off('playerStateUpdate', handlePlayerStateUpdate);
        }
      } catch (error) {
        console.warn('Error removing event listeners:', error);
      }
    };
  }, [engine, viewerState.isEngineInitialized, getErrorMessage]);

  // App state handling
  useEffect(() => {
    const handleAppStateChange = async (nextAppState: string) => {
      if (!isComponentMountedRef.current) return;

      if (
        appStateRef.current.match(/inactive|background/) &&
        nextAppState === 'active'
      ) {
        // App returned to foreground
        if (streamError && canRetry) {
          await retryConnection();
        }
      } else if (nextAppState.match(/inactive|background/)) {
        // App went to background
        if (viewerState.isPlaying) {
          await stopPlayingStream();
        }
      }
      appStateRef.current = nextAppState;
    };

    const subscription = AppState.addEventListener(
      'change',
      handleAppStateChange,
    );
    return () => subscription?.remove();
  }, [streamError, canRetry, viewerState.isPlaying]);

  // Back button handling
  useEffect(() => {
    const backAction = () => {
      cleanup();
      return false; // Allow default back behavior
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );
    return () => backHandler.remove();
  }, [cleanup]);

  // Initialize engine
  const initEngine = useCallback(async () => {
    // Validate required data
    if (!streamData.userId || !streamData.zegoToken || !streamData.roomId) {
      const missingFields = [];
      if (!streamData.userId) missingFields.push('userId');
      if (!streamData.zegoToken) missingFields.push('token');
      if (!streamData.roomId) missingFields.push('roomId');

      const error = `Missing required stream data: ${missingFields.join(', ')}`;
      console.error('Validation failed:', error, {streamData});
      setStreamError(error);
      return;
    }

    console.log('Initializing engine with:', {
      appId: streamData.appId,
      userId: streamData.userId,
      roomId: streamData.roomId,
      hasToken: !!streamData.zegoToken,
    });

    setViewerState(prev => ({...prev, isLoading: true}));
    setStreamError(null);

    try {
      await initEngineForViewer({
        appId: streamData.appId,
        userId: streamData.userId,
        zegoToken: streamData.zegoToken,
        roomId: streamData.roomId,
        username: user?.user?.username || user?.user?.name || 'Anonymous',
      });

      if (!isComponentMountedRef.current) return;

      console.log('Engine initialized successfully');
      setViewerState(prev => ({
        ...prev,
        isEngineInitialized: true,
        isLoading: false,
      }));
    } catch (error) {
      if (!isComponentMountedRef.current) return;

      console.error('Engine initialization failed:', error);
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      setStreamError(`Engine initialization failed: ${errorMessage}`);
      setViewerState(prev => ({...prev, isLoading: false}));
    }
  }, [streamData, user?.user?.username, user?.user?.name]);

  // Auto-start playing when engine is ready
  useEffect(() => {
    if (
      viewerState.isEngineInitialized &&
      !viewerState.isLoading &&
      !viewerState.isPlaying &&
      !streamError
    ) {
      console.log('Auto-starting stream playback...');
      handleStartPlayingStream();
    }
  }, [
    viewerState.isEngineInitialized,
    viewerState.isLoading,
    viewerState.isPlaying,
    streamError,
  ]);

  // Start playing stream
  const handleStartPlayingStream = useCallback(async () => {
    console.log(
      'handleStartPlayingStream called, isReadyToPlay:',
      isReadyToPlay,
    );

    if (!isReadyToPlay) {
      console.log('Not ready to play:', {
        isEngineInitialized: viewerState.isEngineInitialized,
        hasStreamId: !!streamData.streamId,
        hasToken: !!streamData.zegoToken,
        streamId: streamData.streamId,
      });
      return;
    }

    if (!playViewRef.current) {
      console.error('Play view ref not ready');
      setStreamError('Play view not ready');
      return;
    }

    console.log('Starting stream playback...');
    setViewerState(prev => ({
      ...prev,
      isLoading: true,
      connectionAttempts: prev.connectionAttempts + 1,
    }));
    setStreamError(null);

    try {
      // Ensure view is fully mounted
      await new Promise(resolve => setTimeout(resolve, STREAM_SETUP_DELAY));

      if (!isComponentMountedRef.current) return;

      const reactTag = findNodeHandle(playViewRef.current);
      console.log('React tag obtained:', reactTag);

      if (!reactTag) {
        throw new Error('Could not get play view reference');
      }

      const playCanvas = {
        reactTag,
        viewMode: 0, // ScaleAspectFit
        backgroundColor: 0x000000,
      };

      console.log('Attempting to play stream:', {
        streamId: streamData.streamId,
        roomId: streamData.roomId,
        attempt: viewerState.connectionAttempts + 1,
      });

      await startPlayingStream(streamData.streamId, playCanvas);

      if (!isComponentMountedRef.current) return;

      console.log('Stream started successfully');
      setViewerState(prev => ({...prev, isPlaying: true, isLoading: false}));
    } catch (error) {
      if (!isComponentMountedRef.current) return;

      console.error('Failed to start playing stream:', error);
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      setStreamError(`Failed to start playing: ${errorMessage}`);
      setViewerState(prev => ({...prev, isLoading: false}));

      // Auto-retry if possible
      if (canRetry) {
        console.log(`Will auto-retry in ${RETRY_DELAY / 1000} seconds...`);
        reconnectTimeoutRef.current = setTimeout(() => {
          if (isComponentMountedRef.current) {
            retryConnection();
          }
        }, RETRY_DELAY);
      }
    }
  }, [isReadyToPlay, streamData.streamId, streamData.roomId, canRetry]);

  // Stop playing stream
  const stopPlayingStream = useCallback(async () => {
    if (!engine || !streamData.streamId) return;

    setViewerState(prev => ({...prev, isLoading: true}));

    try {
      await engine.stopPlayingStream(streamData.streamId);

      if (isComponentMountedRef.current) {
        setViewerState(prev => ({...prev, isPlaying: false, isLoading: false}));
        console.log('Successfully stopped playing stream');
      }
    } catch (error) {
      console.error('Failed to stop playing stream:', error);
      if (isComponentMountedRef.current) {
        setViewerState(prev => ({...prev, isLoading: false}));
      }
    }
  }, [streamData.streamId]);

  // Retry connection
  const retryConnection = useCallback(async () => {
    if (!canRetry) {
      Alert.alert(
        'Connection Failed',
        'Unable to connect after multiple attempts. Please check if the broadcaster is still live.',
        [
          {
            text: 'Reset',
            onPress: () => {
              setViewerState(prev => ({...prev, connectionAttempts: 0}));
              setStreamError(null);
            },
          },
          {text: 'OK'},
        ],
      );
      return;
    }

    console.log(
      `Retrying connection (attempt ${
        viewerState.connectionAttempts + 1
      }/${MAX_CONNECTION_ATTEMPTS})`,
    );
    await handleStartPlayingStream();
  }, [canRetry, viewerState.connectionAttempts, handleStartPlayingStream]);

  // Send chat message
  const sendChatMessage = useCallback(
    async (roomID: string, messageText: string) => {
      if (!messageText.trim() || !engine) return;

      try {
        const result = await engine.sendBroadcastMessage(
          roomID,
          messageText.trim(),
        );
        console.log('Message sent successfully:', result);

        const newMessage: ConvertedMessage = {
          id: result?.messageID || Date.now().toString(),
          username: user?.user?.username || user?.user?.name || 'You',
          message: messageText.trim(),
          timestamp: Date.now(),
        };

        if (isComponentMountedRef.current) {
          setMessagesList(prevMessages => [...prevMessages, newMessage]);
          setMessage('');
        }
      } catch (error) {
        console.error('Failed to send message:', error);
        Alert.alert('Error', 'Failed to send message');
      }
    },
    [user?.user?.username, user?.user?.name],
  );

  // Handle send message from input
  const handleSendMessage = useCallback(() => {
    if (message.trim() && streamData.roomId) {
      sendChatMessage(streamData.roomId, message);
    }
  }, [message, streamData.roomId, sendChatMessage]);

  // Initialize when stream data is ready
  useEffect(() => {
    if (
      streamData.userId &&
      streamData.zegoToken &&
      streamData.roomId &&
      !viewerState.isEngineInitialized &&
      !viewerState.isLoading
    ) {
      console.log('Initializing engine with complete stream data...');
      initEngine();
    }
  }, [
    streamData,
    viewerState.isEngineInitialized,
    viewerState.isLoading,
    initEngine,
  ]);

  // Cleanup on unmount
  useEffect(() => {
    isComponentMountedRef.current = true;

    return () => {
      console.log('Component unmounting, cleaning up...');
      isComponentMountedRef.current = false;
      cleanup();
    };
  }, [cleanup]);

  // Handle API errors
  useEffect(() => {
    if (liveStreamError) {
      console.error('Live stream API error:', liveStreamError);
      setStreamError('Failed to load stream information');
    }
  }, [liveStreamError]);

  useEffect(() => {
    if (item?.isFollowing !== undefined) {
      setIsFollowingState(!!item?.isFollowing);
    }
  }, [item?.isFollowing]);

  // Handle follow and unfollow
  const handleFollow = useCallback(async () => {
    if (!item?.creator?._id) return;

    try {
      const response = await followUnfollowUser({
        targetUserId: item?.creator?._id,
      }).unwrap();
      if (response?.success) {
        setIsFollowingState(prev => {
          showToast(prev ? 'Unfollowed' : 'Followed');
          return !prev;
        });
      }
    } catch (error) {
      console.error('Follow/Unfollow error:', error);
      showToast('An error occurred');
    }
  }, [item?.creator?._id, item?.isFollowing, followUnfollowUser]);

  const handleLike = useCallback(async () => {
    if (!item?.creator?._id) return;

    const prevLike = like;
    const prevLikeCount = likeCount;

    setLike(!prevLike);
    setLikeCount(prevLike ? prevLikeCount - 1 : prevLikeCount + 1);

    try {
      const response = await likeContent({
        contentType: 'streams',
        content_id: item?._id,
      }).unwrap();
      if (!response?.success) {
        // Revert on failure
        setLike(prevLike);
        setLikeCount(prevLikeCount);
        showToast('An error occurred');
      }
    } catch (error) {
      console.error('Like/Unlike error:', error);
      // Revert on error
      setLike(prevLike);
      setLikeCount(prevLikeCount);
      showToast('An error occurred');
    }
  }, [like, likeCount, item?.creator?._id, likeContent]);

  // Render error overlay
  const renderErrorOverlay = () => {
    if (!streamError) return null;

    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{streamError}</Text>
        {canRetry && streamError != "Stream has ended" && (
          <CustomButton
            btnStyle={styles.retryButton}
            text={`Retry (${viewerState.connectionAttempts}/${MAX_CONNECTION_ATTEMPTS})`}
            onPress={retryConnection}
            disabled={viewerState.isLoading}
          />
        )}
      </View>
    );
  };

  // Render loading overlay
  const renderLoadingOverlay = () => {
    if (!viewerState.isLoading) return null;

    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>
          {!viewerState.isEngineInitialized
            ? 'Initializing engine...'
            : viewerState.connectionAttempts > 0
            ? `Connecting to stream... (${viewerState.connectionAttempts}/${MAX_CONNECTION_ATTEMPTS})`
            : 'Loading...'}
        </Text>
      </View>
    );
  };

  if (isLiveStreamLoading) {
    return (
      <View style={styles?.container}>
        <Loader visible={true} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <CustomPlayerHeader
        navigation={navigation}
        CreatorData={item?.creator}
        isFollowing={isFollowingState}
        selectedUrl={item?.url}
        streamDetail={item}
        handleFollow={handleFollow}
        handleSetting={() => {}}
        LiveHeader={true}
        watchCount={viewerCount}
        isLive={viewerState.isPlaying}
        showSettingIcon={false}
      />

      <Text style={styles.poweredByText}>Powered by VyooO</Text>

      {/* Video Play View */}
      <ZegoTextureView ref={playViewRef} style={styles.videoView} />

      {/* Chat and Input */}
      <KeyboardAvoidingView
        style={styles.inputView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 60 : 0}>
        {showChat && (
          <View style={styles.bottomContainer}>
            <LIveChatList chatData={messagesList} />
          </View>
        )}

        <LiveInputAndDetails
          message={message}
          setMessage={setMessage}
          onSend={handleSendMessage}
          handleLike={handleLike}
          like={like}
          likeCount={likeCount}
          streamData={item}
          disabled={!viewerState.isPlaying || viewerState.isLoading}
          showChat={showChat}
          setShowChat={setShowChat}
        />
      </KeyboardAvoidingView>

      {/* Overlays */}
      {renderErrorOverlay()}
      {renderLoadingOverlay()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.black,
  },
  videoView: {
    flex: 1,
  },
  bottomContainer: {
    width: '100%',
    height: hp('35'),
  },
  errorContainer: {
    position: 'absolute',
    top: 120,
    left: 20,
    right: 20,
    backgroundColor: 'rgba(219, 67, 67, 0.69)',
    borderRadius: 12,
    padding: 16,
    zIndex: 1000,
  },
  errorText: {
    color: Colors.white,
    fontSize: fontSize.f12,
    fontFamily: fonts['Poppins-Medium'],
    textAlign: 'center',
    marginBottom: 12,
  },
  retryButton: {
    height: 40,
    backgroundColor: Colors.primaryColor,
    borderRadius: 8,
  },
  loadingContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 999,
  },
  loadingText: {
    color: Colors.white,
    fontSize: fontSize.f14,
    fontFamily: fonts['Poppins-Medium'],
    textAlign: 'center',
  },
  inputView: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
  },
  poweredByText: {
    position: 'absolute',
    top: hp('15%'),
    right: 10,
    zIndex: 999,
    color: Colors.white,
    fontSize: fontSize.f12,
    fontFamily: fonts['Poppins-Regular'],
  },
});
