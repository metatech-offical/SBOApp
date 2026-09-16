import React, {useCallback, useEffect, useRef, useState} from 'react';
import {
  ActivityIndicator,
  Platform,
  StyleSheet,
  View,
  ViewabilityConfig,
} from 'react-native';
import {FlatList} from 'react-native-gesture-handler';
import {useIsFocused} from '@react-navigation/native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import ShortRealComponent from '@container/MainContainer/Creator/ShortsViewScreens/ShortRealComponent';
import NewCommentSheet from '@components/Common/NewCommentSheet';
import {Colors} from '@constant/colors';
import {isDummyReelId} from '@utils/dummyVideos';

type ReelsFeedProps = {
  items: any[];
  isActive?: boolean;
  isLoading?: boolean;
  onEndReached?: () => void;
  contentType?: 'shorts' | 'streams';
  embedded?: boolean;
};

const ReelsFeed = ({
  items,
  isActive = true,
  isLoading = false,
  onEndReached,
  contentType = 'shorts',
  embedded = true,
}: ReelsFeedProps) => {
  const isScreenFocused = useIsFocused();
  const insets = useSafeAreaInsets();
  const [feedHeight, setFeedHeight] = useState(0);
  const [visibleIndex, setVisibleIndex] = useState(0);
  const [currentItemId, setCurrentItemId] = useState('');
  const [feedsData, setFeedsData] = useState<any[]>(items);
  const commentSheetRef = useRef<any>(null);

  const tabBarHeight =
    65 +
    (Platform.OS === 'android'
      ? Math.max(insets.bottom, 16)
      : Math.max(insets.bottom, 10));
  const overlayBottom = embedded ? tabBarHeight : 0;
  const canPlay = isActive && isScreenFocused;

  useEffect(() => {
    setFeedsData(items);
    if (items[0]?._id) {
      setCurrentItemId(prev => prev || items[0]._id);
    }
  }, [items]);

  const viewabilityConfig = useRef<ViewabilityConfig>({
    itemVisiblePercentThreshold: 80,
    minimumViewTime: 100,
  }).current;

  const onViewableItemsChanged = useRef(({viewableItems}: any) => {
    if (viewableItems.length > 0) {
      setVisibleIndex(viewableItems[0].index);
      if (viewableItems[0].item?._id) {
        setCurrentItemId(viewableItems[0].item._id);
      }
    }
  }).current;

  const handleCommentPress = useCallback((itemId: string) => {
    if (isDummyReelId(itemId)) {
      return;
    }
    setCurrentItemId(itemId);
    setTimeout(() => {
      commentSheetRef.current?.open();
    }, 300);
  }, []);

  const handleCommentCountChange = useCallback(
    (itemId: string, change: number) => {
      setFeedsData(prev =>
        prev.map(feed =>
          feed?._id === itemId
            ? {
                ...feed,
                commentCount: Math.max((feed?.commentCount || 0) + change, 0),
                commentsCount: Math.max((feed?.commentsCount || 0) + change, 0),
              }
            : feed,
        ),
      );
    },
    [],
  );

  const handleDeleteSuccess = useCallback((deletedId: string) => {
    setFeedsData(prev => prev.filter(feed => feed?._id !== deletedId));
  }, []);

  if (isLoading && feedsData.length === 0) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#fff" />
      </View>
    );
  }

  return (
    <View
      style={styles.container}
      onLayout={event => {
        const nextHeight = Math.round(event.nativeEvent.layout.height);
        if (nextHeight > 0 && nextHeight !== feedHeight) {
          setFeedHeight(nextHeight);
        }
      }}>
      {feedHeight > 0 && (
        <FlatList
          data={feedsData}
          pagingEnabled
          showsVerticalScrollIndicator={false}
          onViewableItemsChanged={onViewableItemsChanged}
          viewabilityConfig={viewabilityConfig}
          keyExtractor={(item: any, index: number) =>
            item?._id || `reel-${index}`
          }
          snapToInterval={feedHeight}
          snapToAlignment="start"
          decelerationRate="fast"
          disableIntervalMomentum
          getItemLayout={(_, index) => ({
            length: feedHeight,
            offset: feedHeight * index,
            index,
          })}
          renderItem={({item, index}) => (
            <ShortRealComponent
              item={item}
              index={index}
              reel_height={feedHeight}
              isFocused={canPlay && index === visibleIndex}
              commentPress={() => handleCommentPress(item._id)}
              onCommentCountChange={handleCommentCountChange}
              onDeleteSuccess={handleDeleteSuccess}
              showBackButton={!embedded}
              contentType={contentType}
              overlayBottom={overlayBottom}
              videoResizeMode="cover"
            />
          )}
          onEndReached={onEndReached}
          onEndReachedThreshold={0.4}
          initialNumToRender={2}
          maxToRenderPerBatch={3}
          windowSize={3}
          removeClippedSubviews
        />
      )}
      <NewCommentSheet
        ref={commentSheetRef}
        itemId={currentItemId}
        creatorId={
          feedsData.find(feed => feed._id === currentItemId)?.creator?._id || ''
        }
        currentItemType={contentType}
      />
    </View>
  );
};

export default ReelsFeed;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.black,
  },
  loader: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.black,
  },
});
