import {StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import React from 'react';
import AnimatedBackground from '@components/AnimationComponent/AnimationBackground';
import StackHeader from '@components/CustomHeaders/StackHeader';
import {fonts} from '@constant/fontfamily';
import {Colors} from '@constant/colors';
import {navigateBack} from '@navigation/utils';
import {FollowAndFollowingProps} from '@navigation/screens';
import FollowersList from './FollowersList';
import FollowingList from './FollowingList';
import {fontSize} from '@constant/fontSize';

export default function FollowAndFollowing({route}: FollowAndFollowingProps) {
  const {type} = route.params;
  const [activeTab, setActiveTab] = React.useState(type);

  return (
    <View style={styles.container}>
      <AnimatedBackground
        animationSource={require('@assets/animations/AuthAnimation4.json')}
        backgroundColor={'#1a1538'}
        zIndex={0}
      />
      <StackHeader
        title="Followers & Following"
        onBackPress={navigateBack}
        showArrowDown={false}
      />

      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'followers' && styles.activeTab]}
          onPress={() => setActiveTab('followers')}>
          <Text
            style={[
              styles.tabText,
              activeTab === 'followers' && styles.activeTabText,
            ]}>
            Followers
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'following' && styles.activeTab]}
          onPress={() => setActiveTab('following')}>
          <Text
            style={[
              styles.tabText,
              activeTab === 'following' && styles.activeTabText,
            ]}>
            Following
          </Text>
        </TouchableOpacity>
      </View>

      {activeTab === 'followers' ? <FollowersList /> : <FollowingList />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  tabContainer: {
    flexDirection: 'row',
    marginHorizontal: 20,
    marginVertical: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 25,
    padding: 5,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 20,
  },
  activeTab: {
    backgroundColor: Colors.white,
  },
  tabText: {
    fontFamily: fonts['Poppins-Medium'],
    fontSize: fontSize.f12,
    color: Colors.white,
  },
  activeTabText: {
    color: Colors.black,
  },
});
