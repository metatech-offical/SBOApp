import {Pressable, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import FastImage from 'react-native-fast-image';
import {fontSize} from '@constant/fontSize';
import {Colors} from '@constant/colors';
import {navigate} from '@navigation/utils';
import {fonts} from '@constant/fontfamily';
import {RootState, useAppSelector} from '@store/index';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {CreatorCrownIcon} from '@assets/svg/HomeScreenIcon';

export default function HomeHeader({
  isCreator,
  showLogo,
  showBecomeCreator,
  showCart,
  onLogoPress,
}: {
  isCreator?: boolean;
  showLogo?: boolean;
  showBecomeCreator?: boolean;
  showCart?: boolean;
  onLogoPress?: () => void;
}) {
  const {user} = useAppSelector((state: RootState) => state.user);
  const {hasNotifications} = useAppSelector(
    (state: RootState) => state.notifications,
  );
  const {cartItemsCount} = useAppSelector((state: RootState) => state.cart);
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

          <Text style={styles.creatorName}>
            {user?.displayName || user?.username || 'Creator'}
          </Text>
        </View>
      ) : (
        <Pressable disabled={!onLogoPress} onPress={onLogoPress}>
          <FastImage
            source={require('@assets/images/appLogo-transparent.png')}
            style={showBecomeCreator ? styles.fanLogo : styles.logo}
            resizeMode={FastImage.resizeMode.contain}
          />
        </Pressable>
      )}

      <View style={styles.rightActions}>
        {showBecomeCreator ? (
          <Pressable
            hitSlop={8}
            onPress={() => navigate('UpgradePlan', {currentPlan: 'Standard'})}
            style={styles.becomeCreator}>
            <CreatorCrownIcon />
            <Text style={styles.becomeCreatorText}>Become a creator</Text>
          </Pressable>
        ) : null}
        {showCart ? (
          <Pressable
            hitSlop={12}
            onPress={() => navigate('CartListScreen')}
            style={styles.cartButton}>
            <FastImage
              source={require('@assets/images/CartIcon.png')}
              style={styles.cartIcon}
              resizeMode="contain"
            />
            {cartItemsCount > 0 ? (
              <View style={styles.cartBadge}>
                <Text style={styles.cartBadgeText}>
                  {cartItemsCount > 99 ? '99+' : cartItemsCount}
                </Text>
              </View>
            ) : null}
          </Pressable>
        ) : null}
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
  },

  creatorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  creatorImage: {
    width: 36,
    height: 36,
    borderRadius: 18,
  },
  logo: {
    width: 44,
    height: 44,
  },
  fanLogo: {
    width: 76,
    height: 33,
  },
  rightActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  becomeCreator: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 25,
    paddingHorizontal: 12,
    borderRadius: 12.5,
    backgroundColor: 'rgba(26, 214, 85, 0.2)',
    gap: 6,
  },
  becomeCreatorText: {
    fontSize: fontSize.f10,
    fontFamily: fonts['Poppins-Medium'],
    color: '#1AD655',
  },
  cartButton: {
    width: 27,
    height: 27,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cartIcon: {
    width: 24,
    height: 24,
  },
  cartBadge: {
    position: 'absolute',
    top: -6,
    right: -8,
    minWidth: 16,
    height: 16,
    paddingHorizontal: 3,
    borderRadius: 8,
    backgroundColor: Colors.red,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cartBadgeText: {
    fontSize: fontSize.f8,
    fontFamily: fonts['Poppins-Bold'],
    color: Colors.white,
  },
  notification: {},
  notificationContainer: {
    position: 'relative',
  },
  creatorName: {
    fontSize: fontSize.f20,
    fontFamily: fonts['Poppins-SemiBold'],
    color: '#EEEEEF',
  },
  notificationIcon: {
    width: 24,
    height: 24,
  },
  redDot: {
    position: 'absolute',
    top: -2,
    right: -1,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FF2C35',
  },
});
