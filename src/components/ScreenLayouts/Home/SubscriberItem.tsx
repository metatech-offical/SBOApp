import React from 'react';
import {View, StyleSheet, Text, Pressable} from 'react-native';
import FastImage from 'react-native-fast-image';
import {navigate} from '@navigation/utils';
import {Colors} from '@constant/colors';
import {fontSize, hp, wp} from '@constant/fontSize';
import {fonts} from '@constant/fontfamily';

interface SubscriberItemProps {
  item: Subscriber;
  onViewProfile?: (userId: string) => void;
}

const SubscriberItem = ({item, onViewProfile}: SubscriberItemProps) => {
  const handleViewProfile = () => {
    if (onViewProfile) {
      onViewProfile(item._id);
    } else {
      navigate('OtherUserProfile', {userId: item._id});
    }
  };

  return (
    <Pressable onPress={handleViewProfile} style={styles.container}>
      <View style={styles.leftContainer}>
        {item?.profilePicture ? (
          <FastImage
            source={{uri: item.profilePicture}}
            style={styles.profileImage}
          />
        ) : (
          <View style={styles.viewAllCircle}>
            <Text style={styles.avatarInitial}>{item.username.charAt(0)}</Text>
          </View>
        )}
        <Text style={styles.name}>@{item?.username}</Text>
      </View>
    </Pressable>
  );
};

export default SubscriberItem;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: hp('1%'),
    paddingHorizontal: wp('3%'),
    borderRadius: 16,
    marginVertical: hp('0%'),
  },
  leftContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileImage: {
    width: wp('10'),
    height: wp('10'),
    borderRadius: 25,
  },
  name: {
    marginLeft: 16,
    fontSize: fontSize.f14,
    fontFamily: fonts['Poppins-Medium'],
    color: Colors.white,
  },
  viewAllCircle: {
    width: wp('10'),
    height: wp('10'),
    borderRadius: wp('10'),
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarInitial: {
    fontSize: fontSize.f12,
    fontFamily: fonts['Poppins-Medium'],
    color: Colors.white,
    textTransform: 'uppercase',
  },
});
