import {StyleSheet, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import {UserProfileProps} from '@navigation/screens';
import ProfileHeader from '@components/CustomHeaders/ProfileHeader';
import ProfileDetail from '@components/ScreenLayouts/ProfileComponent/ProfileDetail';
import ProfileTabUI from '@components/ScreenLayouts/ProfileComponent/ProfileTabUI';
import {navigate} from '@navigation/utils';
import {useSelector} from 'react-redux';
import {RootState} from '@store/index';
import {useGetUserProfileByIdQuery} from '@rtkServices/ProfileService';
import Loader from '@components/CustomLoader/Loader';
import GlowBackground from '@components/AnimationComponent/GlowBackground';
import BlurView from '@components/CustomBlurView/BlurView';
import {ScrollView} from 'react-native-gesture-handler';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

const UserProfile = ({navigation}: UserProfileProps) => {
  const {user} = useSelector((state: RootState) => state.user);
  const [profileData, setProfileData] = useState<UserProfile | null>(null);
  const insets = useSafeAreaInsets();

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
      <GlowBackground />

      <View style={styles.contentOverlay}>
        <ProfileHeader
          onBackPress={() => navigation.goBack()}
          onSettingsPress={() => navigate('UserSetting', {})}
        />
        {isLoading ? (
          <Loader visible={isLoading} />
        ) : (
          <ScrollView
            showsVerticalScrollIndicator={false}
            nestedScrollEnabled
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={styles.scrollContent}>
            {profileData && (
              <ProfileDetail
                profileType="user"
                profileData={profileData}
                isOwnProfile
              />
            )}
            <View style={styles.profileTabContainer}>
              <BlurView
                style={StyleSheet.absoluteFill}
                blurAmount={12}
                reducedTransparencyFallbackColor="transparent"
              />
              <View style={styles.sheetTint} />
              <ProfileTabUI
                profileType="user"
                userId={user?._id}
                bottomInset={80 + Math.max(insets.bottom, 10)}
              />
            </View>
          </ScrollView>
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
  scrollContent: {
    flexGrow: 1,
  },
  profileTabContainer: {
    marginTop: 36,
    flexGrow: 1,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    overflow: 'hidden',
    borderTopWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  sheetTint: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.34)',
  },
});
