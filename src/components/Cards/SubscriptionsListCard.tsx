import {StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import React from 'react';
import {fontSize, hp, wp} from '../../constant/fontSize';
import {Colors} from '../../constant/colors';
import {fonts} from '../../constant/fontfamily';
import FastImage from 'react-native-fast-image';
import {navigate} from '@navigation/utils';

export default function SubscriptionsListCard({
  item,
  onUnsubscribe,
}: SubscriptionsListCardProps) {
  return (
    <TouchableOpacity
      onPress={() => navigate('OtherUserProfile', {userId: item?._id})}
      style={styles.container}>
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
      <TouchableOpacity style={styles.button} onPress={onUnsubscribe}>
        <Text style={styles.buttonText}>Unsubscribe</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );
}

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
  button: {
    backgroundColor: '#FFFFFF14',
    paddingVertical: hp('0.9%'),
    paddingHorizontal: wp('5%'),
    borderRadius: 10,
  },
  buttonText: {
    color: Colors.white,
    fontFamily: fonts['Poppins-Medium'],
    fontSize: fontSize.f12,
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
    fontSize: fontSize.f14,
    fontFamily: fonts['Poppins-Medium'],
    color: Colors.white,
    textTransform: 'uppercase',
  },
});
