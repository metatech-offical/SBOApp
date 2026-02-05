import React from 'react';
import {Text, ImageBackground, StyleSheet, Pressable, View} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import {fontSize, wp} from '@constant/fontSize';
import {fonts} from '@constant/fontfamily';
import {Colors} from '@constant/colors';

const ShortsCard = ({
  data,
  isGradientVisible = false,
}: {
  data: shorts;
  isGradientVisible?: boolean;
}) => {
  const navigation = useNavigation();
  const isSubscribersOnly =
    data?.settings?.visibility === 'subscribers' && !data?.videoUrl;

  const gotoShortsFeed = () => {
    if (isSubscribersOnly) {
      return;
    }
    navigation.navigate('ShortsFeed', {
      shortsId: data?._id || data?.id,
      type: 'single',
      creatorId: data?.creator?._id,
    });
  };

  return (
    <Pressable
      style={[styles.cardContainer, isSubscribersOnly && styles.disabledCard]}
      onPress={gotoShortsFeed}
      disabled={isSubscribersOnly}>
      <ImageBackground
        source={
          typeof data?.thumbnailUrl === 'string'
            ? {uri: data.thumbnailUrl}
            : data.thumbnailUrl
        }
        style={[styles.thumbnail, isSubscribersOnly && styles.blurredThumbnail]}
        imageStyle={styles.imageStyle}>
        {isGradientVisible && (
          <LinearGradient
            colors={['transparent', 'rgba(0,0,0,0.2)', 'rgba(0,0,0,0.4)']}
            style={styles.gradientOverlay}
          />
        )}
        {data?.duration && (
          <Text style={styles.viewsText}>{data?.duration || 0}s</Text>
        )}

        {isSubscribersOnly && (
          <View style={styles.subscribersOverlay}>
            <Text style={styles.subscribersText}>Subscribers only</Text>
          </View>
        )}
      </ImageBackground>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    width: wp('29'),
    aspectRatio: 0.8,
    margin: wp('1'),
    borderRadius: 6,
    overflow: 'hidden',
  },
  disabledCard: {
    opacity: 1,
  },
  thumbnail: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    padding: 5,
  },
  blurredThumbnail: {
    opacity: 0.5,
  },
  imageStyle: {
    borderRadius: 6,
  },
  viewsText: {
    color: Colors.white,
    fontSize: fontSize.f12,
    fontFamily: fonts['Poppins-Regular'],
    paddingHorizontal: 5,
    paddingVertical: 2,
    borderRadius: 3,
  },
  subscribersOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 6,
  },
  subscribersText: {
    color: '#ffffff',
    fontSize: fontSize.f12,
    fontFamily: fonts['Poppins-SemiBold'],
    textAlign: 'center',
  },
  gradientOverlay: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 6,
  },
});

export default React.memo(ShortsCard);
