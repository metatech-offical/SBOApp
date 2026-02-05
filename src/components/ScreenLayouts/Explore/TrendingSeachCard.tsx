import {ViewIcon} from '@assets/svg/CommonIcons';
import {VideoIcon} from '@assets/svg/HomeScreenIcon';
import {Colors} from '@constant/colors';
import {fonts} from '@constant/fontfamily';
import {fontSize} from '@constant/fontSize';
import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import FastImage from 'react-native-fast-image';

interface CustomVideoCardProps {
  data: any;
  onPress: () => void;
  customImageStyle?: any;
  customContainerStyle?: any;
  customTitleStyle?: any;
  customSubtitleStyle?: any;
  customViewerCountStyle?: any;
  customIconStyle?: any;
  customCreatorContainerStyle?: any;
}

const TrendingSearchCard: React.FC<CustomVideoCardProps> = ({
  data,
  onPress,
  customImageStyle,
  customContainerStyle,
  customTitleStyle,
  customSubtitleStyle,
  customViewerCountStyle,
  customIconStyle,
  customCreatorContainerStyle,
}) => {
  return (
    <TouchableOpacity
      style={[styles.container, customContainerStyle]}
      onPress={onPress}>
      <FastImage
        source={{uri: data?.thumbnailUrl || ''}}
        style={[styles.image, customImageStyle]}>
        <View style={styles.contentContainer}>
          <View style={styles.viewerContainer}>
            {data?.isLive && (
              <View style={styles.liveContainer}>
                <VideoIcon fill={Colors.white} width={12} height={12} />
              </View>
            )}
            <View style={styles.viewerRowView}>
              {data?.isLive && (
                <ViewIcon width={10} height={10} style={{marginRight: 5}} />
              )}
              <Text style={[styles.viewerCount, customViewerCountStyle]}>
                {data?.viewsCount || 0 || data?.views?.length || 0}
                {!data?.isLive && ' views'}
              </Text>
            </View>
          </View>
        </View>
      </FastImage>
      <View style={styles.subtitleContainer}>
        <Text
          numberOfLines={1}
          style={[styles.subtitleStyle, customSubtitleStyle]}>
          {data?.title || ''}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    overflow: 'hidden',
    backgroundColor: 'transparent',
    marginTop: 10,
    width: 173,
  },
  liveContainer: {
    marginRight: 3,
    backgroundColor: '#FF2C35',
    height: 20,
    width: 20,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: '100%',
    height: 173,
    resizeMode: 'cover',
    overflow: 'hidden',
    borderRadius: 10,
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'space-between',
  },
  viewerContainer: {
    flexDirection: 'row',
    borderRadius: 3,
    margin: 10,
  },
  viewerCount: {
    color: Colors.white,
    fontSize: fontSize.f10,
    fontFamily: fonts['Poppins-Medium'],
  },
  creatorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  subtitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '80%',
    paddingHorizontal: 10,
    marginTop: 6,
  },
  subtitleStyle: {
    color: Colors.white,
    fontSize: fontSize.f14,
    fontFamily: fonts['Poppins-Regular'],
    textTransform: 'capitalize',
    width: '100%',
  },
  iconStyle: {
    height: 18,
    width: 18,
    marginLeft: 10,
    marginTop: 2,
  },
  titleStyle: {
    color: Colors.white,
    fontSize: fontSize.f14,
    fontFamily: fonts['Poppins-Medium'],
    maxWidth: '75%',
  },
  viewerRowView: {
    backgroundColor: '#00000040',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 5,
    // padding: 10,
    paddingVertical: 0,
    marginLeft: 3,
    paddingHorizontal: 10,
  },
});

export default TrendingSearchCard;
