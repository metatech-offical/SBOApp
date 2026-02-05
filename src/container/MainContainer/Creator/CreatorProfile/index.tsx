import {View, StyleSheet, ScrollView} from 'react-native';
import React, {useCallback, useEffect, useState, useRef} from 'react';
import {CreatorProfileProps} from '@navigation/screens';
import AnimatedBackground from '@components/AnimationComponent/AnimationBackground';
import ProfileHeader from '@components/CustomHeaders/ProfileHeader';
import ProfileDetail from '@components/ScreenLayouts/ProfileComponent/ProfileDetail';
import ProfileTabUI from '@components/ScreenLayouts/ProfileComponent/ProfileTabUI';
import {hp} from '@constant/fontSize';
import {RootState, useAppSelector} from '@store/index';
import {useGetUserProfileByIdQuery} from '@rtkServices/ProfileService';
import Loader from '@components/CustomLoader/Loader';
import CustomRefreshControler from '@components/CustomLoader/CustomRefreshControler';
import NewCommentSheet from '@components/Common/NewCommentSheet';

const CreatorProfile = ({navigation}: CreatorProfileProps) => {
  const {user} = useAppSelector((state: RootState) => state.user);
  const [profileData, setProfileData] = useState<UserProfile | null>(null);
  const [currentPostId, setCurrentPostId] = useState('');
  const newCommentSheetRef = useRef<any>(null);

  const {
    data,
    isLoading: isProfileLoading,
    refetch,
    isFetching,
  } = useGetUserProfileByIdQuery({id: user?._id});

  useEffect(() => {
    if (data?.data) {
      setProfileData(data?.data);
    }
  }, [data?.data]);

  const handleRefetch = useCallback(async () => {
    await refetch();
  }, [refetch]);

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
          onSettingsPress={() => navigation.navigate('CreatorSetting')}
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
              <ProfileDetail profileType="creator" profileData={profileData} />
            )}

            <View style={styles.profileTabContainer}>
              <ProfileTabUI
                profileType="creator"
                userId={user?._id}
                handleCommentPress={handleCommentPress}
              />
            </View>
          </ScrollView>
        )}
      </View>

      <NewCommentSheet
        ref={newCommentSheetRef}
        itemId={currentPostId}
        creatorId={profileData?._id || ''}
        currentItemType="posts"
      />
    </View>
  );
};

export default CreatorProfile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentOverlay: {
    // zIndex: 2,
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
});
