import React, {useRef, useState, useEffect, useCallback, useMemo} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Alert,
  Platform,
  findNodeHandle,
  TouchableOpacity,
  Modal,
  AppState,
  BackHandler,
  TextInput,
  Keyboard,
  KeyboardAvoidingView,
} from 'react-native';
import {ZegoTextureView} from 'zego-express-engine-reactnative';
import {useSelector} from 'react-redux';

// Services and hooks
import {
  initEngineAndLogin,
  engine,
  enableCamera,
  switchCamera,
  enableMicrophone,
  destoryInstance,
} from '@hooks/zegoService';

// Components and UI
import CustomButton from '@components/CustomButtons/CustomButton';
import {
  CameraHideIcon,
  CameraShowIcon,
  ChatIcon,
  EndLiveScreen,
  MuteIcon,
  SwitchCameraIcon,
  UnmuteIcon,
} from '@assets/svg/LiveSCreenIcon';
import {LiveIcon} from '@assets/svg/UploadScreensIcon';
import {CrossIcon, EyeShowIcon} from '@assets/svg/AuthFlowIcons';

// Constants and utilities
import {Colors} from '@constant/colors';
import {fonts} from '@constant/fontfamily';
import {fontSize, hp, wp} from '@constant/fontSize';
import {convertMessageObject} from '@utils/general';
import {navigateAndSimpleReset, navigateBack} from '@navigation/utils';
import {RootState} from '@store/index';
import LIveChatList from '@components/ScreenLayouts/LiveComp/LIveChatList';
import {VideoIcon} from '@assets/svg/HomeScreenIcon';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {ZEGO_NEW_APP_ID} from '@rtkServices/endpoints';
import {useToastMessage} from '@hooks/useToastMessage';

// Types
interface StreamData {
  roomId: string;
  creatorId: string;
  token: string;
  userId: string;
}

interface LiveScreenProps {
  route: {
    params: {
      formData: StreamData;
    };
  };
}

// Constants
const COUNTDOWN_DURATION = 3;
const PREVIEW_DELAY = 500;

export default function LiveScreen({route}: LiveScreenProps) {
  const {formData} = route?.params || {};
  console.log(
    'formDataformDataformDataformDataformDataLiveScreenformDataformDataformDataformDataformDataLiveScreen',
    formData,
  );
  const {top} = useSafeAreaInsets();

  // Redux state
  const user = useSelector((state: RootState) => state.user);

  // Refs
  const previewViewRef = useRef<ZegoTextureView>(null);
  const countdownTimerRef = useRef<NodeJS.Timeout | null>(null);
  const appStateRef = useRef(AppState.currentState);
  const messageInputRef = useRef<TextInput>(null);

  // State management - grouped by functionality
  const [streamState, setStreamState] = useState({
    data: formData,
    isEngineInitialized: false,
    isStreaming: false,
    currentStreamId: null as string | null,
  });

  const [userCount, setUserCount] = useState(2);
  const [controlsState, setControlsState] = useState({
    isCameraEnabled: true,
    isMicrophoneEnabled: true,
    isFrontCamera: true,
  });
  // console.log(userCount,"userCountuserCountuserCountuserCount")
  const [uiState, setUIState] = useState({
    isLoading: false,
    showCountdown: true,
    countdown: COUNTDOWN_DURATION,
    showChatInput: false,
    keyboardHeight: 0,
  });

  const [messagesList, setMessagesList] = useState<ConvertedMessage[]>([]);
  const [message, setMessage] = useState('');

  // Memoized values
  const isReadyToStream = useMemo(
    () =>
      streamState.isEngineInitialized && streamState.data && !uiState.isLoading,
    [streamState.isEngineInitialized, streamState.data, uiState.isLoading],
  );

  const streamId = useMemo(
    () =>
      streamState.data?.roomId ||
      `stream_${streamState.data?.userId}_${Date.now()}`,
    [streamState.data?.roomId, streamState.data?.userId],
  );

  // Keyboard listeners
  useEffect(() => {
    const keyboardWillShow = (event: any) => {
      setUIState(prev => ({
        ...prev,
        keyboardHeight: event.endCoordinates.height,
      }));
    };

    const keyboardWillHide = () => {
      setUIState(prev => ({
        ...prev,
        keyboardHeight: 0,
      }));
    };

    const keyboardDidShow = Keyboard.addListener(
      'keyboardDidShow',
      keyboardWillShow,
    );
    const keyboardDidHide = Keyboard.addListener(
      'keyboardDidHide',
      keyboardWillHide,
    );

    return () => {
      keyboardDidShow.remove();
      keyboardDidHide.remove();
    };
  }, []);

  useEffect(() => {
    return () => {
      destoryInstance(formData?.roomId);
    };
  }, []);

  // Cleanup function
  const cleanup = useCallback(async () => {
    try {
      if (countdownTimerRef.current) {
        clearTimeout(countdownTimerRef.current);
        countdownTimerRef.current = null;
      }

      if (streamState.isStreaming && engine) {
        try {
          // @ts-ignore
          await engine.stopPublishingStream();
          // @ts-ignore
          await engine.stopPreview();
        } catch (engineError) {
          console.warn('Engine cleanup error:', engineError);
        }
      }
    } catch (error) {
      console.error('Cleanup error:', error);
    }
  }, [streamState.isStreaming]);

  // Countdown effect
  useEffect(() => {
    if (!uiState.showCountdown || uiState.countdown <= 0) return;

    countdownTimerRef.current = setTimeout(() => {
      if (uiState.countdown === 1) {
        setUIState(prev => ({...prev, showCountdown: false, countdown: 0}));
        startStream();
      } else {
        setUIState(prev => ({...prev, countdown: prev.countdown - 1}));
      }
    }, 1000);

    return () => {
      if (countdownTimerRef.current) {
        clearTimeout(countdownTimerRef.current);
      }
    };
  }, [uiState.showCountdown, uiState.countdown]);

  // Engine event listeners setup
  useEffect(() => {
    if (!engine || !streamState.isEngineInitialized) return;

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
      console.log('Room user update:', {roomID, updateType, userList});
      if (updateType === 0) {
        if (userList?.length) {
          setUserCount(prev =>prev + userList?.length);
        }
        console.log(
          'Users joined:',
          userList.map(user => user.userName),
        );
      } else if (updateType === 1) {
        if (userList?.length) {
          setUserCount(prev => prev - userList?.length);
        }
        console.log(
          'Users left:',
          userList.map(user => user.userName),
        );
      }
    };

    const handleRoomStreamUpdate = (
      roomID: string,
      updateType: number,
      streamList: any[],
    ) => {
      console.log('Room stream update:', {roomID, updateType, streamList});
      if (updateType === 0) {
        console.log(
          'Streams added:',
          streamList.map(stream => stream.streamID),
        );
      } else if (updateType === 1) {
        console.log(
          'Streams removed:',
          streamList.map(stream => stream.streamID),
        );
      }
    };

    const handleRoomStateUpdate = (
      roomID: string,
      state: number,
      errorCode: number,
      extendedData: any,
    ) => {
      console.log('Room state update:', {
        roomID,
        state,
        errorCode,
        extendedData,
      });
    };

    const handleRoomOnlineUserCountUpdate = (roomID: string, count: number) => {
      setUserCount(count);
    };

    engine.on('IMRecvBroadcastMessage', handleBroadcastMessage);
    engine.on('roomUserUpdate', handleRoomUserUpdate);
    engine.on('roomStreamUpdate', handleRoomStreamUpdate);
    engine.on('roomStateUpdate', handleRoomStateUpdate);
    engine.on('roomOnlineUserCountUpdate', handleRoomOnlineUserCountUpdate);

    return () => {
      try {
        if (engine && typeof engine.off === 'function') {
          engine.off('IMRecvBroadcastMessage', handleBroadcastMessage);
          engine.off('roomUserUpdate', handleRoomUserUpdate);
          engine.off('roomStreamUpdate', handleRoomStreamUpdate);
          engine.off('roomStateUpdate', handleRoomStateUpdate);
          engine.off(
            'roomOnlineUserCountUpdate',
            handleRoomOnlineUserCountUpdate,
          );
        }
      } catch (error) {
        console.warn('Error removing event listeners:', error);
      }
    };
  }, [engine, streamState.isEngineInitialized]);

  // App state change handler
  useEffect(() => {
    const handleAppStateChange = (nextAppState: any) => {
      if (
        appStateRef.current.match(/inactive|background/) &&
        nextAppState === 'active'
      ) {
        console.log('App has come to the foreground!');
      } else if (nextAppState.match(/inactive|background/)) {
        if (streamState.isStreaming) {
          // Stop stream when app goes to background
          cleanup();
        }
      }
      appStateRef.current = nextAppState;
    };

    const subscription = AppState.addEventListener(
      'change',
      handleAppStateChange,
    );
    return () => subscription?.remove();
  }, [streamState.isStreaming, cleanup]);

  // Back handler
  useEffect(() => {
    const backAction = () => {
      if (uiState.showChatInput) {
        handleCloseChatInput();
        return true;
      }
      if (streamState.isStreaming) {
        Alert.alert(
          'End Stream',
          'Are you sure you want to end the live stream?',
          [
            {text: 'Cancel', style: 'cancel'},
            {text: 'End Stream', onPress: handleEndStream},
          ],
        );
        return true;
      }
      return false;
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );
    return () => backHandler.remove();
  }, [streamState.isStreaming, uiState.showChatInput]);

  // Initialize engine
  const initEngine = useCallback(async () => {
    if (!streamState.data) {
      Alert.alert('Error', 'Please create live stream first');
      return;
    }

    const {creatorId, token, roomId} = streamState.data;
    if (!creatorId || !token || !roomId) {
      Alert.alert('Error', 'Missing required stream data');
      return;
    }

    setUIState(prev => ({...prev, isLoading: true}));

    try {
      await initEngineAndLogin({
        appId: ZEGO_NEW_APP_ID,
        userId: creatorId,
        zegoToken: token,
        roomId,
        userName: user?.user?.username || user?.user?.name || 'Anonymous',
      });

      setStreamState(prev => ({...prev, isEngineInitialized: true}));
    } catch (error) {
      console.error('Engine initialization failed:', error);
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      Alert.alert('Error', `Failed to initialize engine: ${errorMessage}`);
    } finally {
      setUIState(prev => ({...prev, isLoading: false}));
    }
  }, [streamState.data, user?.user?.username]);

  // Start streaming
  const startStream = useCallback(async () => {
    if (!isReadyToStream) {
      Alert.alert('Error', 'Engine not ready. Please wait...');
      return;
    }

    if (!previewViewRef.current) {
      Alert.alert('Error', 'Preview view not ready');
      return;
    }

    setUIState(prev => ({...prev, isLoading: true}));

    try {
      await new Promise(resolve => setTimeout(resolve, PREVIEW_DELAY));

      // Enable camera and microphone before starting preview
      if (controlsState.isCameraEnabled) {
        await enableCamera(true);
      }
      if (controlsState.isMicrophoneEnabled) {
        await enableMicrophone(true);
      }

      const reactTag = findNodeHandle(previewViewRef.current);
      if (!reactTag) {
        throw new Error('Could not get preview view reference');
      }

      const previewCanvas = {
        reactTag,
        viewMode: 0, // ScaleAspectFit
        backgroundColor: 0x000000,
      };

      // @ts-ignore
      await engine.startPreview(previewCanvas);
      console.log('Preview started successfully');

      // @ts-ignore
      await engine.startPublishingStream(streamId);
      console.log('Publishing stream started successfully');

      setStreamState(prev => ({
        ...prev,
        isStreaming: true,
        currentStreamId: streamId,
      }));
    } catch (error) {
      console.error('Failed to start stream:', error);
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      Alert.alert('Error', `Failed to start stream: ${errorMessage}`);
    } finally {
      setUIState(prev => ({...prev, isLoading: false}));
    }
  }, [
    isReadyToStream,
    streamId,
    controlsState.isCameraEnabled,
    controlsState.isMicrophoneEnabled,
  ]);

  // Stop streaming
  const stopStream = useCallback(async () => {
    setUIState(prev => ({...prev, isLoading: true}));

    try {
      console.log('Stopping stream...');

      if (engine) {
        try {
          // @ts-ignore
          await engine.stopPublishingStream();
          console.log('Publishing stopped');
        } catch (error) {
          console.warn('Error stopping publishing:', error);
        }

        try {
          // @ts-ignore
          await engine.stopPreview();
          console.log('Preview stopped');
        } catch (error) {
          console.warn('Error stopping preview:', error);
        }
      }

      setStreamState(prev => ({
        ...prev,
        isStreaming: false,
        currentStreamId: null,
      }));
    } catch (error) {
      console.error('Failed to stop stream:', error);
      Alert.alert('Error', 'Failed to stop stream properly');

      setStreamState(prev => ({
        ...prev,
        isStreaming: false,
        currentStreamId: null,
      }));
    } finally {
      setUIState(prev => ({...prev, isLoading: false}));
    }
  }, []);

  // Handle end stream with confirmation
  const handleEndStream = useCallback(async () => {
    if (uiState.isLoading) return;

    Alert.alert(
      'End Live Stream',
      'Are you sure you want to end your live stream?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'End Stream',
          style: 'destructive',
          onPress: async () => {
            try {
              await stopStream();
              setTimeout(() => {
                navigateAndSimpleReset('UploadContent', {});
              }, 500);
            } catch (error) {
              console.error('Error ending stream:', error);
              navigateAndSimpleReset('UploadContent', {});
            }
          },
        },
      ],
      {cancelable: true},
    );
  }, [stopStream, uiState.isLoading]);

  // Control handlers
  const toggleCamera = useCallback(async () => {
    if (!isReadyToStream) return;

    try {
      const newCameraState = !controlsState.isCameraEnabled;
      await enableCamera(newCameraState);
      setControlsState(prev => ({...prev, isCameraEnabled: newCameraState}));
    } catch (error) {
      console.error('Failed to toggle camera:', error);
      Alert.alert('Error', 'Failed to toggle camera');
    }
  }, [controlsState.isCameraEnabled, isReadyToStream]);

  const toggleMicrophone = useCallback(async () => {
    if (!isReadyToStream) return;

    try {
      const newMicState = !controlsState.isMicrophoneEnabled;
      await enableMicrophone(newMicState);
      setControlsState(prev => ({...prev, isMicrophoneEnabled: newMicState}));
    } catch (error) {
      console.error('Failed to toggle microphone:', error);
      Alert.alert('Error', 'Failed to toggle microphone');
    }
  }, [controlsState.isMicrophoneEnabled, isReadyToStream]);

  const switchCameraDirection = useCallback(async () => {
    if (!isReadyToStream || !controlsState.isCameraEnabled) return;

    try {
      const newCameraDirection = !controlsState.isFrontCamera;
      await switchCamera(newCameraDirection);
      setControlsState(prev => ({...prev, isFrontCamera: newCameraDirection}));
    } catch (error) {
      console.error('Failed to switch camera:', error);
      Alert.alert('Error', 'Failed to switch camera');
    }
  }, [
    controlsState.isFrontCamera,
    controlsState.isCameraEnabled,
    isReadyToStream,
  ]);

  const startCloudRecording = useCallback(async () => {
    if (!engine || !streamState.isStreaming) {
      Alert.alert('Error', 'Start streaming first');
      return;
    }

    try {
      // Start local recording (will be uploaded to cloud)
      const config = {
        filePath: 'recording_' + Date.now() + '.mp4',
        recordType: 0, // Audio and video
      };

      // @ts-ignore
      await engine.startRecordingCapturedData(config);
      console.log('Cloud recording started');
    } catch (error) {
      console.error('Failed to start recording:', error);
      Alert.alert('Error', 'Failed to start recording');
    }
  }, []);

  const stopCloudRecording = useCallback(async () => {
    if (!engine) return;

    try {
      // @ts-ignore
      await engine.stopRecordingCapturedData();

      console.log('Cloud recording stopped');
    } catch (error) {
      console.error('Failed to stop recording:', error);
    }
  }, []);

  // Chat input handlers
  const handleShowChatInput = useCallback(() => {
    setUIState(prev => ({...prev, showChatInput: true}));
    setTimeout(() => {
      messageInputRef.current?.focus();
    }, 100);
  }, []);

  const handleCloseChatInput = useCallback(() => {
    setUIState(prev => ({...prev, showChatInput: false}));
    setMessage('');
    Keyboard.dismiss();
  }, []);

  const sendChatMessage = useCallback(
    async (messageText?: string) => {
      const textToSend = messageText || message;
      if (!textToSend.trim() || !engine || !streamState.data?.roomId) return;

      try {
        const result = await engine.sendBroadcastMessage(
          streamState.data.roomId,
          textToSend.trim(),
        );
        console.log('Message sent successfully:', result);

        const newMessage: ConvertedMessage = {
          id: String(result?.messageID || Date.now()),
          username: user?.user?.username || user?.user?.name || 'You',
          message: textToSend.trim(),
          timestamp: Date.now(),
        };

        setMessagesList(prevMessages => [...prevMessages, newMessage]);
        setMessage('');

        if (uiState.showChatInput) {
          handleCloseChatInput();
        }
      } catch (error) {
        console.error('Failed to send message:', error);
        Alert.alert('Error', 'Failed to send message');
      }
    },
    [
      message,
      user?.user?.username,
      user?.user?.name,
      streamState.data?.roomId,
      uiState.showChatInput,
      handleCloseChatInput,
    ],
  );

  const handleSendMessage = useCallback(() => {
    sendChatMessage();
  }, [sendChatMessage]);

  // Initialize engine on mount
  useEffect(() => {
    initEngine();
    return () => {
      cleanup();
    };
  }, []);

  // Skip countdown handler
  const handleSkipCountdown = useCallback(() => {
    if (countdownTimerRef.current) {
      clearTimeout(countdownTimerRef.current);
    }
    setUIState(prev => ({...prev, showCountdown: false, countdown: 0}));
    startStream();
  }, [startStream]);

  // Render methods
  const renderCountdownModal = () => (
    <Modal visible={uiState.showCountdown} transparent animationType="fade">
      <View style={styles.modalOverlay}>
        <View style={styles.modalHeader}>
          <View style={styles.modalContainer}>
            <Text style={styles.countdownTitle}>Starting in</Text>
            <Text style={styles.countdownText}>{uiState.countdown}s</Text>
            <TouchableOpacity
              style={styles.skipButton}
              onPress={handleSkipCountdown}>
              <Text style={styles.skipButtonText}>Skip countdown</Text>
            </TouchableOpacity>
          </View>
        </View>
        <TouchableOpacity style={styles.cancelButton} onPress={navigateBack}>
          <CrossIcon fill={Colors.black} width={20} height={20} />
          <Text style={styles.cancelButtonText}>Cancel</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );

  const renderControls = () => (
    <View style={[styles.buttonContainer]}>
      <View style={{alignItems: 'center'}}>
        <CustomButton
          text={streamState.isStreaming ? 'End Stream' : 'Go Live'}
          onPress={streamState.isStreaming ? handleEndStream : startStream}
          btnStyle={[
            styles.createButton,
            streamState.isStreaming && styles.endStreamButton,
          ]}
          textStyle={[
            styles.createButtonText,
            streamState.isStreaming && styles.endStreamButtonText,
          ]}
          disabled={
            uiState.isLoading || (!streamState.isStreaming && !isReadyToStream)
          }
          icon={
            streamState.isStreaming ? (
              <EndLiveScreen width={20} height={20} />
            ) : (
              <LiveIcon
                fill={streamState.isStreaming ? Colors.white : Colors.black}
                width={20}
                height={20}
              />
            )
          }
        />
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Full screen preview view - this should be the background */}
      <ZegoTextureView ref={previewViewRef} style={styles.previewView} />

      {/* Overlay content */}
      <View style={[styles.flex, {marginTop: top}]}>
        <View style={styles.watchCountContainer}>
          <EyeShowIcon height={17} width={17} fill={Colors.white} />
          <Text style={styles.viewCount}>
            {Math.max((userCount || 0) - 2, 0)}
          </Text>
        </View>

        {streamState.isStreaming && (
          <View style={styles.liveIndicator}>
            <VideoIcon height={17} width={17} fill={Colors.white} />
          </View>
        )}
      </View>

      <View style={styles.settingsContainer}>
        <TouchableOpacity
          style={styles.settingsButton}
          onPress={toggleMicrophone}
          disabled={uiState.isLoading}>
          {controlsState.isMicrophoneEnabled ? <MuteIcon /> : <UnmuteIcon />}
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.settingsButton}
          onPress={toggleCamera}
          disabled={uiState.isLoading}>
          {controlsState.isCameraEnabled ? (
            <CameraHideIcon />
          ) : (
            <CameraShowIcon />
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.settingsButton}
          onPress={switchCameraDirection}
          disabled={uiState.isLoading || !controlsState.isCameraEnabled}>
          <SwitchCameraIcon />
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView
        style={styles.inputView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 60 : 0}>
        <View style={styles.bottomContainer}>
          <LIveChatList chatData={messagesList} />
        </View>

        <View style={styles.chatContainer}>
          <TextInput
            style={styles.chatInput}
            placeholder="Chat..."
            placeholderTextColor="#FFFFFF80"
            value={message}
            onChangeText={setMessage}
            returnKeyType="send"
            onSubmitEditing={handleSendMessage}
          />
        </View>
      </KeyboardAvoidingView>

      {renderControls()}
      {renderCountdownModal()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.black,
  },
  previewView: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: '100%',
    height: '100%',
  },
  buttonContainer: {
    position: 'absolute',
    bottom: Platform.OS === 'ios' ? 20 : 0,
    left: 0,
    right: 0,

    paddingHorizontal: 20,
  },
  settingsContainer: {
    // flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderRadius: 20,
    marginBottom: 0,
    position: 'absolute',
    top: 100,
    right: 10,
    zIndex: 999,
  },
  settingsButton: {
    padding: 13,
  },
  chatButtonText: {
    fontSize: fontSize.f18,
    color: Colors.white,
  },
  createButton: {
    backgroundColor: Colors.white,
    borderRadius: 25,
    height: 40,
    width: '35%',
  },
  createButtonText: {
    color: Colors.black,
    fontSize: fontSize.f14,
    fontFamily: fonts['Poppins-SemiBold'],
  },
  endStreamButton: {
    backgroundColor: '#2B2929',
    width: '50%',
  },
  endStreamButtonText: {
    color: Colors.white,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalHeader: {
    flex: 0.7,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  modalContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  countdownTitle: {
    color: Colors.white,
    fontSize: fontSize.f18,
    fontFamily: fonts['Poppins-Medium'],
    marginBottom: 10,
  },
  countdownText: {
    color: Colors.white,
    fontSize: 48,
    fontFamily: fonts['Poppins-Bold'],
    marginBottom: 30,
  },
  skipButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 25,
    paddingVertical: 12,
    paddingHorizontal: 24,
    marginBottom: 20,
  },
  skipButtonText: {
    color: Colors.white,
    fontSize: fontSize.f12,
    fontFamily: fonts['Poppins-Medium'],
  },
  cancelButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(238, 238, 238, 1)',
    padding: 10,
    borderRadius: 25,
  },
  cancelButtonText: {
    color: Colors.black,
    fontSize: fontSize.f14,
    fontFamily: fonts['Poppins-Medium'],
    marginLeft: 8,
  },
  // Chat Input Styles
  chatInputOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'flex-end',
  },
  chatInputBackdrop: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  chatInputContainer: {
    backgroundColor: 'rgba(30, 30, 30, 0.95)',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    paddingBottom: Platform.OS === 'ios' ? 40 : 20,
  },
  chatInputHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  chatInputTitle: {
    color: Colors.white,
    fontSize: fontSize.f16,
    fontFamily: fonts['Poppins-SemiBold'],
  },
  messageInputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 25,
    paddingHorizontal: 15,
    paddingVertical: 5,
    marginBottom: 10,
  },
  messageInput: {
    flex: 1,
    color: Colors.white,
    fontSize: fontSize.f14,
    fontFamily: fonts['Poppins-Regular'],
    maxHeight: 100,
    paddingVertical: 12,
    paddingRight: 10,
  },
  sendButton: {
    backgroundColor: Colors.white,
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginLeft: 10,
  },
  sendButtonDisabled: {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  sendButtonText: {
    color: Colors.black,
    fontSize: fontSize.f12,
    fontFamily: fonts['Poppins-SemiBold'],
  },
  sendButtonTextDisabled: {
    color: 'rgba(0, 0, 0, 0.5)',
  },
  characterCount: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: fontSize.f12,
    fontFamily: fonts['Poppins-Regular'],
    textAlign: 'right',
    marginTop: 5,
  },

  flex: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: wp('5'),
    height: 40,
    position: 'absolute',
    zIndex: 999,
    width: '100%',
  },

  watchCountContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  liveIndicator: {
    padding: 2,
    backgroundColor: Colors.red,
    borderRadius: 4,
    marginLeft: 10,
  },

  viewCount: {
    marginLeft: 7,
    fontSize: fontSize.f12,
    color: Colors.white,
    fontFamily: fonts['Poppins-Medium'],
  },

  //new

  inputView: {
    position: 'absolute',
    // top: 0,
    left: 0,
    right: 0,
    bottom: 100,
  },

  bottomContainer: {
    width: '100%',
    height: hp('35'),
  },

  chatContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 5,
    paddingHorizontal: 5,
    // paddingVertical: 12,s
    flex: 1,
    // marginRight: 15,
    height: 40,
    width: '90%',
    alignSelf: 'center',
  },
  chatInput: {
    flex: 1,
    fontSize: fontSize.f14,
    color: Colors.white,
    fontFamily: fonts['Poppins-Medium'],
  },
});
