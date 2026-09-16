import React, {useState} from 'react';
import {View, Text, StyleSheet, Pressable, ScrollView} from 'react-native';
import HomeProfileTab from '@container/MainContainer/User/UserProfile/HomeProfileTab';
import VideosProfileTab from '@container/MainContainer/User/UserProfile/VideosProfileTab';
import ShortsProfileTab from '@container/MainContainer/User/UserProfile/ShortsProfileTab';
import LiveProfileTab from '@container/MainContainer/User/UserProfile/LiveProfileTab';
import PlaylistProfileTab from '@container/MainContainer/User/UserProfile/PlaylistProfileTab';
import PostProfileTab from '@container/MainContainer/User/UserProfile/PostProfileTab';
import {fontSize} from '@constant/fontSize';
import {PROFILE_TAB_DATA} from '@utils/data';
import {fonts} from '@constant/fontfamily';
import {Colors} from '@constant/colors';

const USER_PROFILE_TABS = [
  {id: 1, title: 'Home'},
  {id: 2, title: 'Videos'},
  {id: 3, title: 'Shorts'},
  {id: 4, title: 'Live'},
  {id: 5, title: 'Playlist'},
];

export default function ProfileTabUI({
  profileType,
  userId,
  handleCommentPress = (_postId: string) => {},
  bottomInset = 0,
}: {
  profileType: 'user' | 'creator' | 'other';
  userId?: string;
  handleCommentPress?: (postId: string) => void;
  bottomInset?: number;
}) {
  const [activeStep, setActiveStep] = useState(1);
  const isUserLayout = profileType === 'user';

  const renderUserTab = () => {
    if (activeStep === 1) {
      return <HomeProfileTab userId={userId} embedded useDummyFallback />;
    }
    if (activeStep === 2) {
      return <VideosProfileTab userId={userId} embedded useDummyFallback />;
    }
    if (activeStep === 3) {
      return <ShortsProfileTab userId={userId} embedded useDummyFallback />;
    }
    if (activeStep === 4) {
      return <LiveProfileTab userId={userId} embedded useDummyFallback />;
    }
    return <PlaylistProfileTab userId={userId} embedded useDummyFallback />;
  };

  return (
    <View
      style={
        isUserLayout
          ? [styles.userContainer, {paddingBottom: 32 + bottomInset}]
          : styles.container
      }>
      <View
        style={[
          styles.stepContainerWrapper,
          isUserLayout && styles.userStepWrapper,
        ]}>
        {isUserLayout ? (
          USER_PROFILE_TABS.map(item => {
            const isActive = activeStep === item.id;
            return (
              <Pressable
                key={item.id}
                style={styles.userStep}
                onPress={() => setActiveStep(item.id)}>
                <View
                  style={[
                    styles.userStepInner,
                    isActive && styles.userStepActive,
                  ]}>
                  <Text
                    allowFontScaling={false}
                    numberOfLines={1}
                    style={[
                      styles.userStepText,
                      {
                        color: isActive
                          ? '#FFFFFF'
                          : 'rgba(255, 255, 255, 0.54)',
                      },
                    ]}>
                    {item.title}
                  </Text>
                </View>
              </Pressable>
            );
          })
        ) : (
          <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
            {PROFILE_TAB_DATA.map(item => {
              const isActive = activeStep === item.id;
              return (
                <Pressable
                  key={item.id}
                  style={[
                    styles.stepContainer,
                    {
                      borderBottomWidth: isActive ? 2 : 0,
                      borderBottomColor: isActive ? '#1AD655' : 'transparent',
                    },
                  ]}
                  onPress={() => setActiveStep(item.id)}>
                  <Text style={styles.stepText}>{item.title}</Text>
                </Pressable>
              );
            })}
          </ScrollView>
        )}
      </View>
      {isUserLayout ? (
        <View style={styles.userTabContent}>{renderUserTab()}</View>
      ) : (
        <View style={styles.tabContent}>
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
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 4,
    width: '100%',
  },
  userContainer: {
    paddingTop: 40,
    paddingHorizontal: 36,
    gap: 24,
    flexGrow: 1,
  },
  stepContainer: {
    padding: 10,
    marginBottom: 10,
    marginHorizontal: 10,
  },
  userStep: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height: 30,
  },
  userStepInner: {
    paddingVertical: 6,
    paddingHorizontal: 4,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomWidth: 1.5,
    borderBottomColor: 'transparent',
  },
  userStepActive: {
    borderBottomColor: '#1AD655',
  },
  userStepWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'stretch',
    height: 30,
    marginHorizontal: -16,
  },
  userStepText: {
    fontSize: 14,
    lineHeight: 18,
    fontFamily: fonts['Poppins-Medium'],
    textAlign: 'center',
    includeFontPadding: false,
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
  tabContent: {
    flex: 1,
  },
  userTabContent: {
    width: '100%',
  },
});
