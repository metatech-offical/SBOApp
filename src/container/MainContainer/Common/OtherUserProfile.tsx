import {
  View,
  StyleSheet,
  ScrollView,
  FlatList,
  Pressable,
  Text,
  Platform,
} from 'react-native';
import React, {useEffect, useCallback, useMemo, useState, useRef} from 'react';
import {OtherUserProfileProps} from '@navigation/screens';
import AnimatedBackground from '@components/AnimationComponent/AnimationBackground';
import ProfileHeader from '@components/CustomHeaders/ProfileHeader';
import ProfileDetail from '@components/ScreenLayouts/ProfileComponent/ProfileDetail';
import ProfileTabUI from '@components/ScreenLayouts/ProfileComponent/ProfileTabUI';
import {fontSize, hp} from '@constant/fontSize';
import {
  useBlockUnblockUserMutation,
  useGetUserProfileByIdQuery,
  useMarkAccountViewedMutation,
} from '@rtkServices/ProfileService';
import {MoreIcon} from '@assets/svg/CommonIcons';
import {useSelector} from 'react-redux';
import {RootState} from '@store/index';
import Loader from '@components/CustomLoader/Loader';
import CustomBottomSheet from '@components/CustomBottomSheet/CustomBottomSheet';
import {BottomSheetModal} from '@gorhom/bottom-sheet';
import FastImage from 'react-native-fast-image';
import UnblockModal from '@components/CustomModal/UnBlockModal';
import {blockUserSheetContent, unblockUserSheetContent} from '@utils/data';
import UserBlockSheet from './UserBlockSheet';
import CustomRefreshControler from '@components/CustomLoader/CustomRefreshControler';
import NewCommentSheet from '@components/Common/NewCommentSheet';
import {useGetLiveByUserIDQuery} from '@rtkServices/LiveStreamServices';
import {useToastMessage} from '@hooks/useToastMessage';
import {Colors} from '@constant/colors';
import {fonts} from '@constant/fontfamily';

const OtherUserProfile = ({navigation, route}: OtherUserProfileProps) => {
  const {showError, showSuccess} = useToastMessage();
  const {userId} = route?.params as {userId: string};
  const {user} = useSelector((state: RootState) => state.user);
  const [markAccountViewed] = useMarkAccountViewedMutation();
  const [blockUserSheet, setBlockUserSheet] = useState(false);
  const blockUserSheetRef = useRef<BottomSheetModal>(null);
  const newCommentSheetRef = useRef<any>(null);
  const [isBlocked, setIsBlocked] = useState(false);
  const [profileData, setProfileData] = useState<any>(null);
  const [showBlockUserDetails, setShowBlockUserDetails] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [currentPostId, setCurrentPostId] = useState('');
  const [blockUser, {isLoading: blockUserLoading}] =
    useBlockUnblockUserMutation();

  const {
    data,
    isLoading: isProfileLoading,
    refetch,
    isFetching,
  } = useGetUserProfileByIdQuery({id: userId});

  const {data: liveData} = useGetLiveByUserIDQuery({userID: userId});

  const handleMarkAccountViewed = useCallback(
    async (id: string) => {
      try {
        await markAccountViewed({id}).unwrap();
      } catch (e) {}
    },
    [markAccountViewed],
  );

  useEffect(() => {
    if (data) {
      setProfileData(data?.data);
      setIsBlocked(data?.data?.isBlocked);
      if (user?._id != data?.data?._id && data?.data?.isViewed === false) {
        handleMarkAccountViewed(data?.data._id);
      }
    }
  }, [data, user?._id, handleMarkAccountViewed]);

  const handleRefetch = useCallback(async () => {
    await refetch();
  }, [refetch]);

  const handleBlockUser = useCallback(async () => {
    try {
      await blockUser({id: userId, action: 'block'}).then((res: any) => {
        if (res?.data) {
          refetch();
          setBlockUserSheet(false);
          setShowBlockUserDetails(false);
          showSuccess(res?.data?.message || '');
        }
        if (res?.error) {
          showError(res?.error?.data?.message || '');
        }
      });
    } catch (error) {
      console.error('Error blocking user:', error);
    }
  }, [userId, blockUser]);

  const handleUnblock = useCallback(async () => {
    try {
      await blockUser({id: userId, action: 'unblock'}).then((res: any) => {
        if (res?.data) {
          refetch();
          setModalVisible(false);
          setBlockUserSheet(false);
          setShowBlockUserDetails(false);
          showSuccess(res?.data?.message || '');
        }
        if (res?.error) {
          showError(res?.error?.data?.message || '');
        }
      });
    } catch (error) {
      console.error('Error unblocking user:', error);
    }
  }, [userId, blockUser]);

  const moreIcon = useMemo(
    () => <MoreIcon width={20} height={20} style={styles.moreIcon} />,
    [],
  );

  const handleUnblockPress = (user: any) => {
    setModalVisible(true);
  };

  const RenderBlockUserSheet = useCallback(() => {
    return (
      <View>
        {isBlocked ? (
          <FlatList
            data={unblockUserSheetContent}
            renderItem={({item}) => (
              <Pressable
                onPress={() => handleUnblockPress(profileData)}
                style={styles.blockUserSheetContainer}>
                <FastImage
                  source={item.icon}
                  style={styles.blockUserSheetIcon}
                />
                <Text style={styles.blockUserSheetText}>{item.title}</Text>
              </Pressable>
            )}
          />
        ) : showBlockUserDetails ? (
          <UserBlockSheet
            userDetail={profileData}
            onBlockPress={handleBlockUser}
            isLoading={blockUserLoading}
          />
        ) : (
          <FlatList
            data={blockUserSheetContent}
            renderItem={({item}) => (
              <Pressable
                onPress={() => setShowBlockUserDetails(true)}
                style={styles.blockUserSheetContainer}>
                <FastImage
                  source={item.icon}
                  style={styles.blockUserSheetIcon}
                />
                <Text style={styles.blockUserSheetText}>{item.title}</Text>
              </Pressable>
            )}
          />
        )}
      </View>
    );
  }, [showBlockUserDetails, isBlocked]);

  const handleCommentPress = (postId: string) => {
    setCurrentPostId(postId);
    setTimeout(() => {
      newCommentSheetRef.current?.open();
    }, 500);
  };

  return (
    <View style={styles.container}>
      <AnimatedBackground
        animationSource={require('@assets/animations/AuthAnimation4.json')}
        backgroundColor={'#1a1538'}
        zIndex={0}
      />
      <View style={styles.contentOverlay}>
        <ProfileHeader
          onBackPress={() => navigation.goBack()}
          onSettingsPress={() => {
            setBlockUserSheet(true);
          }}
          Icon={moreIcon}
        />
        {isProfileLoading ? (
          <Loader visible={isProfileLoading} />
        ) : (
          <ScrollView
            refreshControl={
              <CustomRefreshControler
                refreshing={isFetching}
                onRefresh={handleRefetch}
              />
            }
            showsVerticalScrollIndicator={false}
            style={{flexGrow: 1}}>
            {profileData && (
              <ProfileDetail
                profileData={profileData}
                liveData={liveData?.data}
                isBlocked={isBlocked}
                profileType={
                  profileData?.membership === 'creator' ? 'other' : 'user'
                }
              />
            )}
            {!isBlocked && (
              <View style={styles.profileTabContainer}>
                <ProfileTabUI
                  profileType="other"
                  userId={userId}
                  handleCommentPress={handleCommentPress}
                />
              </View>
            )}
          </ScrollView>
        )}
      </View>

      {blockUserSheet && (
        <CustomBottomSheet
          label={''}
          ref={blockUserSheetRef}
          index={showBlockUserDetails ? 3 : 1}
          renderView={RenderBlockUserSheet}
          containerStyle={{backgroundColor: '#251E37'}}
          onClose={() => {
            setBlockUserSheet(false);
            setShowBlockUserDetails(false);
          }}
          onPress={() => {
            setBlockUserSheet(false);
            setShowBlockUserDetails(false);
          }}
        />
      )}

      <UnblockModal
        modalVisible={modalVisible}
        handleCancel={() => setModalVisible(false)}
        selectedUser={profileData}
        handleUnblock={handleUnblock}
        isLoading={blockUserLoading}
      />

      <NewCommentSheet
        ref={newCommentSheetRef}
        itemId={currentPostId}
        creatorId={userId}
        currentItemType="posts"
      />
    </View>
  );
};

export default OtherUserProfile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.red,
  },
  contentOverlay: {
    position: 'relative',
    flex: 1,
  },
  tabContainer: {
    marginTop: 20,
    flex: 1,
  },
  profileTabContainer: {
    marginTop: 20,
    flex: 1,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    backgroundColor: '#00000057',
    borderWidth: 2,
    borderColor: '#FFFFFF1A',
    height: hp('81'),
  },
  profileTabHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  moreIcon: {
    transform: [{rotate: '90deg'}],
  },
  blockUserSheetContainer: {
    padding: 16,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    columnGap: 10,
    marginTop: 25,
  },
  blockUserSheetIcon: {
    width: 20,
    height: 20,
    marginRight: 10,
  },
  blockUserSheetText: {
    fontSize: fontSize.f16,
    fontFamily: fonts['Poppins-Medium'],
    color: '#D13C50',
  },
});
