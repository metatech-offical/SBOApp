import React, {useCallback, useMemo, useRef, useState} from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import Carousel, {ICarouselInstance} from 'react-native-reanimated-carousel';
import LinearGradient from 'react-native-linear-gradient';
import {fontSize, width} from '@constant/fontSize';
import {fonts} from '@constant/fontfamily';
import {Colors} from '@constant/colors';
import FastImage from 'react-native-fast-image';
import {useNavigation} from '@react-navigation/native';
import Svg, {Path} from 'react-native-svg';

const CARD_HEIGHT = 348;
const CAROUSEL_HEIGHT = 380;
const CARD_INSET = 16;

const WatchNowPlayIcon = () => (
  <Svg width={12} height={12} viewBox="0 0 16 16">
    <Path
      d="M3.2 2.15v11.7c0 .86.92 1.38 1.66.94l9.55-5.85c.7-.43.7-1.45 0-1.88L4.86 1.21C4.12.77 3.2 1.29 3.2 2.15z"
      fill="#111111"
    />
  </Svg>
);

type CarouselContentType = 'stream' | 'shorts' | 'live';

type CustomCarouselProps = {
  CarouselData?: any;
  data?: any[];
  contentType?: CarouselContentType;
};

const normalizeItems = (
  CarouselData: any,
  data: any[] | undefined,
  contentType: CarouselContentType,
) => {
  const source =
    data ??
    CarouselData?.data?.data ??
    CarouselData?.data?.streams ??
    CarouselData?.data ??
    [];

  return (source || [])
    .filter((item: any) => {
      if (contentType === 'live') {
        return !!item;
      }
      if (contentType === 'shorts') {
        return !!(item?.videoUrl?.trim?.() || item?.thumbnailUrl);
      }
      return item?.isLive || item?.videoUrl?.trim?.();
    })
    .slice(0, 5);
};

const CustomCarousel = ({
  CarouselData,
  data,
  contentType = 'stream',
}: CustomCarouselProps) => {
  const ref = useRef<ICarouselInstance>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const navigation = useNavigation();

  const finalDataConcise = useMemo(
    () => normalizeItems(CarouselData, data, contentType),
    [CarouselData, data, contentType],
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

  const handleItemPress = useCallback(
    (item: any) => {
      if (contentType === 'shorts') {
        (navigation as any).navigate('ShortsFeed', {
          shortsId: item?._id || item?.id,
        });
        return;
      }

      if (contentType === 'live' || item?.isLive) {
        (navigation as any).navigate('LiveViewer', {liveID: item?._id});
        return;
      }

      (navigation as any).navigate('NormalPlayer', {
        streamId: item?._id,
      });
    },
    [contentType, navigation],
  );

  const CarouselItem = React.memo(({item}: {item: any}) => {
    const title = item?.title || item?.description || '';
    const isLive = contentType === 'live' || !!item?.isLive;
    const tags = item?.tags || [];

    return (
      <View style={styles.itemContainer}>
        <View style={styles.slide}>
          <FastImage
            source={{uri: item?.thumbnailUrl || ''}}
            style={styles.image}
            resizeMode="cover">
            <LinearGradient
              colors={['transparent', 'rgba(0,0,0,0.3)', 'rgba(0,0,0,0.8)']}
              style={styles.fullSize}
            />

            {isLive && (
              <View style={styles.isLiveTagContainer}>
                <View style={styles.liveIndicator} />
                <Text style={styles.isLiveTagText}>LIVE</Text>
              </View>
            )}

            <View style={styles.textOverlay}>
              <Text style={styles.title}>{title}</Text>
              {tags?.length > 0 && (
                <View style={styles.tagsContainer}>
                  {tags.map((tag: string, idx: number) => (
                    <View
                      key={`${tag}-${idx}`}
                      style={styles.normalTagContainer}>
                      <Text style={styles.subHeading}>{tag}</Text>
                    </View>
                  ))}
                </View>
              )}
            </View>

            <View style={styles.watchLiveBtnContainer}>
              <TouchableOpacity
                style={styles.watchLiveBtnStyle}
                onPress={() => handleItemPress(item)}
                activeOpacity={0.85}>
                <WatchNowPlayIcon />
                <Text style={styles.watchNowText}>Watch Now</Text>
              </TouchableOpacity>
            </View>
          </FastImage>
        </View>
      </View>
    );
  });

  const renderCarouselItem = useCallback(
    ({item}: any) => <CarouselItem item={item} />,
    [CarouselItem],
  );

  if (!finalDataConcise.length) {
    return null;
  }

  return (
    <View style={styles.container}>
      <View style={styles.carouselContainer}>
        <Carousel
          loop
          width={width}
          height={CARD_HEIGHT}
          autoPlay={true}
          autoPlayInterval={3000}
          ref={ref}
          data={finalDataConcise}
          panGestureHandlerProps={{
            activeOffsetX: [-10, 10],
            failOffsetY: [-5, 5],
          }}
          mode={'parallax'}
          modeConfig={{
            parallaxScrollingScale: 0.9,
            parallaxScrollingOffset: 48,
          }}
          renderItem={renderCarouselItem}
          onProgressChange={onProgressChange}
        />
        <View style={styles.paginationContainer}>
          {finalDataConcise.map((_: any, index: number) => (
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
    height: CAROUSEL_HEIGHT,
    overflow: 'hidden',
  },
  itemContainer: {
    paddingHorizontal: CARD_INSET,
  },
  slide: {
    width: width - CARD_INSET * 2,
    height: CARD_HEIGHT,
    borderRadius: 16,
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
    top: 16,
    left: 16,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  liveIndicator: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.red,
    marginRight: 6,
  },
  isLiveTagText: {
    color: Colors.white,
    fontSize: fontSize.f10,
    fontFamily: fonts['Poppins-Bold'],
    letterSpacing: 0.5,
  },
  textOverlay: {
    position: 'absolute',
    bottom: 64,
    left: 16,
    right: 16,
    alignItems: 'center',
  },
  title: {
    fontSize: fontSize.f18,
    fontFamily: fonts['Poppins-Bold'],
    marginBottom: 8,
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: {width: 1, height: 1},
    textShadowRadius: 3,
    lineHeight: 24,
    textAlign: 'center',
    color: Colors.white,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    justifyContent: 'center',
  },
  normalTagContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  subHeading: {
    color: Colors.white,
    fontSize: fontSize.f10,
    fontFamily: fonts['Poppins-SemiBold'],
  },
  watchLiveBtnContainer: {
    position: 'absolute',
    bottom: 16,
    left: 0,
    right: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  watchLiveBtnStyle: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 8,
  },
  watchNowText: {
    color: Colors.black,
    fontSize: fontSize.f12,
    fontFamily: fonts['Poppins-SemiBold'],
    includeFontPadding: false,
  },
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    marginTop: 4,
  },
  paginationDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
});
