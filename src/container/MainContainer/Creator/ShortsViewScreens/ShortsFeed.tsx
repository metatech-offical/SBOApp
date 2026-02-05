import {
  StyleSheet,
  Text,
  View,
  ViewabilityConfig,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import {ShortsFeedProps} from '@navigation/screens';
import {
  useGetAllShortsFeedQuery,
  useGetShortsByIdQuery,
} from '@rtkServices/ShortsService';
import {FlatList} from 'react-native-gesture-handler';
import ShortRealComponent from './ShortRealComponent';
import NewCommentSheet from '@components/Common/NewCommentSheet';
import {SafeAreaView, useSafeAreaInsets} from 'react-native-safe-area-context';
import {screenHeight} from '@utils/general';
import {Colors} from '@constant/colors';

const ShortsFeed = ({navigation, route}: ShortsFeedProps) => {
  const insets = useSafeAreaInsets();
  const {shortsId, type, creatorId} = route?.params ?? {
    shortsId: '',
    type: '',
    creatorId: '',
  };
  const [visibleIndex, setVisibleIndex] = useState<number>(0);
  const [currentShortId, setCurrentShortId] = useState<string>('');
  const [shortsPage, setShortsPage] = useState<number>(1);
  const [feedsData, setFeedsData] = useState<any[]>([]);
  const flatListRef = useRef<FlatList>(null);
  const newCommentSheetRef = useRef<any>(null);

  const {data: getAllShortsData, isFetching: isFetchingShorts} =
    useGetAllShortsFeedQuery({
      page: shortsPage,
      limit: 10,
      ...(type === 'single' && creatorId ? {creatorId} : {}),
    });

  const {data: userShortsData} = useGetShortsByIdQuery({id: shortsId});

  const viewabilityConfig = useRef<ViewabilityConfig>({
    itemVisiblePercentThreshold: 80,
    minimumViewTime: 100,
  }).current;

  const onViewableItemsChanged = useRef(({viewableItems}: any) => {
    if (viewableItems.length > 0) {
      setVisibleIndex(viewableItems[0].index);
      if (viewableItems[0].item?._id) {
        setCurrentShortId(viewableItems[0].item._id);
      }
    }
  }).current;

  useEffect(() => {
    if (shortsId && userShortsData?.data) {
      const specificShort = userShortsData.data;
      const allShorts = getAllShortsData?.data?.data ?? [];

      // Filter out the specific short from all shorts to avoid duplication
      const filteredShorts = allShorts.filter(
        (short: any) => short?._id !== specificShort?._id,
      );

      // Combine: specific short first, then all other shorts
      const combinedFeeds = [specificShort, ...filteredShorts];

      setFeedsData(prev => {
        if (shortsPage === 1) {
          return combinedFeeds;
        } else {
          // For pagination, only add new shorts that aren't already in the list
          const existingIds = new Set(prev.map((feed: any) => feed?._id));
          const newFeeds = filteredShorts.filter(
            (feed: any) => !existingIds.has(feed?._id),
          );
          return [...prev, ...newFeeds];
        }
      });
    } else if (getAllShortsData?.data?.data) {
      const feeds = getAllShortsData.data.data ?? [];

      setFeedsData(prev => {
        if (shortsPage === 1) {
          return feeds;
        } else {
          const existingIds = new Set(prev.map((feed: any) => feed?._id));
          const newFeeds = feeds.filter(
            (feed: any) => !existingIds.has(feed?._id),
          );
          return [...prev, ...newFeeds];
        }
      });
    }
  }, [getAllShortsData, userShortsData, shortsPage, shortsId]);

  const handleCommentPress = (shortId: string) => {
    setCurrentShortId(shortId);
    setTimeout(() => {
      newCommentSheetRef.current?.open();
    }, 500);
  };
  const handleCommentCountChange = (shortId: string, change: number) => {
    setFeedsData((prevFeeds: Feed[]) =>
      prevFeeds.map((feed: Feed) => {
        if (feed?._id === shortId) {
          return {
            ...feed,
            commentCount: Math.max((feed?.commentCount || 0) + change, 0),
          };
        }
        return feed;
      }),
    );
  };

  const handleDeleteSuccess = (deletedShortId: string) => {
    // Remove the deleted short from the feeds data
    setFeedsData(prevFeeds =>
      prevFeeds.filter(feed => feed?._id !== deletedShortId),
    );
  };

  const isLoadingFeeds =
    !getAllShortsData ||
    (shortsId && !userShortsData) ||
    feedsData.length === 0;

  if (isLoadingFeeds) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: Colors.black,
        }}>
        <ActivityIndicator size="large" color="#fff" />
      </View>
    );
  }

  const reel_height = screenHeight - insets.top - insets.bottom;

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: Colors.black}}>
      <KeyboardAvoidingView
        style={{flex: 1}}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 50 : 20}>
        <View style={[styles.container, {height: reel_height}]}>
          <FlatList
            data={feedsData}
            pagingEnabled={true}
            showsVerticalScrollIndicator={false}
            onViewableItemsChanged={onViewableItemsChanged}
            viewabilityConfig={viewabilityConfig}
            ref={flatListRef}
            keyExtractor={(item: any) => item?._id || ''}
            snapToInterval={reel_height}
            snapToAlignment="start"
            decelerationRate="fast"
            scrollEventThrottle={16}
            disableIntervalMomentum={true}
            renderItem={({item, index}: {item: any; index: number}) => {
              return (
                <ShortRealComponent
                  item={item}
                  index={index}
                  reel_height={reel_height}
                  isFocused={index === visibleIndex}
                  commentPress={() => handleCommentPress(item._id)}
                  onCommentCountChange={handleCommentCountChange}
                  onDeleteSuccess={handleDeleteSuccess}
                />
              );
            }}
            onEndReachedThreshold={0.1}
            ListFooterComponent={
              isFetchingShorts && shortsPage > 1 ? (
                <View style={styles.footerLoader}>
                  <Text style={{color: Colors.white}}>
                    Loading more shorts...
                  </Text>
                </View>
              ) : null
            }
            initialNumToRender={3}
            maxToRenderPerBatch={5}
            windowSize={3}
            removeClippedSubviews={true}
          />
        </View>

        <NewCommentSheet
          ref={newCommentSheetRef}
          itemId={currentShortId}
          creatorId={
            feedsData.find(feed => feed._id === currentShortId)?.creator?._id ||
            ''
          }
          currentItemType="shorts"
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default ShortsFeed;

const styles = StyleSheet.create({
  container: {
    height: screenHeight,
    backgroundColor: Colors.black,
    margin: 0,
    padding: 0,
  },
  Input: {
    flex: 1,
    height: screenHeight,
    margin: 0,
    padding: 0,
    // Add these properties:
    overflow: 'hidden',
  },
  footerLoader: {
    padding: 10,
    alignItems: 'center',
  },
});
