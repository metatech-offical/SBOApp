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
import {fontSize, hp} from '@constant/fontSize';
import NodataFound from '@components/DataEmpty/NodataFound';
import FastImage from 'react-native-fast-image';
import {useGetUserContentByIdQuery} from '@rtkServices/ProfileService';
import {useNavigation} from '@react-navigation/native';
import Loading from '@components/CustomLoader/Loading';

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

const HomeProfileTab = ({userId}: {userId: string | undefined}) => {
  const navigation = useNavigation();
  const [activeLatestItemId, setActiveLatestItemId] = useState<string | null>(
    null,
  );
  const [activePopularItemId, setActivePopularItemId] = useState<string | null>(
    null,
  );
  const slideAnimMap = useRef<{[key: string]: Animated.Value}>({}).current;
  const {data, isLoading} = useGetUserContentByIdQuery({
    id: userId || '',
    types: 'home',
    page: 1,
    limit: 10,
    search: '',
  });

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
            <Text style={styles.viewsText}>{item.viewsCount || 0}</Text>
          </View>

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
                  width={75}
                  height={28}
                  style={{alignSelf: 'flex-start', borderColor: '#1AD655'}}
                  textStyle={styles.watchButtonText}
                  shadowColor={'rgba(26, 214, 85, 0.2)'}
                />
              </BlurView>
            </Animated.View>
          )}
        </TouchableOpacity>
      </View>
    );
  };

  // Extract data from API response
  const latestVideos =
    (data as any)?.data?.content?.latestStreamsData?.data || [];
  const popularVideos =
    (data as any)?.data?.content?.popularStreamsData?.data || [];

  return (
    <ScrollView style={styles.container}>
      {isLoading ? (
        <Loading />
      ) : (
        <>
          {latestVideos?.length > 0 || popularVideos?.length > 0 ? (
            <>
              {latestVideos?.length > 0 && (
                <>
                  <Text style={styles.sectionTitle}>Latest</Text>
                  <FlatList
                    data={latestVideos}
                    renderItem={({item}) =>
                      renderVideoItem({item, section: 'latest'})
                    }
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.listContainer}
                  />
                </>
              )}

              {popularVideos?.length > 0 && (
                <>
                  <Text style={[styles.sectionTitle, {paddingTop: hp('2%')}]}>
                    Popular
                  </Text>
                  <FlatList
                    data={popularVideos}
                    renderItem={({item}) =>
                      renderVideoItem({item, section: 'popular'})
                    }
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.listContainer}
                  />
                </>
              )}
            </>
          ) : (
            <NodataFound />
          )}
        </>
      )}
    </ScrollView>
  );
};

export default HomeProfileTab;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: Colors.black,
    // paddingHorizontal: 15,
    // paddingTop: 10,
  },
  sectionTitle: {
    fontSize: fontSize.f18,
    fontFamily: fonts['Poppins-Regular'],
    color: Colors.white,
    marginBottom: 10,
    paddingLeft: 15,

    letterSpacing: -1, // Approximating the -5% letter spacing from design
  },
  listContainer: {
    paddingRight: 20,
    gap: 15,
    paddingLeft: 15,
  },
  videoCard: {
    width: 134,
    borderRadius: 8.7,
    overflow: 'hidden',
    // borderWidth: 2,
    // borderColor: '#1AD655',
  },
  videoImage: {
    width: '100%',
    height: 188,
    resizeMode: 'cover',
  },
  viewsContainer: {
    position: 'absolute',
    top: 10,
    left: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.25)',
    borderRadius: 3.25,
    paddingHorizontal: 4,
    paddingVertical: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  viewsText: {
    fontSize: fontSize.f8,
    fontFamily: fonts['Poppins-SemiBold'],
    color: Colors.white,
    letterSpacing: -0.2,
  },
  animatedContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  videoInfoContainer: {
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    padding: 6.5,
    paddingBottom: 8.7,
    borderTopLeftRadius: 6.5,
    borderTopRightRadius: 6.5,
  },
  videoTitle: {
    fontSize: fontSize.f10,
    fontFamily: fonts['Poppins-Medium'],
    color: Colors.white,
    marginBottom: 2,
  },
  videoDescription: {
    fontSize: fontSize.f8,
    fontFamily: fonts['Poppins-Regular'],
    color: 'rgba(255, 255, 255, 0.77)',
    marginBottom: 6.5,
  },
  watchButtonText: {
    fontSize: fontSize.f8,
    fontFamily: fonts['Poppins-Medium'],
    color: Colors.white,
    letterSpacing: -0.3,
  },
  videoCardContainer: {
    padding: 2,
    borderRadius: 8.7,
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
    borderRadius: 8.7,
  },
  subscriberOnlyText: {
    color: Colors.white,
    fontSize: fontSize.f12,
    fontFamily: fonts['Poppins-Medium'],
    textAlign: 'center',
    paddingHorizontal: 8,
  },
});
