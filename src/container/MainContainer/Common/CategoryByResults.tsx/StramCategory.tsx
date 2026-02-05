import {FlatList, StyleSheet, View} from 'react-native';
import React, {useState, useCallback} from 'react';
import AnimationBackground from '@components/AnimationComponent/AnimationBackground';
import TrendingSearchCard from '@components/ScreenLayouts/Explore/TrendingSeachCard';
import NodataFound from '@components/DataEmpty/NodataFound';
import {hp} from '@constant/fontSize';
import {useGetStreamByCategoryQuery} from '@rtkServices/ShortsService';
import Loader from '@components/CustomLoader/Loader';

const StramCategory = ({navigation, route}: any) => {
  const {query} = route?.params || {};
  const [page, setPage] = useState(1);
  const [allStreamData, setAllStreamData] = useState([]);
  const [hasMoreData, setHasMoreData] = useState(true);

  const {data, isLoading, isFetching} = useGetStreamByCategoryQuery({
    page: page,
    limit: 10,
    categoryName: query,
    type: 'all',
  });

  React.useEffect(() => {
    if (data?.data?.data) {
      const newData = data.data.data;
      const pagination = data.data.pagination;

      if (page === 1) {
        setAllStreamData(newData);
      } else {
        setAllStreamData(prevData => {
          const existingIds = prevData.map(item => item._id);
          const uniqueNewData = newData.filter(
            item => !existingIds.includes(item._id),
          );
          return [...prevData, ...uniqueNewData];
        });
      }

      setHasMoreData(pagination.currentPage < pagination.totalPages);
    }
  }, [data, page]);

  const loadMoreData = useCallback(() => {
    if (!isFetching && !isLoading && hasMoreData) {
      setPage(prevPage => prevPage + 1);
    }
  }, [isFetching, isLoading, hasMoreData]);

  const onRefresh = useCallback(() => {
    setPage(1);
    setAllStreamData([]);
    setHasMoreData(true);
  }, []);

  const renderFooter = () => {
    if (isFetching && page > 1) {
      return <Loader visible={true} />;
    }
    return null;
  };

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
          data={allStreamData}
          numColumns={2}
          columnWrapperStyle={{
            gap: 10,
          }}
          contentContainerStyle={{
            paddingHorizontal: 10,
            paddingBottom: hp('20'),
            gap: 10,
          }}
          showsVerticalScrollIndicator={false}
          renderItem={({item}) => (
            <TrendingSearchCard
              data={item}
              onPress={() => {
                navigation.navigate('NormalPlayer' as never, {
                  streamId: item._id,
                });
              }}
              customContainerStyle={{
                marginTop: 10,
              }}
            />
          )}
          ListEmptyComponent={<NodataFound />}
          ListFooterComponent={renderFooter}
          onEndReached={loadMoreData}
          onEndReachedThreshold={0.3}
          onRefresh={onRefresh}
          refreshing={isLoading && page === 1}
          keyExtractor={(item, index) => `${item._id}-${index}`}
        />
      )}
    </View>
  );
};

export default StramCategory;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  tabContainer: {
    flex: 1,
  },
});
