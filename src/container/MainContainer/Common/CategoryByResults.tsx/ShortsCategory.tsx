import React, {useState, useCallback, useEffect} from 'react';
import {FlatList, StyleSheet, View, Dimensions} from 'react-native';
import AnimationBackground from '@components/AnimationComponent/AnimationBackground';
import {useGetAllShortsFeedQuery} from '@rtkServices/ShortsService';
import Loader from '@components/CustomLoader/Loader';
import ShortsCard from '@components/VideosComponent/ShortsCard';
import NodataFound from '@components/DataEmpty/NodataFound';

const {width} = Dimensions.get('window');
const CARD_GAP = 10;
const CARD_WIDTH = (width - CARD_GAP * 4) / 3;

const ShortsCategory = ({navigation, route}: any) => {
  const {query} = route?.params || {};
  const [page, setPage] = useState(1);
  const [allShortsData, setAllShortsData] = useState([]);
  const [hasMoreData, setHasMoreData] = useState(true);

  const {
    data: getAllShortsData,
    isLoading,
    isFetching,
  } = useGetAllShortsFeedQuery({
    page: page,
    limit: 10,
    categoryName: query,
  });

  useEffect(() => {
    if (getAllShortsData?.data?.data) {
      const newData = getAllShortsData.data.data;
      const pagination = getAllShortsData.data.pagination;

      if (page === 1) {
        setAllShortsData(newData);
      } else {
        setAllShortsData(prevData => {
          const existingIds = prevData.map(item => item._id || item.id);
          const uniqueNewData = newData.filter(
            item => !existingIds.includes(item._id || item.id),
          );
          return [...prevData, ...uniqueNewData];
        });
      }

      // Check if there's more data available
      setHasMoreData(pagination.currentPage < pagination.totalPages);
    }
  }, [getAllShortsData, page]);

  const loadMoreData = useCallback(() => {
    if (!isFetching && !isLoading && hasMoreData) {
      setPage(prevPage => prevPage + 1);
    }
  }, [isFetching, isLoading, hasMoreData]);

  const onRefresh = useCallback(() => {
    setPage(1);
    setAllShortsData([]);
    setHasMoreData(true);
  }, []);

  const renderFooter = () => {
    if (isFetching && page > 1) {
      return (
        <View style={styles.footerLoader}>
          <Loader visible={true} />
        </View>
      );
    }
    return null;
  };


  const renderItem = ({item}: any) => (
    <View style={styles.cardWrapper}>
      <ShortsCard
        thumbnail={item?.thumbnailUrl}
        title={item?.description}
        userName={item?.creator?.userName || item?.userName || ''}
        onPress={() => {}}
      />
    </View>
  );

  return (
    <View style={styles.container}>
      <AnimationBackground
        animationSource={require('@assets/animations/AuthAnimation4.json')}
        backgroundColor={'#1a1538'}
        zIndex={0}
      />
      {isLoading && page === 1 ? (
        <Loader visible={isLoading} />
      ) : (
        <FlatList
          data={allShortsData}
          numColumns={3}
          keyExtractor={(item, index) => `${item?._id || item?.id}-${index}`}
          renderItem={renderItem}
          contentContainerStyle={styles.listContainer}
          columnWrapperStyle={styles.row}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={<NodataFound />}
          ListFooterComponent={renderFooter}
          onEndReached={loadMoreData}
          onEndReachedThreshold={0.3}
          onRefresh={onRefresh}
          refreshing={isLoading && page === 1}
        />
      )}
    </View>
  );
};

export default ShortsCategory;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContainer: {
    paddingHorizontal: 10,
    paddingTop: 10,
  },
  row: {
    marginBottom: 15,
    columnGap: 10,
  },
  cardWrapper: {
    width: CARD_WIDTH,
  },
  footerLoader: {
    paddingVertical: 20,
    alignItems: 'center',
  },
});
