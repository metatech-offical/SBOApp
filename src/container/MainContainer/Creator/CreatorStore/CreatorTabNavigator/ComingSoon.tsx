import {View, StyleSheet, FlatList, RefreshControl} from 'react-native';
import React, {useState, useCallback, useEffect} from 'react';
import NodataFound from '@components/DataEmpty/NodataFound';
import Loader from '@components/CustomLoader/Loader';
import {useGetProductsQuery} from '@rtkServices/CreatorStoreService';
import MerchandiseProductItem from '@components/ScreenLayouts/UserMerchandise/MerchandiseProductItem';
import AnimationBackground from '@components/AnimationComponent/AnimationBackground';
import Loading from '@components/CustomLoader/Loading';

const ComingSoon = ({navigation}: any) => {
  const [page, setPage] = useState(1);
  const [refreshing, setRefreshing] = useState(false);
  const [allProducts, setAllProducts] = useState<any[]>([]);
  const [hasMoreData, setHasMoreData] = useState(true);
  const {
    data: products,
    isLoading,
    refetch,
  } = useGetProductsQuery({
    page: page,
    limit: 10,
    status: 'coming_soon',
    search: '',
  });

  useEffect(() => {
    if (products?.data?.totalProductList) {
      if (page === 1) {
        setAllProducts(products.data.totalProductList);
      } else {
        setAllProducts(prev => [...prev, ...products.data.totalProductList]);
      }

      // Check if there's more data
      const {pagination} = products.data;
      const totalPages = Math.ceil(pagination.total / pagination.limit);
      setHasMoreData(page < totalPages);
    }
  }, [products, page]);

  const handleLoadMore = useCallback(() => {
    if (!isLoading && hasMoreData) {
      setPage(prev => prev + 1);
    }
  }, [isLoading, hasMoreData]);

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    setPage(1);
    setAllProducts([]);
    setHasMoreData(true);
    await refetch();
    setRefreshing(false);
  }, [refetch]);

  const renderFooter = () => {
    if (!isLoading || !hasMoreData) return null;
    return (
      <View style={styles.footerLoader}>
        <Loader visible={true} size="small" overlay={false} />
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <AnimationBackground
        animationSource={require('@assets/animations/AuthAnimation4.json')}
        backgroundColor={'#1a1538'}
        zIndex={0}
      />
      <View>
        {isLoading ? (
          <Loading />
        ) : (
          <FlatList
            data={allProducts}
            style={styles.flatList}
            nestedScrollEnabled={true}
            numColumns={2}
            ListEmptyComponent={<NodataFound />}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={handleRefresh}
              />
            }
            onEndReached={handleLoadMore}
            onEndReachedThreshold={0.1}
            ListFooterComponent={renderFooter}
            renderItem={({item}) => (
              <MerchandiseProductItem
                userType={'creator'}
                item={item}
                onPress={() => {
                  navigation.navigate('CreatorProductDetail', {
                    _id: item?._id,
                  });
                }}
              />
            )}
          />
        )}
      </View>
    </View>
  );
};

export default ComingSoon;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  flatList: {
    paddingTop: 10,
    paddingHorizontal: 5,
  },
  footerLoader: {
    paddingVertical: 20,
    alignItems: 'center',
  },
});
