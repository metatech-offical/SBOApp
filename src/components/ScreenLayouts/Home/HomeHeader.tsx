import {Pressable, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import FastImage from 'react-native-fast-image';
import {fontSize, hp, wp} from '@constant/fontSize';
import {Colors} from '@constant/colors';
import {navigate} from '@navigation/utils';
import {fonts} from '@constant/fontfamily';
import {RootState, useAppSelector} from '@store/index';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

export default function HomeHeader({
  isCreator,
  showLogo,
}: {
  isCreator?: boolean;
  showLogo?: boolean;
}) {
  const {user} = useAppSelector((state: RootState) => state.user);
  const {hasNotifications} = useAppSelector(
    (state: RootState) => state.notifications,
  );
  const {top} = useSafeAreaInsets();
  return (
    <View style={[styles.container, {marginTop: top}]}>
      {!showLogo ? (
        <View style={styles.creatorContainer}>
          {user?.profilePicture ? (
            <FastImage
              source={{uri: user?.profilePicture}}
              style={styles.creatorImage}
            />
          ) : (
            <FastImage
              source={require('@assets/images/DummyUserImage.png')}
              style={styles.creatorImage}
            />
          )}

          <Text style={styles.creatorName}>{user?.username || 'Creator'}</Text>
        </View>
      ) : (
        <FastImage
          source={require('@assets/images/appLogo2.png')}
          style={styles.logo}
          resizeMode="contain"
        />
      )}

      <Pressable
        hitSlop={20}
        onPress={() =>
          navigate(isCreator ? 'CreatorMyActivity' : 'UserMyActivity', {})
        }
        style={styles.notification}>
        <View style={styles.notificationContainer}>
          <FastImage
            source={require('@assets/images/NotificationBellIcon.png')}
            style={styles.notificationIcon}
            resizeMode="contain"
          />
          {hasNotifications && <View style={styles.redDot} />}
        </View>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: hp('2'),
  },

  creatorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  creatorImage: {
    width: wp('8'),
    height: wp('8'),
    borderRadius: wp('10'),
  },
  logo: {
    width: wp('20'),
    height: hp('5%'),
    resizeMode: 'contain',
  },
  notification: {},
  notificationContainer: {
    position: 'relative',
  },
  creatorName: {
    fontSize: fontSize.f20,
    fontFamily: fonts['Poppins-SemiBold'],
    color: Colors.white,
    marginTop: -7,
  },
  notificationIcon: {
    width: 27,
    height: 27,
  },
  redDot: {
    position: 'absolute',
    top: -2,
    right: 2,
    width: 10,
    height: 11,
    borderRadius: 8,
    backgroundColor: '#FF3B30',
  },
});
