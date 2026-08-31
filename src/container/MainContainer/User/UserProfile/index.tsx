import {StyleSheet, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import {UserProfileProps} from '@navigation/screens';
import AnimatedBackground from '@components/AnimationComponent/AnimationBackground';
import ProfileHeader from '@components/CustomHeaders/ProfileHeader';
import ProfileDetail from '@components/ScreenLayouts/ProfileComponent/ProfileDetail';
import ProfileTabUI from '@components/ScreenLayouts/ProfileComponent/ProfileTabUI';
import {navigate} from '@navigation/utils';
import {useSelector} from 'react-redux';
import {RootState} from '@store/index';
import {useGetUserProfileByIdQuery} from '@rtkServices/ProfileService';
import Loader from '@components/CustomLoader/Loader';
import LinearGradient from 'react-native-linear-gradient';

const UserProfile = ({navigation}: UserProfileProps) => {
  const {user} = useSelector((state: RootState) => state.user);
  const [profileData, setProfileData] = useState<UserProfile | null>(null);

  const {data, isLoading} = useGetUserProfileByIdQuery({
    id: user?._id,
  });

  useEffect(() => {
    if (data?.data) {
      setProfileData(data?.data);
    }
  }, [data?.data]);

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
          onSettingsPress={() => navigate('UserSetting', {})}
        />
        {isLoading ? (
          <Loader visible={isLoading} />
        ) : (
          <View style={styles.body}>
            {profileData && (
              <ProfileDetail profileType="user" profileData={profileData} />
            )}
            <View style={styles.profileTabContainer}>
              <LinearGradient
                colors={['#00000057', 'transparent']}
                style={styles.linearGradientContainer}
              />
              <ProfileTabUI profileType="user" />
            </View>
          </View>
        )}
      </View>
    </View>
  );
};

export default UserProfile;

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
    overflow: 'hidden',
  },
  profileTabHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    

  },

  linearGradientContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
   
  }
});
