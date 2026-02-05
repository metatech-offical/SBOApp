import {ViewIcon} from '@assets/svg/CommonIcons';
import {Colors} from '@constant/colors';
import {fonts} from '@constant/fontfamily';
import {fontSize} from '@constant/fontSize';
import {videoTimeDuration} from '@utils/general';
import moment from 'moment';
import React from 'react';
import {View, Text, StyleSheet, Image, TouchableOpacity} from 'react-native';
import FastImage from 'react-native-fast-image';

const VideoListCard = ({
  imageSource,
  title,
  streamedTime,
  duration,
  viewCount,
  onPress,
  item,
}: VideoCardProps) => {
  // Check if video is subscriber-only and videoUrl is null
  const isSubscriberOnly =
    item?.settings?.visibility === 'subscribers' && !item?.videoUrl;

  return (
    <TouchableOpacity
      style={styles.cardContainer}
      onPress={onPress}
      disabled={isSubscriberOnly}>
      <View style={styles.imageContainer}>
        <FastImage
          source={{uri: imageSource}}
          style={styles.thumbnail}
          resizeMode="cover"
        />

        {/* View count overlay */}
        <View style={styles.viewCountContainer}>
          <ViewIcon width={16} height={16} />
          <Text style={styles.viewCountText}> {viewCount}</Text>
        </View>

        {/* Duration overlay */}
        <View style={styles.durationContainer}>
          <Text style={styles.durationText}>
            {videoTimeDuration(duration || 0)}
          </Text>
        </View>

        {/* Subscriber Only overlay */}
        {isSubscriberOnly && (
          <View style={styles.subscriberOnlyOverlay}>
            <Text style={styles.subscriberOnlyText}>Subscriber Only</Text>
          </View>
        )}
      </View>

      <View style={styles.contentContainer}>
        <Text style={styles.title} numberOfLines={2}>
          {title}
        </Text>
        <Text style={styles.metadata}>{moment(streamedTime)?.fromNow()}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a1a',
    padding: 16,
  },
  cardContainer: {
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
  },
  imageContainer: {
    position: 'relative',
    height: 200,
  },
  thumbnail: {
    width: '100%',
    height: '100%',
    borderRadius: 12,
  },
  viewCountContainer: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    flexDirection: 'row',
    alignItems: 'center',
  },
  viewCountText: {
    fontSize: fontSize.f10,
    fontFamily: fonts['Poppins-Medium'],
    color: Colors.white,
  },
  durationContainer: {
    position: 'absolute',
    bottom: 12,
    right: 12,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 4,
  },
  durationText: {
    fontSize: fontSize.f10,
    fontFamily: fonts['Poppins-Medium'],
    color: Colors.white,
  },
  subscriberOnlyOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
  },
  subscriberOnlyText: {
    textAlign: 'center',
    fontSize: fontSize.f16,
    fontFamily: fonts['Poppins-Medium'],
    color: Colors.white,
  },
  contentContainer: {
    paddingHorizontal: 5,
    paddingVertical: 10,
  },
  title: {
    lineHeight: 22,
    marginBottom: 8,
    fontSize: fontSize.f14,
    fontFamily: fonts['Poppins-Medium'],
    color: Colors.white,
  },
  metadata: {
    color: '#A0A0A0',
    fontSize: fontSize.f10,
    fontFamily: fonts['Poppins-Regular'],
  },
});

export default VideoListCard;
