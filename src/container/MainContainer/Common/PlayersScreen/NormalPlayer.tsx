import React, {useCallback, useEffect, useRef, useState} from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  Pressable,
  Text,
  Image,
  Alert,
  Platform,
} from 'react-native';
import {NormalPlayerProps} from '../../../../navigation/screens';
import {fonts} from '@constant/fontfamily';
import {OnProgressData} from 'react-native-video';
import CustomPlayerHeader from '@components/PlayerScreenComponent/CustomPlayerHeader';
import CustomVideoPlayer from '@components/PlayerScreenComponent/CustomVideoPlayer';
import Controlers from '@components/PlayerScreenComponent/Controlers';
import PlayerBottom from '@components/PlayerScreenComponent/PlayerBottom';
import {useGetStreamByIdQuery} from '@rtkServices/ShortsService';
import {getDummyStreamById, isDummyReelId} from '@utils/dummyVideos';
import {
  useLikeContentMutation,
  useFollowUnfollowUserMutation,
  useViewContentMutation,
  useNotInterestedMutation,
  useReportContentMutation,
} from '@rtkServices/ContentActionService';
import Loader from '@components/CustomLoader/Loader';
import {fontSize, height} from '@constant/fontSize';
import {useToastMessage} from '@hooks/useToastMessage';
import CustomBottomSheet from '@components/CustomBottomSheet/CustomBottomSheet';
import {
  OtherNormalPlayerOption,
  PlaybackSpeedOptions,
  REPORT_DATA,
  SelfNormalPlayerOption,
} from '@utils/data';
import {Colors} from '@constant/colors';
import CustomRadioButton from '@components/CustomRadioButton/CustomRadioButton';
import {useDeleteStreamMutation} from '@rtkServices/NewStreamService';
import {RootState, useAppSelector} from '@store/index';
import {SafeAreaView} from 'react-native-safe-area-context';
import NewCommentSheet from '@components/Common/NewCommentSheet';
const SEEK_INTERVAL = 10;

const NormalPlayer = ({navigation, route}: NormalPlayerProps) => {
  const newCommentSheetRef = useRef<any>(null);
  const {user} = useAppSelector((state: RootState) => state.user);
  const {streamId}: any = route?.params ?? {streamId: ''};
  const videoPlayer: any = useRef(null);
  const sheetRef = useRef(null);
  const [paused, setPaused] = useState<boolean>(false);
  const [muted, setMute] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [playbackRate, setPlaybackRate] = useState<number>(1);
  const [isOpenSheet, setIsOpenSheet] = useState<boolean>(false);
  const [isReportSheet, setIsReportSheet] = useState<boolean>(false);
  const [isPlaybackSheet, setIsPlayBackSheet] = useState<boolean>(false);
  const [selectedFilter, setSelectedFilter] = useState<any>('');

  const {showError, showSuccess} = useToastMessage();
  const isDummyStream = isDummyReelId(streamId);
  const dummyStream = isDummyStream ? getDummyStreamById(streamId) : undefined;
  const [likeContent] = useLikeContentMutation();
  const [followUnfollowUser] = useFollowUnfollowUserMutation();
  const [viewContent] = useViewContentMutation();
  const [reportUser] = useReportContentMutation();
  const [notIntrestReq] = useNotInterestedMutation();
  const [deleteStream] = useDeleteStreamMutation();
  const {data: apiStreamData, isLoading: apiLoading} = useGetStreamByIdQuery(
    {id: streamId},
    {skip: !streamId || isDummyStream},
  );
  const streamData = dummyStream ? {data: dummyStream} : apiStreamData;
  const isLoading = isDummyStream ? false : apiLoading;

  const CreatorData = streamData?.data?.creator;
  const isFollowing = streamData?.data?.isFollowing;
  const maxValueSlider = Math?.ceil(streamData?.data?.duration || 0);
  const [like, setLike] = useState<boolean>(streamData?.data?.isLiked || false);
  const [likeCount, setLikeCount] = useState<number>(
    typeof streamData?.data?.likesCount === 'number'
      ? streamData.data.likesCount
      : 0,
  );
  const [isFollowingState, setIsFollowingState] = useState<boolean>(
    !!streamData?.data?.isFollowing,
  );

  useEffect(() => {
    if (streamData?.data?.isFollowing !== undefined) {
      setIsFollowingState(!!streamData.data.isFollowing);
    }
  }, [streamData?.data?.isFollowing]);

  // Sync like state and like count when API data changes
  useEffect(() => {
    const incomingIsLiked = streamData?.data?.isLiked;
    const incomingLikesCount = streamData?.data?.likesCount;

    if (typeof incomingIsLiked === 'boolean') {
      setLike(incomingIsLiked);
    }
    if (typeof incomingLikesCount === 'number') {
      setLikeCount(incomingLikesCount);
    }
  }, [streamData?.data?.isLiked, streamData?.data?.likesCount]);

  useEffect(() => {
    if (streamId && streamData?.data?._id) {
      handleViewContent();
    }
  }, [streamData]);

  // Handle view content
  const handleViewContent = useCallback(async () => {
    if (!streamId || !streamData?.data?._id || isDummyReelId(streamId)) return;
    try {
      await viewContent({
        contentId: streamId,
        contentType: 'streams',
      }).unwrap();
    } catch (error) {
      console.error('View content error:', error);
    }
  }, [streamId, streamData?.data?._id, viewContent]);

  const seekForward = () => {
    const newTime = Math?.max(currentTime + SEEK_INTERVAL, 0);
    videoPlayer?.current?.seek(newTime);
    setCurrentTime(newTime);
  };
  const seekBackward = () => {
    const newTime = Math?.max(currentTime - SEEK_INTERVAL, 0);
    videoPlayer?.current?.seek(newTime);
    setCurrentTime(newTime);
  };
  const onSeek = useCallback(
    (time: number): void => {
      videoPlayer?.current?.seek(time);
      setCurrentTime(time);
    },
    [currentTime],
  );
  const onProgress = (data: OnProgressData): void => {
    setCurrentTime(data?.currentTime);
  };
  const onLoad = (): void => {
    setDuration(Math.floor(duration));
  };

  const closeSheet = () => {
    setIsOpenSheet(false);
    setIsReportSheet(false);
  };
  const handleFollow = useCallback(async () => {
    if (!CreatorData?._id) return;

    try {
      const response = await followUnfollowUser({
        targetUserId: CreatorData._id,
      }).unwrap();

      if (response?.success) {
        showSuccess(response?.message || '');
        setIsFollowingState(prev => {
          return !prev;
        });
      }
    } catch (error: any) {
      showError(error?.data?.message || '');
    }
  }, [CreatorData?._id, isFollowing, followUnfollowUser]);
  const handleLike = useCallback(async () => {
    if (!streamData?.data?._id) return;

    const prevLike = like;
    const prevLikeCount = likeCount;

    setLike(!prevLike);
    setLikeCount(prevLike ? prevLikeCount - 1 : prevLikeCount + 1);

    if (isDummyReelId(streamData?.data?._id)) {
      return;
    }

    try {
      const response = await likeContent({
        contentType: 'streams',
        content_id: streamData?.data?._id,
      }).unwrap();

      if (!response?.success) {
        // Revert on failure
        setLike(prevLike);
        setLikeCount(prevLikeCount);
        showError('An error occurred');
      }
    } catch (error) {
      console.error('Like/Unlike error:', error);
      // Revert on error
      setLike(prevLike);
      setLikeCount(prevLikeCount);
      showError('An error occurred');
    }
  }, [like, likeCount, streamData?.data?._id, likeContent]);
  const reportSubmit = async (item: any) => {
    const reasonLabel = item?.label;
    if (!reasonLabel) {
      showError('Reason is missing.');
      return;
    }
    const body = {
      contentId: streamId,
      reason: reasonLabel,
      contentType: 'streams',
      description: 'test',
    };
    await reportUser(body).then(res => {
      if (res?.data) {
        showSuccess(res?.data?.message || '');
        closeSheet();
      }
      if (res?.error) {
        showError(res?.error?.data?.message || 'Somthing went wrong');
      }
    });
  };
  const notIntrested = async () => {
    const body = {
      contentId: streamId,
      contentType: 'streams',
    };
    await notIntrestReq(body).then(res => {
      if (res?.data) {
        showSuccess(res?.data?.message || '');
        closeSheet();
      }
      if (res?.error) {
        showError(res?.error?.data?.message || 'Somthing went wrong');
      }
    });
  };
  const handleDeleteStream = async () => {
    await deleteStream({streamId: streamId}).then(res => {
      if (res?.data) {
        showSuccess(res?.data?.message || '');
        navigation.goBack();
      }
      if (res?.error) {
        showError(res?.error?.data?.message || 'Somthing went wrong');
      }
    });
  };

  const selectPlaybackSpeed = (item: any) => {
    setPlaybackRate(item?.value);
    setIsOpenSheet(false);
    setIsPlayBackSheet(false);
  };
  const renderPlaybackSpeedItem = useCallback(
    ({item}: {item: {id: number; label: string; value: number}}) => (
      <Pressable
        onPress={() => selectPlaybackSpeed(item)}
        style={[styles.videoQualityItem]}>
        <Text style={styles.videoQualityItemText}>{item.label}</Text>
      </Pressable>
    ),
    [playbackRate],
  );
  const RenderPlaybackSpeedSheet = useCallback(
    () => (
      <View style={styles.sheetContent}>
        <FlatList
          data={PlaybackSpeedOptions}
          renderItem={renderPlaybackSpeedItem}
          showsVerticalScrollIndicator={false}
        />
      </View>
    ),
    [renderPlaybackSpeedItem, styles.sheetContent],
  );
  const renderItem = useCallback(
    ({item}: {item: {id: number; name: string; image: any}}) => (
      <Pressable
        onPress={() => handleSheetItemPress(item?.id)}
        style={styles.sheetItem}>
        <View style={styles.itemContainer}>
          <Image
            source={item.image}
            style={styles.image}
            tintColor={item?.id == 4 ? '#e64258' : ''}
          />
          <Text style={styles.name}>{item.name}</Text>
        </View>
      </Pressable>
    ),
    [],
  );
  const RenderSheet = useCallback(
    () => (
      <View style={styles.sheetContent}>
        <FlatList
          data={
            user?._id == CreatorData?._id
              ? SelfNormalPlayerOption
              : OtherNormalPlayerOption
          }
          renderItem={renderItem}
          showsVerticalScrollIndicator={false}
        />
      </View>
    ),
    [CreatorData?._id],
  );
  const RenderReportSheet = useCallback(
    () => (
      <View style={styles.sheetContent}>
        <CustomRadioButton
          data={REPORT_DATA}
          selectedFilter={selectedFilter?.value}
          onPress={(item: any) => setSelectedFilter(item)}
          customTitleStyle={{}}
        />
      </View>
    ),
    [selectedFilter, styles.sheetContent],
  );
  const handleSheetItemPress = useCallback((itemId: number) => {
    if (itemId === 1) {
      setIsPlayBackSheet(true);
    } else if (itemId === 2) {
      setIsReportSheet(true);
    } else if (itemId === 3) {
      notIntrested();
    } else if (itemId === 4) {
      handleDeleteStream();
    }
  }, []);

  return (
    <SafeAreaView edges={['top']} style={styles.container}>
      {isLoading ? (
        <Loader visible={isLoading} />
      ) : (
        <>
          <View style={styles.videoContainer}>
            <CustomPlayerHeader
              navigation={navigation}
              CreatorData={CreatorData}
              isFollowing={isFollowingState}
              selectedUrl={streamData?.data}
              streamDetail={streamData}
              handleFollow={handleFollow}
              handleSetting={() => setIsOpenSheet(true)}
              type={'normal'}
              showSettingIcon={true}
            />

            <CustomVideoPlayer
              playerRef={videoPlayer}
              uri={streamData?.data?.videoUrl}
              paused={paused}
              muted={muted}
              onProgress={onProgress}
              onLoad={onLoad}
              playbackRate={playbackRate}
              onError={err => console.log(err)}
            />
            <Controlers
              paused={paused}
              setPaused={setPaused}
              muted={muted}
              setMuted={setMute}
              isLive={false}
              seekBackward={seekBackward}
              seekForward={seekForward}
            />
            <View style={styles.bottomView}>
              {!isOpenSheet && (
                <PlayerBottom
                  streamDetail={streamData}
                  currentTime={currentTime}
                  onSeek={onSeek}
                  handleLike={handleLike}
                  like={like}
                  likeCount={likeCount}
                  maxValueSlider={maxValueSlider}
                  setIsCommentSheetOpen={() => {}}
                  isCommentSheetOpen={false}
                  openNewCommentSheet={() => {
                    setTimeout(() => {
                      newCommentSheetRef.current?.open();
                    }, 500);
                  }}
                />
              )}
            </View>
            {isOpenSheet && (
              <CustomBottomSheet
                label={''}
                ref={sheetRef}
                index={user?._id == CreatorData?._id ? 0 : 1}
                renderView={RenderSheet}
                onClose={() => setIsOpenSheet(false)}
                onPress={() => setIsOpenSheet(false)}
              />
            )}
            {isReportSheet && (
              <CustomBottomSheet
                label={'Report Problem'}
                ref={sheetRef}
                index={3}
                renderView={RenderReportSheet}
                onClose={() => setIsReportSheet(false)}
                onPress={() => setIsReportSheet(false)}
                onSubmit={() => reportSubmit(selectedFilter)}
              />
            )}
            {isPlaybackSheet && (
              <CustomBottomSheet
                label={'Playback Speed'}
                ref={sheetRef}
                index={3}
                renderView={RenderPlaybackSpeedSheet}
                onClose={() => setIsPlayBackSheet(false)}
                onPress={() => setIsPlayBackSheet(false)}
              />
            )}
          </View>
        </>
      )}

      <NewCommentSheet
        ref={newCommentSheetRef}
        itemId={streamId}
        creatorId={CreatorData?._id}
        currentItemType="streams"
      />
    </SafeAreaView>
  );
};

export default NormalPlayer;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1538',
  },
  videoContainer: {
    flex: 1,
    backgroundColor: 'transparent',
    zIndex: 1,
  },
  sheetContent: {
    height: height * 0.45,
    maxHeight: height * 0.8,
    minHeight: height * 0.3,
    zIndex: 7,
    alignContent: 'flex-end',
    marginTop: 15,
  },
  sheetItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 6,
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
  },
  image: {
    width: 27,
    height: 27,
  },
  name: {
    color: Colors.white,
    fontSize: fontSize.f14,
    fontFamily: fonts['Poppins-Medium'],
    marginLeft: 10,
  },
  videoQualityItemText: {
    color: Colors.white,
    fontFamily: fonts['Poppins-Medium'],
    fontSize: fontSize.f12,
  },
  videoQualityItem: {
    height: 50,
    width: '100%',
    marginTop: 5,
    borderRadius: 5,
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  bottomView: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 100,
  },
});
