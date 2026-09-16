import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {View, Text, StyleSheet, FlatList, Pressable} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import FastImage from 'react-native-fast-image';
import {SCREEN_HEIGHT} from '@gorhom/bottom-sheet';
import ShortsFeedCard from '@components/VideosComponent/ShortsFeedCard';
import CustomRefreshControler from '@components/CustomLoader/CustomRefreshControler';
import CustomBottomSheet from '@components/CustomBottomSheet/CustomBottomSheet';
import CustomRadioButton from '@components/CustomRadioButton/CustomRadioButton';
import NodataFound from '@components/DataEmpty/NodataFound';
import {
  useGetAllShortsFeedQuery,
  useGetRecommendedShortsQuery,
  useGetTrendingShortsQuery,
} from '@rtkServices/ShortsService';
import {
  useFollowUnfollowUserMutation,
  useNotInterestedMutation,
  useReportContentMutation,
} from '@rtkServices/ContentActionService';
import {LiveSheetData, REPORT_DATA} from '@utils/data';
import {
  DUMMY_SHORTS_REELS,
  extractList,
  isDummyReelId,
  mergeUniqueReels,
} from '@utils/dummyVideos';
import {navigate} from '@navigation/utils';
import {useToastMessage} from '@hooks/useToastMessage';
import {fonts} from '@constant/fontfamily';
import {fontSize} from '@constant/fontSize';
import {Colors} from '@constant/colors';
import {RootState, useAppSelector} from '@store/index';

const ShortsScreen = ({isActive: _isActive = true}: {isActive?: boolean}) => {
  const navigation = useNavigation<any>();
  const {showError, showSuccess} = useToastMessage();
  const {user} = useAppSelector((state: RootState) => state.user);
  const sheetRef = useRef(null);
  const selectedIdRef = useRef('');

  const [page, setPage] = useState(1);
  const [items, setItems] = useState<any[]>([]);
  const [isOpenSheet, setIsOpenSheet] = useState(false);
  const [isOpenSheet1, setIsOpenSheet1] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState<any>('');

  const {data: feedData, isFetching, refetch} = useGetAllShortsFeedQuery({
    page,
    limit: 10,
  });
  const {data: recommendedShorts} = useGetRecommendedShortsQuery({
    page: 1,
    limit: 10,
  });
  const {data: trendingShorts} = useGetTrendingShortsQuery({
    page: 1,
    limit: 10,
  });
  const [followAndUnfollow] = useFollowUnfollowUserMutation();
  const [reportUser] = useReportContentMutation();
  const [notIntrestReq] = useNotInterestedMutation();

  const pageFeedItems = useMemo(() => extractList(feedData), [feedData]);

  useEffect(() => {
    const nextItems = mergeUniqueReels(
      [
        page === 1 ? extractList(recommendedShorts) : [],
        page === 1 ? extractList(trendingShorts) : [],
        pageFeedItems,
      ],
      false,
    );

    setItems(prev => {
      if (page === 1) {
        return nextItems.length > 0 ? nextItems : DUMMY_SHORTS_REELS;
      }
      const existing = new Set(prev.map(item => item._id));
      return [...prev, ...nextItems.filter(item => !existing.has(item._id))];
    });
  }, [page, pageFeedItems, recommendedShorts, trendingShorts]);

  const isUsingDummy = isDummyReelId(items[0]?._id);

  const handleRefresh = async () => {
    setPage(1);
    await refetch();
  };

  const handleLoadMore = () => {
    if (!isUsingDummy && !isFetching && pageFeedItems.length >= 10) {
      setPage(prev => prev + 1);
    }
  };

  const openPlayer = (item: any) => {
    navigation.navigate('ShortsFeed', {
      shortsId: item?._id,
      feedItems: isUsingDummy ? items : undefined,
    });
  };

  const handleFollow = async (item: any) => {
    if (isDummyReelId(item?._id)) {
      setItems(prev =>
        prev.map(feed =>
          feed._id === item._id
            ? {...feed, isFollowing: !feed.isFollowing}
            : feed,
        ),
      );
      return;
    }
    try {
      const res: any = await followAndUnfollow({
        targetUserId: item?.creator?._id,
      });
      if (res?.data) {
        setItems(prev =>
          prev.map(feed =>
            feed._id === item._id
              ? {...feed, isFollowing: !feed.isFollowing}
              : feed,
          ),
        );
      }
      if (res?.error) {
        showError(res?.error?.data?.message || res?.error?.data);
      }
    } catch (error) {
      console.log('Follow/Unfollow error:', error);
    }
  };

  const handleProfilePress = (item: any) => {
    if (isDummyReelId(item?._id) || !item?.creator?._id) {
      return;
    }
    if (user?._id === item?.creator?._id) {
      return;
    }
    navigate('OtherUserProfile', {userId: item?.creator?._id});
  };

  const handleSubmit = (sheetItem: any) => {
    if (sheetItem?.id == 1) {
      setIsOpenSheet1(true);
    } else if (sheetItem?.id == 2) {
      notIntrested();
    }
  };

  const RenderSheet = () => (
    <View style={styles.sheetContainer}>
      <FlatList
        data={LiveSheetData}
        showsHorizontalScrollIndicator={false}
        renderItem={({item}) => (
          <Pressable onPress={() => handleSubmit(item)} style={styles.sheetItem}>
            <FastImage source={item.image} style={styles.sheetItemImage} />
            <Text style={styles.sheetItemText}>{item.name}</Text>
          </Pressable>
        )}
        keyExtractor={item => item?.id?.toString()}
      />
    </View>
  );

  const RenderReportSheet = useCallback(
    () => (
      <View style={styles.sheetContent}>
        <CustomRadioButton
          data={REPORT_DATA}
          selectedFilter={selectedFilter?.value}
          onPress={(item: any) => setSelectedFilter(item)}
          customTitleStyle={{}}
        />
      </View>
    ),
    [selectedFilter],
  );

  const reportSubmit = async (reason: any) => {
    const contentId = selectedIdRef.current;
    if (isDummyReelId(contentId)) {
      setIsOpenSheet(false);
      setIsOpenSheet1(false);
      return;
    }
    const reasonLabel = reason?.label;
    if (!reasonLabel) {
      showError('Reason is missing.');
      return;
    }
    const body = {
      contentId,
      reason: reasonLabel,
      contentType: 'shorts',
      description: 'test',
    };
    await reportUser(body).then(res => {
      if (res?.data) {
        setIsOpenSheet(false);
        setIsOpenSheet1(false);
        showSuccess(res?.data?.message || '');
      }
      if (res?.error) {
        showError(res?.error?.data?.message || 'Somthing went wrong');
        setIsOpenSheet(false);
        setIsOpenSheet1(false);
      }
    });
  };

  const notIntrested = async () => {
    const contentId = selectedIdRef.current;
    if (isDummyReelId(contentId)) {
      setIsOpenSheet(false);
      setItems(prev => prev.filter(item => item._id !== contentId));
      return;
    }
    const body = {
      contentId,
      contentType: 'shorts',
    };
    await notIntrestReq(body).then(res => {
      if (res?.data) {
        setIsOpenSheet(false);
        showSuccess(res?.data?.message || '');
      }
      if (res?.error) {
        showError(res?.error?.data?.message || 'Somthing went wrong');
        setIsOpenSheet(false);
      }
    });
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={items}
        showsVerticalScrollIndicator={false}
        keyExtractor={(item, index) => item?._id || `short-${index}`}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={<NodataFound />}
        renderItem={({item}) => (
          <ShortsFeedCard
            item={item}
            onPress={() => openPlayer(item)}
            onFollow={() => handleFollow(item)}
            onProfilePress={() => handleProfilePress(item)}
            onOptionsPress={() => {
              selectedIdRef.current = item?._id;
              setIsOpenSheet(true);
            }}
          />
        )}
        refreshControl={
          <CustomRefreshControler
            refreshing={isFetching && page === 1}
            onRefresh={handleRefresh}
          />
        }
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
      />
      {isOpenSheet && (
        <CustomBottomSheet
          label={''}
          ref={sheetRef}
          index={3}
          renderView={RenderSheet}
          onClose={() => setIsOpenSheet(false)}
          onPress={() => setIsOpenSheet(false)}
        />
      )}
      {isOpenSheet1 && (
        <CustomBottomSheet
          label={'Report Problem'}
          ref={sheetRef}
          index={4}
          renderView={RenderReportSheet}
          onClose={() => setIsOpenSheet1(false)}
          onPress={() => setIsOpenSheet1(false)}
          onSubmit={() => reportSubmit(selectedFilter)}
        />
      )}
    </View>
  );
};

export default React.memo(ShortsScreen);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 100,
  },
  sheetContainer: {
    marginTop: 20,
  },
  sheetItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
  },
  sheetItemImage: {
    width: 25,
    height: 25,
    marginRight: 20,
  },
  sheetItemText: {
    fontSize: fontSize.f14,
    fontFamily: fonts['Poppins-Medium'],
    color: Colors.white,
  },
  sheetContent: {
    height: SCREEN_HEIGHT * 0.45,
    maxHeight: SCREEN_HEIGHT * 0.8,
    minHeight: SCREEN_HEIGHT * 0.3,
    paddingHorizontal: 10,
    zIndex: 7,
    alignContent: 'flex-end',
  },
});
