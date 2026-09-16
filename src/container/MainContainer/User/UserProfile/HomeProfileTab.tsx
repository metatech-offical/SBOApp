import React, {useState, useRef} from 'react';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  ScrollView,
  Animated,
} from 'react-native';
import {Colors} from '@constant/colors';
import {fonts} from '@constant/fontfamily';
import {ViewIcon} from '@assets/svg/CommonIcons';
import BlurView from '@components/CustomBlurView/BlurView';
import LinearGradient from 'react-native-linear-gradient';
import TransparentInnerShadowButton from '@components/CustomButtons/TransparentInnerShadowButton';
import {fontSize} from '@constant/fontSize';
import NodataFound from '@components/DataEmpty/NodataFound';
import FastImage from 'react-native-fast-image';
import {useGetUserContentByIdQuery} from '@rtkServices/ProfileService';
import {useNavigation} from '@react-navigation/native';
import Loading from '@components/CustomLoader/Loading';
import {formatCount} from '@utils/helper';
import {
  DUMMY_PROFILE_LATEST,
  DUMMY_PROFILE_POPULAR,
} from '@utils/dummyVideos';

interface VideoItem {
  _id: string;
  thumbnailUrl: string;
  title: string;
  description: string;
  viewsCount: number;
  type: string;
  status: string;
  isLive: boolean;
  settings: {
    visibility: string;
  };
  videoUrl: string;
}

const HomeProfileTab = ({
  userId,
  embedded,
  useDummyFallback,
}: {
  userId: string | undefined;
  embedded?: boolean;
  useDummyFallback?: boolean;
}) => {
  const navigation = useNavigation();
  const [activeLatestItemId, setActiveLatestItemId] = useState<string | null>(
    null,
  );
  const [activePopularItemId, setActivePopularItemId] = useState<string | null>(
    null,
  );
  const slideAnimMap = useRef<{[key: string]: Animated.Value}>({}).current;
  const {data, isLoading} = useGetUserContentByIdQuery(
    {
      id: userId || '',
      types: 'home',
      page: 1,
      limit: 10,
      search: '',
    },
    {skip: !userId},
  );

  const toggleInfoView = (itemId: string, section: 'latest' | 'popular') => {
    // Initialize animation value for this item if it doesn't exist
    if (!slideAnimMap[itemId]) {
      slideAnimMap[itemId] = new Animated.Value(120);
    }

    const activeItemId =
      section === 'latest' ? activeLatestItemId : activePopularItemId;
    const setActiveItemId =
      section === 'latest' ? setActiveLatestItemId : setActivePopularItemId;
    const isActive = activeItemId === itemId;

    // If clicking on already active item, close it
    if (isActive) {
      Animated.spring(slideAnimMap[itemId], {
        toValue: 120,
        friction: 8,
        tension: 40,
        useNativeDriver: true,
      }).start();
      setActiveItemId(null);
      return;
    }

    // If there's another active item in the same section, close it
    if (activeItemId && activeItemId !== itemId) {
      Animated.spring(slideAnimMap[activeItemId], {
        toValue: 120,
        friction: 8,
        tension: 40,
        useNativeDriver: true,
      }).start();
    }

    // Close any active item in the other section
    if (section === 'latest' && activePopularItemId) {
      Animated.spring(slideAnimMap[activePopularItemId], {
        toValue: 120,
        friction: 8,
        tension: 40,
        useNativeDriver: true,
      }).start();
      setActivePopularItemId(null);
    } else if (section === 'popular' && activeLatestItemId) {
      Animated.spring(slideAnimMap[activeLatestItemId], {
        toValue: 120,
        friction: 8,
        tension: 40,
        useNativeDriver: true,
      }).start();
      setActiveLatestItemId(null);
    }

    // Open the clicked item
    Animated.spring(slideAnimMap[itemId], {
      toValue: 0,
      friction: 8,
      tension: 40,
      useNativeDriver: true,
    }).start();

    setActiveItemId(itemId);
  };

  const handleWatchPress = (itemId: string) => {
    (navigation as any).navigate('NormalPlayer', {
      streamId: itemId,
    });
    // Add your watch functionality here
  };

  const renderVideoItem = ({
    item,
    section,
  }: {
    item: VideoItem;
    section: 'latest' | 'popular';
  }) => {
    // Initialize animation value for this item if it doesn't exist yet
    if (!slideAnimMap[item._id]) {
      slideAnimMap[item._id] = new Animated.Value(120);
    }

    const activeItemId =
      section === 'latest' ? activeLatestItemId : activePopularItemId;
    const isActive = activeItemId === item._id;

    // Check if card should be disabled
    const isSubscriberOnly =
      item.settings?.visibility === 'subscribers' && !item.videoUrl;
    const isDisabled = isSubscriberOnly;

    return (
      <View
        style={[styles.videoCardContainer, isDisabled && styles.disabledCard]}>
        {isActive && !isDisabled && (
          <LinearGradient
            colors={['transparent', '#1AD655']}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              borderRadius: 8.7,
            }}
          />
        )}
        <TouchableOpacity
          activeOpacity={isDisabled ? 1 : 0.9}
          onPress={() => !isDisabled && toggleInfoView(item._id, section)}
          style={styles.videoCard}
          disabled={isDisabled}>
          <FastImage
            source={{
              uri: item.thumbnailUrl || 'https://via.placeholder.com/134x188',
            }}
            style={[styles.videoImage, isDisabled && styles.disabledImage]}
          />

          {/* Subscriber Only Overlay */}
          {isSubscriberOnly && (
            <View style={styles.subscriberOnlyOverlay}>
              <Text style={styles.subscriberOnlyText}>Subscriber Only</Text>
            </View>
          )}

          <View style={styles.viewsContainer}>
            <ViewIcon width={13} height={13} />
            <Text style={styles.viewsText}>
              {formatCount(item.viewsCount || 0).toLowerCase()}
            </Text>
          </View>

          {!isDisabled && !isActive && (
            <View style={styles.staticCaption} pointerEvents="none">
              <Text style={styles.staticTitle} numberOfLines={1}>
                {item.title}
              </Text>
              {!!item.description && (
                <Text style={styles.staticDescription} numberOfLines={2}>
                  {item.description}
                </Text>
              )}
            </View>
          )}

          {!isDisabled && isActive && (
            <Animated.View
              style={[
                styles.animatedContainer,
                {transform: [{translateY: slideAnimMap[item._id]}]},
              ]}>
              <BlurView style={styles.videoInfoContainer}>
                <View>
                  <Text style={styles.videoTitle}>{item.title}</Text>
                  <Text style={styles.videoDescription}>
                    {item.description}
                  </Text>
                </View>
                <TransparentInnerShadowButton
                  title="Watch"
                  onPress={() => handleWatchPress(item._id)}
                  width={48}
                  height={19}
                  style={{alignSelf: 'flex-start', borderColor: '#1AD655'}}
                  textStyle={styles.watchButtonText}
                  shadowColor={'#1AD655'}
                />
              </BlurView>
            </Animated.View>
          )}
        </TouchableOpacity>
      </View>
    );
  };

  const apiLatest =
    (data as any)?.data?.content?.latestStreamsData?.data || [];
  const apiPopular =
    (data as any)?.data?.content?.popularStreamsData?.data || [];
  const latestVideos =
    apiLatest.length > 0
      ? apiLatest
      : useDummyFallback
        ? DUMMY_PROFILE_LATEST
        : [];
  const popularVideos =
    apiPopular.length > 0
      ? apiPopular
      : useDummyFallback
        ? DUMMY_PROFILE_POPULAR
        : [];

  const content = isLoading ? (
    <Loading />
  ) : latestVideos?.length > 0 || popularVideos?.length > 0 ? (
    <>
      {latestVideos?.length > 0 && (
        <View style={styles.section}>
          <Text
            style={[
              styles.sectionTitle,
              !embedded && styles.sectionTitlePadded,
            ]}>
            Latest
          </Text>
          <FlatList
            data={latestVideos}
            renderItem={({item}) =>
              renderVideoItem({item, section: 'latest'})
            }
            horizontal
            nestedScrollEnabled
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={[
              styles.listContainer,
              !embedded && styles.listContainerPadded,
            ]}
          />
        </View>
      )}

      {popularVideos?.length > 0 && (
        <View style={styles.section}>
          <Text
            style={[
              styles.sectionTitle,
              !embedded && styles.sectionTitlePadded,
            ]}>
            Popular
          </Text>
          <FlatList
            data={popularVideos}
            renderItem={({item}) =>
              renderVideoItem({item, section: 'popular'})
            }
            horizontal
            nestedScrollEnabled
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={[
              styles.listContainer,
              !embedded && styles.listContainerPadded,
            ]}
          />
        </View>
      )}
    </>
  ) : (
    <NodataFound compact={embedded} />
  );

  if (embedded) {
    return <View style={styles.embeddedContent}>{content}</View>;
  }

  return (
    <ScrollView
      style={styles.container}
      showsVerticalScrollIndicator={false}>
      {content}
    </ScrollView>
  );
};

export default HomeProfileTab;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  embeddedContent: {
    gap: 24,
    paddingBottom: 24,
  },
  section: {
    gap: 8,
  },
  sectionTitle: {
    fontSize: 20,
    lineHeight: 42,
    fontFamily: fonts['Poppins-Regular'],
    color: '#FFFFFF',
    letterSpacing: -1,
    marginBottom: 0,
  },
  sectionTitlePadded: {
    paddingLeft: 15,
  },
  listContainer: {
    paddingRight: 20,
    gap: 15,
  },
  listContainerPadded: {
    paddingLeft: 15,
  },
  videoCard: {
    width: 134.49,
    borderRadius: 8.68,
    overflow: 'hidden',
  },
  videoImage: {
    width: '100%',
    height: 187.63,
    resizeMode: 'cover',
  },
  viewsContainer: {
    position: 'absolute',
    top: 6.5,
    left: 6.5,
    backgroundColor: 'rgba(0, 0, 0, 0.25)',
    borderRadius: 3.25,
    paddingHorizontal: 4.34,
    paddingVertical: 1.08,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4.34,
  },
  viewsText: {
    fontSize: 9.76,
    fontFamily: fonts['Poppins-SemiBold'],
    color: '#FFFFFF',
    letterSpacing: -0.2,
    lineHeight: 13,
  },
  animatedContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  videoInfoContainer: {
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingTop: 4.34,
    paddingHorizontal: 6.51,
    paddingBottom: 8.68,
    borderTopLeftRadius: 6.51,
    borderTopRightRadius: 6.51,
    gap: 6.51,
  },
  videoTitle: {
    fontSize: 14.1,
    lineHeight: 16,
    fontFamily: fonts['Poppins-Medium'],
    color: '#FFFFFF',
    marginBottom: 0,
  },
  videoDescription: {
    fontSize: 11.93,
    lineHeight: 18,
    fontFamily: fonts['Poppins-Regular'],
    color: '#787878',
    marginBottom: 6.51,
  },
  staticCaption: {
    position: 'absolute',
    left: 10.85,
    right: 8,
    bottom: 8,
  },
  staticTitle: {
    fontSize: 14.1,
    lineHeight: 16,
    fontFamily: fonts['Poppins-Medium'],
    color: '#FFFFFF',
  },
  staticDescription: {
    fontSize: 11.93,
    lineHeight: 18,
    fontFamily: fonts['Poppins-Regular'],
    color: '#787878',
  },
  watchButtonText: {
    fontSize: 8.68,
    lineHeight: 8,
    fontFamily: fonts['Poppins-Medium'],
    color: '#FFFFFF',
    letterSpacing: -0.26,
  },
  videoCardContainer: {
    padding: 0,
    borderRadius: 8.68,
  },
  disabledCard: {
    opacity: 0.6,
  },
  disabledImage: {
    opacity: 0.5,
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
    borderRadius: 8.68,
  },
  subscriberOnlyText: {
    color: Colors.white,
    fontSize: fontSize.f12,
    fontFamily: fonts['Poppins-Medium'],
    textAlign: 'center',
    paddingHorizontal: 8,
  },
});
