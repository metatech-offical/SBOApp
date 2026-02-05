import {ScrollView, StyleSheet, View} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
import {UserProfileProps} from '@navigation/screens';
import AnimatedBackground from '@components/AnimationComponent/AnimationBackground';
import ProfileHeader from '@components/CustomHeaders/ProfileHeader';
import ProfileDetail from '@components/ScreenLayouts/ProfileComponent/ProfileDetail';
import ProfileTabUI from '@components/ScreenLayouts/ProfileComponent/ProfileTabUI';
import {hp} from '@constant/fontSize';
import {navigate} from '@navigation/utils';
import {useSelector} from 'react-redux';
import {RootState} from '@store/index';
import {useGetUserProfileByIdQuery} from '@rtkServices/ProfileService';
import Loader from '@components/CustomLoader/Loader';
import CustomRefreshControler from '@components/CustomLoader/CustomRefreshControler';
import LinearGradient from 'react-native-linear-gradient';

const UserProfile = ({navigation}: UserProfileProps) => {
  const {user} = useSelector((state: RootState) => state.user);
  const [profileData, setProfileData] = useState<UserProfile | null>(null);

  const {data, isLoading, refetch, isFetching} = useGetUserProfileByIdQuery({
    id: user?._id,
  });

  useEffect(() => {
    if (data?.data) {
      setProfileData(data?.data);
    }
  }, [data?.data]);

  const handleRefetch = useCallback(async () => {
    await refetch();
  }, [refetch]);

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
          <ScrollView
            refreshControl={
              <CustomRefreshControler
                refreshing={isFetching}
                onRefresh={handleRefetch}
              />
            }
            showsVerticalScrollIndicator={false}
            style={{flexGrow: 1 , }}>
            {profileData && (
              <ProfileDetail profileType="user" profileData={profileData} />
            )}

            <View style={styles.profileTabContainer}>
              <LinearGradient
                colors={['#00000057', 'transparent']}
                style={styles.linearGradientContainer}/>
        
              <ProfileTabUI profileType="user" />
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
  tabContainer: {
    marginTop: 20,
    flex: 1,
  },
  profileTabContainer: {
    marginTop: hp('5'),
    flex: 1,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    // backgroundColor: '#00000057',
    borderWidth: 1,
    borderColor: '#FFFFFF1A',
    overflow: 'hidden',
    height: hp('45'),
    borderBottomWidth: 0,
   
    borderLeftWidth: 0.5,
    borderRightWidth: 0.5,
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
