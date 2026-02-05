import {Colors} from '@constant/colors';
import {fonts} from '@constant/fontfamily';
import {fontSize} from '@constant/fontSize';
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import FastImage from 'react-native-fast-image';

const {width} = Dimensions.get('window');
const CARD_WIDTH = (width - 48) / 3; // 16px margin on both sides + 8px between cards

interface ShortsCardProps {
  thumbnail: string;
  title: string;
  userName: string;
  onPress: () => void;
  isLoading?: boolean;
  item?: any;
}

const ShortsCard: React.FC<ShortsCardProps> = React.memo(
  ({thumbnail, title, userName, onPress, isLoading = false, item}) => {
    if (isLoading) {
      return (
        <View style={[styles.cardContainer, styles.skeletonContainer]}>
          <View style={styles.skeletonThumbnail} />
          <View style={{}} />
          <View style={styles.textContainer}>
            <View style={styles.skeletonTitle} />
            <View style={styles.skeletonTitle2} />
          </View>
        </View>
      );
    }

    // Check if content is subscribers only
    const isSubscribersOnly =
      item?.settings?.visibility === 'subscribers' && !item?.videoUrl;

    const handlePress = () => {
      if (isSubscribersOnly) {
        // Don't navigate for subscribers only content
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
        {isSubscribersOnly && (
          <View style={styles.subscribersOverlay}>
            <Text style={styles.subscribersText}>Subscribers only</Text>
          </View>
        )}
        {/* <View style={styles.textContainer}>
          <Text style={styles.title} numberOfLines={2} ellipsizeMode="tail">
            {title}
          </Text>
        </View> */}
      </TouchableOpacity>
    );
  },
);

export default ShortsCard;
const styles = StyleSheet.create({
  cardContainer: {
    width: CARD_WIDTH,
    height: 170,
    borderRadius: 10,
    overflow: 'hidden',
    backgroundColor: '#333',
    marginBottom: 5,
  },
  disabledCard: {
    opacity: 0.7,
  },
  skeletonContainer: {
    backgroundColor: 'rgba(128, 128, 128, 0.3)',
  },
  thumbnail: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 10,
  },
  blurredThumbnail: {
    opacity: 0.5,
  },
  skeletonThumbnail: {
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(128, 128, 128, 0.2)',
    borderRadius: 10,
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
    padding: 8,
    width: '100%',
    // backgroundColor: 'rgba(0,0,0,0.4)',
  },
  title: {
    color: Colors.white,
    fontSize: fontSize.f12,
    fontFamily: fonts['Poppins-Medium'],
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
    height: 12,
    // backgroundColor: 'rgba(65, 44, 44, 0.4)',
    borderRadius: 4,
    marginBottom: 4,
    width: '80%',
  },
  skeletonTitle2: {
    height: 12,
    // backgroundColor: 'rgba(128, 128, 128, 0.4)',
    borderRadius: 4,
    width: '60%',
  },
});
