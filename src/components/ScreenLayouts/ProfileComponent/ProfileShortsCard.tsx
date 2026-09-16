import React from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';
import FastImage from 'react-native-fast-image';
import LinearGradient from 'react-native-linear-gradient';
import {useNavigation} from '@react-navigation/native';
import {fonts} from '@constant/fontfamily';
import {fontSize} from '@constant/fontSize';
import {Colors} from '@constant/colors';

type ProfileShortsCardProps = {
  item: any;
  width: number;
};

const CARD_HEIGHT = 124.54;
const CARD_RADIUS = 5.11;

const formatShortDuration = (duration?: number | string) => {
  if (typeof duration === 'string' && duration.trim()) {
    return duration.includes('s') || duration.includes(':')
      ? duration
      : `${duration}s`;
  }
  const total = Number(duration) || 0;
  if (total <= 0) {
    return '';
  }
  if (total < 60) {
    return `${total}s`;
  }
  const hours = Math.floor(total / 3600);
  const minutes = Math.floor((total % 3600) / 60);
  const seconds = total % 60;
  if (hours > 0) {
    return `${hours}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  }
  return `${minutes}:${String(seconds).padStart(2, '0')}`;
};

const ProfileShortsCard = ({item, width}: ProfileShortsCardProps) => {
  const navigation = useNavigation();
  const isSubscribersOnly =
    item?.settings?.visibility === 'subscribers' && !item?.videoUrl;
  const durationLabel = formatShortDuration(item?.duration);

  const openShort = () => {
    if (isSubscribersOnly) {
      return;
    }
    (navigation as any).navigate('ShortsFeed', {
      shortsId: item?._id || item?.id,
      type: 'single',
      creatorId: item?.creator?._id,
    });
  };

  return (
    <Pressable
      onPress={openShort}
      disabled={isSubscribersOnly}
      style={[styles.card, {width}]}>
      <FastImage
        source={{uri: item?.thumbnailUrl || ''}}
        style={styles.image}
        resizeMode="cover"
      />
      <LinearGradient
        colors={['transparent', '#1B1E37']}
        locations={[0.6618, 1]}
        style={styles.gradient}
      />
      <LinearGradient
        colors={['transparent', '#000000']}
        locations={[0.6618, 1]}
        style={styles.gradient}
      />
      {!!durationLabel && (
        <Text style={styles.duration}>{durationLabel}</Text>
      )}
      {isSubscribersOnly && (
        <View style={styles.subscriberOverlay}>
          <Text style={styles.subscriberText}>Subscriber Only</Text>
        </View>
      )}
    </Pressable>
  );
};

export default ProfileShortsCard;

const styles = StyleSheet.create({
  card: {
    height: CARD_HEIGHT,
    borderRadius: CARD_RADIUS,
    overflow: 'hidden',
  },
  image: {
    ...StyleSheet.absoluteFillObject,
  },
  gradient: {
    ...StyleSheet.absoluteFillObject,
  },
  duration: {
    position: 'absolute',
    right: 4,
    bottom: 5,
    fontSize: 9.34,
    lineHeight: 12,
    fontFamily: fonts['Poppins-SemiBold'],
    color: '#EEEEEE',
    letterSpacing: -0.09,
    textAlign: 'right',
  },
  subscriberOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.55)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  subscriberText: {
    color: Colors.white,
    fontSize: fontSize.f10,
    fontFamily: fonts['Poppins-Medium'],
    textAlign: 'center',
    paddingHorizontal: 4,
  },
});
