import {
  View,
  StyleSheet,
  Dimensions,
  Text,
  TouchableOpacity,
  Modal,
  AppState,
  Pressable,
} from 'react-native';
import React, {useState, useRef, useEffect, useCallback} from 'react';
import {RootState, useAppSelector} from '@store/index';
import {fonts} from '@constant/fontfamily';
import Video, {VideoRef} from 'react-native-video';
import {useNavigation} from '@react-navigation/native';
import {TouchableWithoutFeedback} from 'react-native';
import {
  UnLikeIcon,
  OptionIcon,
  PauseIcon,
  PlayIcon,
  ShortsCommentIcon,
  ShortsShareIcon,
} from '@assets/svg/ShortsIcon';
import FastImage from 'react-native-fast-image';
import {LikeIcon} from '@assets/svg/CommonIcons';
import CustomBottomSheet from '@components/CustomBottomSheet/CustomBottomSheet';
import CustomRadioButton from '@components/CustomRadioButton/CustomRadioButton';
import {REPORT_DATA} from '@utils/data';
import {
  useFollowUnfollowUserMutation,
  useLikeContentMutation,
  useNotInterestedMutation,
  useReportContentMutation,
  useSaveUnsaveContentMutation,
  useViewContentMutation,
} from '@rtkServices/ContentActionService';
import {useDeleteShortsMutation} from '@rtkServices/ShortsService';
import {Colors} from '@constant/colors';
import {fontSize} from '@constant/fontSize';
import {useToastMessage} from '@hooks/useToastMessage';
import {navigate} from '@navigation/utils';
import {BackArrow} from '@assets/svg/AuthFlowIcons';
const {width, height} = Dimensions.get('window');
const ShortRealComponent = ({
  item,
  index,
  isFocused = true,
  commentPress,
  onCommentCountChange,
  onDeleteSuccess,
  reel_height,
}: any) => {
  const {showError, showSuccess} = useToastMessage();
  const {user} = useAppSelector((state: RootState) => state.user);
  const videoRef = useRef<VideoRef>(null);
  const optionButtonRef = useRef<View>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalPosition, setModalPosition] = useState({top: 0, right: 0});
  const navigation = useNavigation<any>();
  const appState = useRef(AppState.currentState);
  const [appStateVisible, setAppStateVisible] = useState(appState.current);
  const [showPauseIcon, setShowPauseIcon] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState<any>('');
  const [isPause, setPause] = useState(false);
  const [following, setFollowing] = useState(item?.isFollowing);
  const sheetRef = useRef(null);
  const [isOpenSheet, setIsOpenSheet] = useState<boolean>(false);
  const [like, setLike] = useState(item?.isLiked);
  const [numberLiked, setNumberLiked] = useState<number>(item?.likesCount);
  const [isSaved, setIsSaved] = useState<boolean>(item?.isSaved);
  const [numberComment, setnumberComment] = useState<number>(
    item?.commentCount,
  );
  const [likeShortsReq] = useLikeContentMutation();
  const [followAndUnfollow] = useFollowUnfollowUserMutation();
  const [saveUnsaveContent] = useSaveUnsaveContentMutation();
  const [viewContent] = useViewContentMutation();
  const [reportUser] = useReportContentMutation();
  const [notIntrestReq] = useNotInterestedMutation();
  const [deleteShorts, {isLoading: isDeletingShorts}] =
    useDeleteShortsMutation();

  useEffect(() => {
    const subscription = AppState.addEventListener('change', nextAppState => {
      appState.current = nextAppState;
      setAppStateVisible(nextAppState);
    });
    return () => {
      subscription.remove();
    };
  }, []);

  useEffect(() => {
    setnumberComment(item?.commentCount || 0);
  }, [item?.commentCount]);

  useEffect(() => {
    if (appStateVisible !== 'active' && videoRef.current) {
      // Force pause when app is in background
      setPause(true);
    }
  }, [appStateVisible]);

  useEffect(() => {
    const unsubscribe = navigation.addListener('beforeRemove', () => {
      setPause(true);
    });
    return unsubscribe;
  }, [navigation]);

  const handleFollowToggle = async () => {
    try {
      const payload = {targetUserId: item?.creator?._id};
      await followAndUnfollow(payload).then((res: any) => {
        if (res?.data) {
          setFollowing((prev: boolean) => {
            return !prev;
          });
        }
        if (res?.error) {
          showError(
            res?.error?.data?.message
              ? res?.error?.data?.message
              : res?.error?.data,
          );
        }
      });
    } catch (error) {
      console.log('Follow/Unfollow error:', error);
      showError('An error occurred');
    }
  };
  const handleOpenOptions = () => {
    if (optionButtonRef.current) {
      optionButtonRef.current.measure(
        (x: any, y: any, width: any, height: any, pageX: any, pageY: any) => {
          setModalPosition({
            top: pageY + height + 5,
            right: width + 10,
          });
          setModalVisible(true);
        },
      );
    }
  };
  const pause = () => {
    setPause(prev => !prev);
    setShowPauseIcon(true);
    setTimeout(() => setShowPauseIcon(false), 1000);
  };
  const report = () => {
    setPause(true);
    setModalVisible(false);
    setIsOpenSheet(true);
  };
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
  const handleLikePress = useCallback(
    async (short_id: string) => {
      const prevLike = like;
      const prevNumberLiked = numberLiked;
      setLike(!prevLike);
      setNumberLiked(prevLike ? prevNumberLiked - 1 : prevNumberLiked + 1);
      try {
        const res = await likeShortsReq({
          content_id: short_id,
          contentType: 'shorts',
        }).unwrap();
      } catch (error) {
        console.error('Error liking shorts:', error);
        setLike(prevLike);
        setNumberLiked(prevNumberLiked);
      }
    },
    [like, numberLiked, likeShortsReq],
  );
  const onLikePress = (id: string) => {
    handleLikePress(id);
  };
  const handelDelete = async () => {
    setModalVisible(false);
    try {
      const result = await deleteShorts({id: item?._id}).unwrap();
      if (result?.success) {
        showSuccess(result?.message || 'Short deleted successfully');
        if (onDeleteSuccess) {
          onDeleteSuccess(item?._id);
        }
      }
    } catch (error: any) {
      console.error('Error deleting shorts:', error);
      showError(
        error?.data?.message ||
          error?.response?.data?.message ||
          'Failed to delete short',
      );
    }
  };
  const handleNotInterestedShorts = async () => {
    const contentId = item?._id || '';
    const body = {
      contentId: contentId,
      contentType: 'shorts',
    };
    await notIntrestReq(body).then(res => {
      if (res?.data) {
        setModalVisible(false);
        showSuccess(res?.data?.message);
      }
      if (res?.error) {
        showError(res?.error?.data?.message || 'Somthing went wrong');
        setModalVisible(false);
      }
    });
  };
  const handleReportPress = async (topic: string) => {
    const body = {
      contentId: item?._id || '',
      contentType: 'shorts',
      reason: topic,
      description: 'test',
    };
    await reportUser(body).then(res => {
      if (res?.data) {
        setIsOpenSheet(false);
        setPause(false);
        showSuccess(res?.data?.message);
      }
      if (res?.error) {
        showError(res?.error?.data?.message || 'Somthing went wrong');
        setIsOpenSheet(false);
        setPause(false);
      }
    });
  };
  const handleSaveUnsaveContent = async () => {
    const res = await saveUnsaveContent({
      content_id: item?._id,
      contentType: 'shorts',
      action: isSaved ? 'unsave' : 'save',
    });
    if (res?.data) {
      setModalVisible(false);
      showSuccess(isSaved ? 'Unsaved' : 'Saved');
      setIsSaved(!isSaved);
    }
    if (res?.error) {
      showError(res?.error?.data?.message);
    }
  };
  const handleViewContent = async () => {
    try {
      const res = await viewContent({
        contentId: item?._id,
        contentType: 'shorts',
      }).unwrap();
    } catch (error) {
      console.error('Error viewing content:', error);
    }
  };
  useEffect(() => {
    if (isFocused && item?._id) {
      handleViewContent();
    }
  }, [isFocused, item?._id]);

  const handleViewProfile = () => {
    setPause(true);
    if (user?._id === item?.creator?._id) {
      if (user?.membership === 'creator') {
        navigation.navigate('HomeScreen', {
          screen: 'CreatorProfile',
          params: {userId: item?.creator?._id},
        });
      } else {
        navigation.navigate('HomeScreen', {
          screen: 'UserProfile',
          params: {userId: item?.creator?._id},
        });
      }
    } else {
      navigate('OtherUserProfile', {userId: item?.creator?._id});
    }
  };

  const handleBackPress = () => {
    setPause(true);
    if (navigation.canGoBack()) {
      navigation.goBack();
    } else {
      navigation.navigate('HomeScreen');
    }
  };
  return (
    <View key={index} style={[styles.container, {height: reel_height}]}>
      <TouchableWithoutFeedback onPress={pause}>
        <Video
          ref={videoRef}
          source={{uri: item?.videoUrl}}
          style={[styles.videoStyle, {height: reel_height}]}
          resizeMode={'contain'}
          repeat={true}
          controls={false}
          paused={!isFocused || appStateVisible !== 'active' || isPause}
          muted={false}
          playInBackground={false}
          playWhenInactive={false}
          onError={error =>
            console.log('Video Error:', JSON.stringify(error, null, 2))
          }
        />
      </TouchableWithoutFeedback>
      <View style={[styles.userDetailContainer]}>
        <View
          style={{
            alignItems: 'center',
            justifyContent: 'flex-start',
            flexDirection: 'row',
          }}>
          <TouchableOpacity
            hitSlop={20}
            onPress={handleBackPress}
            style={styles.icon}>
            <BackArrow color={'white'} height={24} width={23} hitSlop={20} />
          </TouchableOpacity>
          <TouchableOpacity onPress={handleViewProfile} style={styles.left}>
            <FastImage
              source={
                item?.creator?.profilePicture
                  ? {uri: item?.creator?.profilePicture}
                  : require('@assets/images/DummyUserImage.png')
              }
              style={styles.avatar}
            />
            <Text style={styles.userNameStyle} ellipsizeMode="tail">
              {item?.creator?.username}
            </Text>
          </TouchableOpacity>
          {item?.creator?._id !== user?._id && (
            <Pressable
              onPress={handleFollowToggle}
              style={[styles.followButton]}>
              <Text style={[styles.followText]}>
                {following ? 'Following' : 'Follow'}
              </Text>
            </Pressable>
          )}
        </View>
        <TouchableOpacity ref={optionButtonRef} onPress={handleOpenOptions}>
          <OptionIcon height={15} width={15} fill={'#ffffff'} />
        </TouchableOpacity>
      </View>
      {!isOpenSheet && (
        <View style={styles.likeContainer}>
          <TouchableOpacity
            style={styles.center}
            onPress={() => onLikePress(item?._id)}>
            {like ? (
              <LikeIcon
                height={30}
                width={30}
                fill={Colors.red}
                stroke={Colors.red}
                strokeWidth={1.8287}
              />
            ) : (
              <UnLikeIcon
                height={30}
                width={30}
                fill={'transparent'}
                stroke={'#ffffff'}
                strokeWidth={1.8287}
              />
            )}
            <Text style={styles.name}>{numberLiked}</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={commentPress} style={styles.center}>
            <ShortsCommentIcon
              height={30}
              width={30}
              fill={'transparent'}
              stroke={'#ffffff'}
              strokeWidth={1.75556}
            />
            <Text style={styles.name}>{item?.commentsCount || 0}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.center}>
            <ShortsShareIcon height={30} width={30} fill={'transparent'} />
            <Text style={styles.name}>{item?.shares || 0}</Text>
          </TouchableOpacity>
        </View>
      )}
      {/* Caption and Tags */}
      {!isOpenSheet && (
        <View style={styles.captionContainer}>
          <View style={styles.captionRow}>
            <Text style={styles.description}>{item?.description}</Text>
            {item?.tags && item?.tags.length > 0 && (
              <Text style={styles.tags}>
                {item.tags.map((tag: any) => `#${tag}`).join(' ')}
              </Text>
            )}
          </View>
        </View>
      )}
      {showPauseIcon && (
        <View style={styles.muteIconOverlay}>
          {isPause ? (
            <PauseIcon height={24} width={24} fill={'#ffffff'} />
          ) : (
            <PlayIcon height={24} width={24} fill={'#ffffff'} />
          )}
        </View>
      )}

      {isOpenSheet && (
        <CustomBottomSheet
          label={'Report Problem'}
          ref={sheetRef}
          index={2}
          renderView={RenderReportSheet}
          onClose={() => {
            setIsOpenSheet(false);
            setPause(false);
          }}
          onPress={() => setIsOpenSheet(false)}
          onSubmit={() => {
            if (selectedFilter && selectedFilter.label) {
              handleReportPress(selectedFilter.label);
            } else {
              console.log('No report title selected');
            }
          }}
        />
      )}

      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}>
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setModalVisible(false)}>
          <View
            style={[
              styles.modalContent,
              {
                position: 'absolute',
                top: modalPosition.top,
                right: modalPosition.right,
              },
            ]}>
            <TouchableOpacity
              style={styles.modalOption}
              onPress={handleSaveUnsaveContent}>
              <Text style={styles.modalOptionText}>
                {isSaved ? 'Unsave' : 'Save'}
              </Text>
            </TouchableOpacity>
            {item?.creator?._id === user?._id && (
              <TouchableOpacity
                style={styles.modalOption}
                onPress={handelDelete}
                disabled={isDeletingShorts}>
                <Text
                  style={[
                    styles.modalOptionText,
                    isDeletingShorts && {opacity: 0.5},
                  ]}>
                  {isDeletingShorts ? 'Deleting...' : 'Delete'}
                </Text>
              </TouchableOpacity>
            )}
            {item?.creator?._id !== user?._id && (
              <TouchableOpacity style={styles.modalOption} onPress={report}>
                <Text style={styles.modalOptionText}>Report</Text>
              </TouchableOpacity>
            )}
            {item?.creator?._id !== user?._id && (
              <TouchableOpacity
                style={styles.modalOption}
                onPress={() => {
                  handleNotInterestedShorts();
                  setModalVisible(false);
                }}>
                <Text style={styles.modalOptionText}>Not interested</Text>
              </TouchableOpacity>
            )}
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};
export default ShortRealComponent;
const styles = StyleSheet.create({
  container: {
    width: width,
    position: 'relative',
    backgroundColor: Colors.black,
  },
  videoStyle: {
    width: width,
    position: 'absolute',
    top: 0,
    left: 0,
  },
  text: {
    color: '#ffffff',
    fontFamily: fonts['Poppins-Bold'],
    fontSize: fontSize.f18,
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 13,
    marginLeft: 10,
  },
  avatar: {
    height: 38,
    width: 38,
    borderRadius: 19,
    marginRight: 12,
  },
  name: {
    color: '#ffffff',
    fontSize: fontSize.f14,
    fontFamily: fonts['Poppins-Medium'],
    textAlignVertical: 'center',
  },
  status: {
    fontSize: fontSize.f12,
  },
  userDetailContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingRight: 13,
    zIndex: 2,
  },
  captionContainer: {
    position: 'absolute',
    bottom: 0,
    zIndex: 2,
  },
  captionRow: {
    marginHorizontal: 20,
    marginVertical: 15,
  },
  description: {
    fontSize: fontSize.f14,
    fontFamily: fonts['Poppins-SemiBold'],
    color: '#ffffff',
  },
  tags: {
    fontSize: fontSize.f12,
    fontFamily: fonts['Poppins-Medium'],
    color: '#ffffff',
    marginTop: 5,
  },
  likeContainer: {
    position: 'absolute',
    bottom: 100,
    right: 13,
    rowGap: 25,
    zIndex: 2,
  },
  center: {
    alignItems: 'center',
    justifyContent: 'center',
    rowGap: 3,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  modalContent: {
    backgroundColor: Colors.black,
    borderRadius: 12,
    padding: 5,
    width: 200,
  },
  modalOption: {
    paddingVertical: 15,
    paddingHorizontal: 20,
  },
  modalOptionText: {
    color: '#ffffff',
    fontSize: fontSize.f16,
    fontFamily: fonts['Poppins-Medium'],
  },
  muteIconOverlay: {
    position: 'absolute',
    top: '45%',
    left: '45%',
    zIndex: 100,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderRadius: 50,
    padding: 15,
    resizeMode: 'cover',
  },
  sheetContent: {
    height: height * 0.45,
    maxHeight: height * 0.8,
    minHeight: height * 0.3,
    zIndex: 99,
    alignContent: 'flex-end',
  },
  followButton: {
    backgroundColor: '#F0F0F026',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  followText: {
    color: Colors.white,
    fontSize: fontSize.f14,
    fontFamily: fonts['Poppins-Medium'],
  },
  userNameStyle: {
    color: Colors.white,
    fontSize: fontSize.f14,
    fontFamily: fonts['Poppins-Medium'],
  },
  icon: {
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 10,
  },
});
