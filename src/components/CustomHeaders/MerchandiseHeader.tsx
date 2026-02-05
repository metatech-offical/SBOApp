import {View, StyleSheet, TouchableOpacity, Text, Animated} from 'react-native';
import React, {useEffect, useRef} from 'react';
import {BackArrow} from '@assets/svg/AuthFlowIcons';
import FastImage from 'react-native-fast-image';
import {useAppSelector} from '@store/index';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {Colors} from '@constant/colors';
import {fonts} from '@constant/fontfamily';
import {fontSize} from '@constant/fontSize';

const MerchandiseHeader = ({
  onBackPress,
  style,
  onCartPress,
  icon,
  isCartVisible = true,
}: MerchandiseHeaderProps) => {
  const {cartItemsCount} = useAppSelector(state => state.cart);
  const scaleAnimation = useRef(new Animated.Value(1)).current;
  const fadeAnimation = useRef(new Animated.Value(1)).current;
  const {top} = useSafeAreaInsets();
  useEffect(() => {
    if (cartItemsCount > 0) {
      // Bounce animation when count changes
      Animated.sequence([
        Animated.parallel([
          Animated.timing(scaleAnimation, {
            toValue: 1.3,
            duration: 200,
            useNativeDriver: true,
          }),
          Animated.timing(fadeAnimation, {
            toValue: 0.8,
            duration: 100,
            useNativeDriver: true,
          }),
        ]),
        Animated.parallel([
          Animated.timing(scaleAnimation, {
            toValue: 1,
            duration: 200,
            useNativeDriver: true,
          }),
          Animated.timing(fadeAnimation, {
            toValue: 1,
            duration: 100,
            useNativeDriver: true,
          }),
        ]),
      ]).start();
    }
  }, [cartItemsCount]);

  return (
    <View style={[styles.container, {marginTop: top}, style]}>
      <View style={styles.row}>
        <TouchableOpacity
          onPress={onBackPress}
          style={styles.icon}
          hitSlop={20}>
          <BackArrow color={Colors.white} height={20} width={20} />
          <FastImage
            source={require('@assets/images/appLogo2.png')}
            style={styles.logo}
          />
        </TouchableOpacity>

        {isCartVisible && (
          <TouchableOpacity onPress={onCartPress} style={styles.cartContainer}>
            {icon ? (
              icon
            ) : (
              <View style={styles.cartIconContainer}>
                <FastImage
                  source={require('@assets/images/CartIcon.png')}
                  style={styles.cartIcon}
                />
                {cartItemsCount > 0 && (
                  <Animated.View
                    style={[
                      styles.badgeContainer,
                      {
                        transform: [{scale: scaleAnimation}],
                        opacity: fadeAnimation,
                      },
                    ]}>
                    <Text style={styles.badgeText}>
                      {cartItemsCount > 99 ? '99+' : cartItemsCount}
                    </Text>
                  </Animated.View>
                )}
              </View>
            )}
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export default MerchandiseHeader;
const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 50,
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    marginTop: 10,
    marginBottom: 10,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  },
  icon: {
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    columnGap: 10,
  },
  logo: {
    height: 33,
    width: 78,
    resizeMode: 'contain',
  },
  cartIcon: {
    height: 25,
    width: 25,
    resizeMode: 'contain',
  },
  cartContainer: {
    alignItems: 'center',
  },
  cartIconContainer: {
    position: 'relative',
  },
  badgeContainer: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: Colors.red,
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  badgeText: {
    fontSize: fontSize.f10,
    fontFamily: fonts['Poppins-Bold'],
    color: Colors.white,
  },
});
