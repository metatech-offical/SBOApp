import {View, StyleSheet} from 'react-native';
import React, {useEffect, useState, useRef} from 'react';
import {CreatorProfileProps} from '@navigation/screens';
import AnimatedBackground from '@components/AnimationComponent/AnimationBackground';
import ProfileHeader from '@components/CustomHeaders/ProfileHeader';
import ProfileDetail from '@components/ScreenLayouts/ProfileComponent/ProfileDetail';
import ProfileTabUI from '@components/ScreenLayouts/ProfileComponent/ProfileTabUI';
import {RootState, useAppSelector} from '@store/index';
import {useGetUserProfileByIdQuery} from '@rtkServices/ProfileService';
import Loader from '@components/CustomLoader/Loader';
import NewCommentSheet from '@components/Common/NewCommentSheet';

const CreatorProfile = ({navigation}: CreatorProfileProps) => {
  const {user} = useAppSelector((state: RootState) => state.user);
  const [profileData, setProfileData] = useState<UserProfile | null>(null);
  const [currentPostId, setCurrentPostId] = useState('');
  const newCommentSheetRef = useRef<any>(null);

  const {data, isLoading: isProfileLoading} = useGetUserProfileByIdQuery({id: user?._id});

  useEffect(() => {
    if (data?.data) {
      setProfileData(data?.data);
    }
  }, [data?.data]);

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
          <View style={styles.body}>
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
          </View>
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
    position: 'relative',
    flex: 1,
  },
  body: {
    flex: 1,
  },
  profileTabContainer: {
    flex: 1,
    marginTop: 8,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    backgroundColor: '#00000057',
    overflow: 'hidden',
  },
});
