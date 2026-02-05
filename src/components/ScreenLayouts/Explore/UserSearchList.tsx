import {VerifiedIcon} from '@assets/svg/AuthFlowIcons';
import {VideoIcon} from '@assets/svg/HomeScreenIcon';
import NodataFound from '@components/DataEmpty/NodataFound';
import {fontSize, hp, wp} from '@constant/fontSize';
import {navigate} from '@navigation/utils';
import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet, FlatList} from 'react-native';
import FastImage from 'react-native-fast-image';
import {useSelector} from 'react-redux';
import {RootState} from '@store/index';
import {useNavigation} from '@react-navigation/native';
import {fonts} from '@constant/fontfamily';
import {Colors} from '@constant/colors';

const UserSearchList = ({data}: {data: usersItem[]}) => {
  const {user} = useSelector((state: RootState) => state.user);

  const navigation = useNavigation<any>();

  const onPress = (profile: usersItem) => {
    if (user?._id === profile?._id) {
      if (user?.membership === 'creator') {
        navigation.navigate('HomeScreen', {
          screen: 'CreatorProfile',
          params: {userId: profile._id},
        });
      } else {
        navigation.navigate('HomeScreen', {
          screen: 'UserProfile',
          params: {userId: profile._id},
        });
      }
    } else {
      navigate('OtherUserProfile', {userId: profile._id});
    }
  };

  const renderProfile = (profile: usersItem) => (
    <TouchableOpacity
      onPress={() => onPress(profile)}
      key={profile?._id}
      style={styles.profileContainer}>
      <View style={styles.profileContent}>
        <View style={styles.avatarContainer}>
          <FastImage
            source={
              profile?.profilePicture
                ? {uri: profile?.profilePicture}
                : require('@assets/images/DummyUserImage.png')
            }
            style={styles.avatar}
          />
        </View>

        <View style={styles.profileInfo}>
          <View style={styles.usernameRow}>
            <Text style={styles.username}>{profile?.username}</Text>
          </View>
          <Text style={styles.displayName}>
            {profile?.displayName ? profile?.displayName : profile?.username} •{' '}
            {profile?.followersCount} Followers
          </Text>
        </View>

        {profile?.isLive && (
          <View style={styles.notificationDot}>
            <VideoIcon width={wp('4')} height={wp('4')} fill={'#ffffff'} />
          </View>
        )}
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={data}
        renderItem={({item}) => renderProfile(item)}
        keyExtractor={item => item._id}
        ListEmptyComponent={() => <NodataFound />}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: hp('2'),
    // paddingTop: 60,
  },
  profileContainer: {
    marginBottom: 24,
  },
  profileContent: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
  },
  avatarContainer: {
    marginRight: 16,
  },
  avatar: {
    width: wp('12'),
    height: wp('12'),
    borderRadius: 28,
  },
  profileInfo: {
    flex: 1,
  },
  usernameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  username: {
    fontSize: fontSize.f18,
    marginRight: 8,
    color: Colors.white,
    fontFamily: fonts['Poppins-Medium'],
  },
  verifiedBadge: {
    backgroundColor: '#10b981',
    borderRadius: 12,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkmark: {
    fontSize: fontSize.f10,
    color: Colors.white,
    fontFamily: fonts['Poppins-Medium'],
  },
  displayName: {
    color: '#9ca3af',
    fontSize: fontSize.f12,
    fontFamily: fonts['Poppins-Medium'],
  },
  notificationDot: {
    position: 'absolute',
    right: 0,
    top: 8,
    padding: wp('1'),
    borderRadius: 3,
    backgroundColor: '#ef4444',
  },
});

export default UserSearchList;
