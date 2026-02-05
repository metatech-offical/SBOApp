import React, {useCallback, useRef, useState} from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import Carousel, {ICarouselInstance} from 'react-native-reanimated-carousel';
import LinearGradient from 'react-native-linear-gradient';
import {fontSize, height, width} from '@constant/fontSize';
import {fonts} from '@constant/fontfamily';
import {Colors} from '@constant/colors';
import FastImage from 'react-native-fast-image';
import {useNavigation} from '@react-navigation/native';

const CustomCarousel = ({CarouselData}: any) => {
  const ref = useRef<ICarouselInstance>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const navigation = useNavigation();

  const finalDataConcise = CarouselData?.data?.data?.filter(
    (item: any) => item.isLive || item.videoUrl?.trim(),
  );

  const onProgressChange = useCallback(
    (_: any, index: number) => {
      const newIndex = Math.round(index);
      if (newIndex !== activeIndex) {
        setActiveIndex(newIndex);
      }
    },
    [activeIndex],
  );

  const CarouselItem = React.memo(({item, styles}: any) => {
    const handleItemPress = useCallback(() => {
      if (item?.isLive) {
        navigation.navigate('LiveViewer', {liveID: item?._id});
      } else {
        navigation.navigate('NormalPlayer' as never, {
          streamId: item?._id,
        });
        console.log('vide0-');
      }
    }, [item, navigation]);

    return (
      <View style={styles.itemContainer}>
        <View style={styles.slide}>
          {/* Background Image */}
          <FastImage
            source={{uri: item?.thumbnailUrl || ''}}
            style={styles.image}
            resizeMode="cover">
            <LinearGradient
              colors={['transparent', 'rgba(0,0,0,0.3)', 'rgba(0,0,0,0.8)']}
              style={styles.fullSize}
            />

            {item?.isLive && (
              <View style={styles.isLiveTagContainer}>
                <View style={styles.liveIndicator} />
                <Text style={styles.isLiveTagText}>LIVE</Text>
              </View>
            )}

            <View style={styles.textOverlay}>
              <Text style={styles.title}>{item?.title}</Text>
              <View style={styles.tagsContainer}>
                {item?.tags?.map((tag: string, idx: number) => (
                  <View key={`${tag}-${idx}`} style={styles.normalTagContainer}>
                    <Text style={styles.subHeading}>{tag}</Text>
                  </View>
                ))}
              </View>
            </View>

            {/* Watch Now Button */}
            <View style={styles.watchLiveBtnContainer}>
              <TouchableOpacity
                style={styles.watchLiveBtnStyle}
                onPress={handleItemPress}>
                <FastImage
                  source={require('@assets/images/playButton.png')}
                  style={styles.watchNowIcon}
                  resizeMode="contain"
                />
                <Text style={styles.watchNowText}>Watch Now</Text>
              </TouchableOpacity>
            </View>
          </FastImage>
        </View>
      </View>
    );
  });

  const renderCarouselItem = useCallback(({item, index}: any) => {
    return <CarouselItem item={item} index={index} styles={styles} />;
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.carouselContainer}>
        <Carousel
          loop
          width={width}
          height={height / 2}
          autoPlay={true}
          autoPlayInterval={3000}
          ref={ref}
          data={(finalDataConcise || []).slice(0, 5)}
          panGestureHandlerProps={{
            activeOffsetX: [-10, 10], // Enable horizontal panning
            failOffsetY: [-5, 5], // Limit vertical movement to fail the gesture
          }}
          mode={'parallax'}
          renderItem={renderCarouselItem}
          onProgressChange={onProgressChange}
        />
        <View style={styles.paginationContainer}>
          {(finalDataConcise || [])?.slice(0, 5).map((_, index) => (
            <View
              key={index}
              style={[
                styles.paginationDot,
                {
                  backgroundColor:
                    index === activeIndex ? '#8800FF' : 'rgba(255,255,255,0.5)',
                },
              ]}
            />
          ))}
        </View>
      </View>
    </View>
  );
};

export default CustomCarousel;

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  carouselContainer: {
    zIndex: 2,
    height: height / 1.95,
  },
  itemContainer: {
    paddingHorizontal: 10,
  },
  slide: {
    width: width,
    height: height / 1.8,
    borderRadius: 20,
    overflow: 'hidden',
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
    justifyContent: 'flex-end',
  },
  fullSize: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  isLiveTagContainer: {
    position: 'absolute',
    top: 20,
    left: 20,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'transparent',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  liveIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.red,
    marginRight: 6,
  },
  isLiveTagText: {
    color: Colors.white,
    fontSize: fontSize.f12,
    fontFamily: fonts['Poppins-Bold'],
    letterSpacing: 0.5,
  },
  textOverlay: {
    position: 'absolute',
    bottom: 100,
    left: 20,
    right: 20,
  },
  title: {
    fontSize: fontSize.f22,
    fontFamily: fonts['Poppins-Bold'],
    marginBottom: 12,
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: {width: 1, height: 1},
    textShadowRadius: 3,
    lineHeight: 28,
    textAlign: 'center',
    color: Colors.white,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    justifyContent: 'center',
  },
  normalTagContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  subHeading: {
    color: Colors.white,
    fontSize: fontSize.f12,
    fontFamily: fonts['Poppins-SemiBold'],
  },
  watchLiveBtnContainer: {
    position: 'absolute',
    bottom: 20,
    left: 0,
    right: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  watchLiveBtnStyle: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 35,
    alignItems: 'center',
    flexDirection: 'row',
    gap: 10,
  },
  watchNowText: {
    color: Colors.black,
    fontSize: fontSize.f16,
    fontFamily: fonts['Poppins-SemiBold'],
  },
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-start',
    gap: 8,
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  watchNowIcon: {
    width: 18,
    height: 18,
  },
});
