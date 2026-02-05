import React, {useCallback, useState} from 'react';
import {View, StyleSheet} from 'react-native';
import Carousel from 'react-native-reanimated-carousel';
import FastImage from 'react-native-fast-image';
import {wp} from '@constant/fontSize';
import {screenWidth} from '@utils/general';
import {Colors} from '@constant/colors';

const PostCarousel: React.FC<PostCarouselProps> = ({
  images,
  height = 300,
  width = screenWidth - 32,
  autoPlay = false,
  borderRadius = 12,
  autoPlayInterval = 3000,
}) => {
  const [activeIndex, setActiveIndex] = useState(0);

  const onProgressChange = useCallback(
    (_: any, absoluteProgress: number) => {
      const newIndex = Math.round(absoluteProgress);
      if (newIndex !== activeIndex) {
        setActiveIndex(newIndex);
      }
    },
    [activeIndex],
  );

  if (!images || images.length === 0) {
    return null;
  }

  const configurePanGesture = useCallback(
    (panGesture: any) =>
      panGesture.activeOffsetY([-999999, 999999]).activeOffsetX([-20, 20]),
    [],
  );

  return (
    <View style={[styles.container, {height: height}]}>
      <Carousel
        loop
        width={width}
        height={height - wp('5')}
        autoPlay={autoPlay}
        autoPlayInterval={autoPlayInterval}
        data={images}
        onProgressChange={onProgressChange}
        panGestureHandlerProps={{
          activeOffsetX: [-10, 10], // Enable horizontal panning
          failOffsetY: [-5, 5], // Limit vertical movement to fail the gesture
        }}
        renderItem={({item}) => (
          <View style={[styles.slide, {borderRadius}]}>
            <FastImage
              source={{uri: item}}
              style={[styles.image, {borderRadius}]}
              resizeMode={FastImage.resizeMode.cover}
            />
          </View>
        )}
      />
      {images.length > 1 && (
        <View style={styles.pagination}>
          {images.map((_, index) => (
            <View
              key={index}
              style={[
                styles.paginationDot,
                {
                  backgroundColor:
                    index === activeIndex ? Colors.white : '#B3B3B380',
                },
              ]}
            />
          ))}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
  },
  slide: {
    flex: 1,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  pagination: {
    marginTop: wp('1'),
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,

    zIndex: 88,
  },
  paginationDot: {
    width: 6,
    height: 6,
    borderRadius: 4,
  },
});

export default PostCarousel;
