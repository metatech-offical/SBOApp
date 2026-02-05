import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import HomeProfileTab from '@container/MainContainer/User/UserProfile/HomeProfileTab';
import VideosProfileTab from '@container/MainContainer/User/UserProfile/VideosProfileTab';
import ShortsProfileTab from '@container/MainContainer/User/UserProfile/ShortsProfileTab';
import LiveProfileTab from '@container/MainContainer/User/UserProfile/LiveProfileTab';
import PlaylistProfileTab from '@container/MainContainer/User/UserProfile/PlaylistProfileTab';
import PostProfileTab from '@container/MainContainer/User/UserProfile/PostProfileTab';
import {fontSize, hp, wp} from '@constant/fontSize';
import {PROFILE_TAB_DATA} from '@utils/data';
import {fonts} from '@constant/fontfamily';
import {navigate} from '@navigation/utils';
import LinearGradient from 'react-native-linear-gradient';
import {Colors} from '@constant/colors';

export default function ProfileTabUI({
  profileType,
  userId,
  handleCommentPress = (postId: string) => {},
}: {
  profileType: 'user' | 'creator' | 'other';
  userId?: string;
  handleCommentPress?: (postId: string) => void;
}) {
  const [activeStep, setActiveStep] = useState(1);

  const CreatorProfileRoute = () => {
    return (
      <View style={styles.updateProfileContainer}>
        <LinearGradient
          colors={['#201D29', 'transparent']}
          style={styles.linearGradientContainer}
        />
        <View style={styles.topLine} />
        <Text style={styles.updateProfileText}>
          Ready to Post? Become a Creator!
        </Text>
        <Text style={styles.updateProfileText2}>
          Become our member to start posting your content. Unlock full access
          and showcase your creativity today and you can also “monetize your
          content”
        </Text>
        <TouchableOpacity
          onPress={() => {
            navigate('UpgradePlan', {currentPlan: 'Standard'});
          }}
          style={styles.updateProfileButton}>
          <Text style={styles.updateProfileButtonText}>Become a Creator</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.stepContainerWrapper}>
        <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
          {PROFILE_TAB_DATA.map(item => (
            <Pressable
              key={item.id}
              style={[
                styles.stepContainer,
                {
                  borderBottomWidth: activeStep === item.id ? 2 : 0,
                  borderBottomColor:
                    activeStep === item.id ? '#1AD655' : 'transparent',
                },
              ]}
              onPress={() => setActiveStep(item.id)}>
              <Text style={styles.stepText}>{item.title}</Text>
            </Pressable>
          ))}
        </ScrollView>
      </View>
      {profileType === 'user' ? (
        <CreatorProfileRoute />
      ) : (
        <>
          {activeStep === 1 ? (
            <HomeProfileTab userId={userId} />
          ) : activeStep === 2 ? (
            <VideosProfileTab userId={userId} />
          ) : activeStep === 3 ? (
            <ShortsProfileTab userId={userId} />
          ) : activeStep === 4 ? (
            <PostProfileTab
              userId={userId}
              handleCommentPress={(postId: string) => {
                handleCommentPress(postId);
              }}
            />
          ) : activeStep === 5 ? (
            <LiveProfileTab userId={userId} />
          ) : (
            <PlaylistProfileTab userId={userId} />
          )}
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: hp('4'),
    width: '100%',
    // paddingBottom: 100,
    // backgroundColor: '#1a1a1a',
  },
  tabBar: {
    backgroundColor: 'transparent',
    elevation: 0,
    shadowOpacity: 0,
    borderBottomWidth: 0,
    paddingBottom: 10,
  },
  tab: {
    width: 'auto',
    minWidth: 80,
    paddingHorizontal: 16,
    paddingVertical: 5,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 15,
  },
  indicator: {
    backgroundColor: '#1ED760',
    height: 0,
    borderRadius: 2,
  },
  label: {
    fontSize: fontSize.f16,
    textTransform: 'none',
    margin: 0,
    padding: 0,
    fontFamily: fonts['Poppins-Medium'],
  },
  scene: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    // backgroundColor: '#1a1a1a',
  },
  sceneText: {
    fontSize: fontSize.f18,
    color: Colors.white,
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#1ED760',
  },
  inactiveTab: {
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },

  updateProfileContainer: {
    position: 'absolute',
    // top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    height: hp('30'),
    width: '100%',
    alignItems: 'center',
    // backgroundColor: '#201D29',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: wp('5'),
    overflow: 'hidden',
    // paddingBottom: hp('10'),
  },

  linearGradientContainer: {
    position: 'absolute',

    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  topLine: {
    width: '20%',
    height: 5,
    backgroundColor: '#4D4C4C',
    marginBottom: hp('1'),
    marginTop: hp('1'),
    borderRadius: 10,
  },
  updateProfileText: {
    fontSize: fontSize.f16,
    color: Colors.white,
    marginTop: hp('1'),
  },

  updateProfileText2: {
    fontSize: fontSize.f14,
    color: '#B1B0B0',
    marginTop: hp('1'),
    textAlign: 'center',
  },

  updateProfileButton: {
    backgroundColor: '#1AD65533',
    paddingHorizontal: wp('5'),
    paddingVertical: hp('1'),
    borderRadius: 10,
    marginTop: hp('2'),
  },

  updateProfileButtonText: {
    fontSize: fontSize.f16,
    color: '#1AD655',
    fontFamily: fonts['Poppins-Medium'],
  },
  stepContainer: {
    padding: 10,
    marginBottom: 10,
    marginHorizontal: 10,
  },
  stepText: {
    fontSize: fontSize.f16,
    fontFamily: fonts['Poppins-Bold'],
    color: Colors.white,
  },
  stepContainerWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
