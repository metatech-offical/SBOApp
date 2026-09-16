import {Colors} from '@constant/colors';
import {fonts} from '@constant/fontfamily';
import {fontSize} from '@constant/fontSize';
import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import FastImage from 'react-native-fast-image';
import LinearGradient from 'react-native-linear-gradient';

interface ShortsCardProps {
  thumbnail: string;
  title: string;
  userName: string;
  onPress: () => void;
  isLoading?: boolean;
  item?: any;
}

const ShortsCard: React.FC<ShortsCardProps> = React.memo(
  ({thumbnail, title, onPress, isLoading = false, item}) => {
    if (isLoading) {
      return (
        <View style={[styles.cardContainer, styles.skeletonContainer]}>
          <View style={styles.skeletonThumbnail} />
          <View style={styles.textContainer}>
            <View style={styles.skeletonTitle} />
            <View style={styles.skeletonTitle2} />
          </View>
        </View>
      );
    }

    const isSubscribersOnly =
      item?.settings?.visibility === 'subscribers' && !item?.videoUrl;

    const handlePress = () => {
      if (isSubscribersOnly) {
        return;
      }
      onPress();
    };

    return (
      <TouchableOpacity
        style={[styles.cardContainer, isSubscribersOnly && styles.disabledCard]}
        onPress={handlePress}
        activeOpacity={isSubscribersOnly ? 1 : 0.8}
        disabled={isSubscribersOnly}>
        <FastImage
          source={{uri: thumbnail}}
          style={[
            styles.thumbnail,
            isSubscribersOnly && styles.blurredThumbnail,
          ]}
          resizeMode={FastImage.resizeMode.cover}
        />
        <LinearGradient
          colors={['transparent', '#1A1A1A']}
          locations={[0.62, 1]}
          style={styles.gradient}
        />
        {!!title && (
          <View style={styles.textContainer}>
            <Text style={styles.title} numberOfLines={2} ellipsizeMode="tail">
              {title}
            </Text>
          </View>
        )}
        {isSubscribersOnly && (
          <View style={styles.subscribersOverlay}>
            <Text style={styles.subscribersText}>Subscribers only</Text>
          </View>
        )}
      </TouchableOpacity>
    );
  },
);

export default ShortsCard;

const styles = StyleSheet.create({
  cardContainer: {
    width: '100%',
    aspectRatio: 110 / 172,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#333',
  },
  disabledCard: {
    opacity: 0.7,
  },
  skeletonContainer: {
    backgroundColor: 'rgba(128, 128, 128, 0.3)',
  },
  thumbnail: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 8,
  },
  blurredThumbnail: {
    opacity: 0.5,
  },
  gradient: {
    ...StyleSheet.absoluteFillObject,
  },
  skeletonThumbnail: {
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(128, 128, 128, 0.2)',
    borderRadius: 8,
  },
  subscribersOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  textContainer: {
    position: 'absolute',
    bottom: 0,
    paddingHorizontal: 8,
    paddingBottom: 8,
    paddingTop: 16,
    width: '100%',
  },
  title: {
    color: Colors.white,
    fontSize: fontSize.f10,
    fontFamily: fonts['Poppins-Medium'],
    lineHeight: 14,
  },
  subscribersText: {
    color: Colors.white,
    fontSize: fontSize.f12,
    fontFamily: fonts['Poppins-SemiBold'],
    textAlign: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
  },
  skeletonTitle: {
    height: 10,
    borderRadius: 4,
    marginBottom: 4,
    width: '80%',
    backgroundColor: 'rgba(255,255,255,0.12)',
  },
  skeletonTitle2: {
    height: 10,
    borderRadius: 4,
    width: '60%',
    backgroundColor: 'rgba(255,255,255,0.08)',
  },
});
