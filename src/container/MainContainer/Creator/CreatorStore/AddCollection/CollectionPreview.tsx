import {View, Text, StyleSheet, FlatList, RefreshControl} from 'react-native';
import React, {useState, useCallback, useEffect, useMemo} from 'react';
import NodataFound from '@components/DataEmpty/NodataFound';
import Loader from '@components/CustomLoader/Loader';
import MerchandiseProductItem from '@components/ScreenLayouts/UserMerchandise/MerchandiseProductItem';
import StackHeader from '@components/CustomHeaders/StackHeader';
import {CollectionPreviewProps} from '@navigation/screens';
import {useGetAllProductsByCollectionQuery} from '@rtkServices/UserMerchandiesService';
import AnimationBackground from '@components/AnimationComponent/AnimationBackground';

const CollectionPreview = ({navigation, route}: CollectionPreviewProps) => {
  const {collectionId, collectionName} = route?.params || {};
  const [page, setPage] = useState(1);
  const [refreshing, setRefreshing] = useState(false);
  const [allProducts, setAllProducts] = useState<any[]>([]);
  const [hasMoreData, setHasMoreData] = useState(true);

  const queryParams = useMemo(
    () => ({
      collectionId: collectionId,
      page: page,
      //   search: search,
      //   status: 'live',
    }),
    [collectionId, page],
  );

  const {
    data: products,
    isLoading,
    refetch,
  } = useGetAllProductsByCollectionQuery(queryParams as any);

  useEffect(() => {
    if (products?.data?.totalProductList) {
      if (page === 1) {
        setAllProducts(products?.data?.totalProductList);
      } else {
        setAllProducts(prev => {
          const existingIds = new Set(prev.map(item => item?._id));
          const newItems = products?.data?.totalProductList?.filter(
            item => !existingIds.has(item._id),
          );
          return [...prev, ...newItems];
        });
      }
      const {pagination} = products?.data || {};
      const totalPages = Math.ceil(pagination?.total / pagination?.limit);
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
        zIndex={0}
      />
      <StackHeader
        title={collectionName}
        onBackPress={() => navigation.goBack()}
      />
      <FlatList
        data={allProducts}
        style={styles.flatList}
        ListEmptyComponent={<NodataFound />}
        numColumns={2}
        nestedScrollEnabled={true}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.1}
        ListFooterComponent={renderFooter}
        renderItem={({item}) => {
          return (
            <MerchandiseProductItem
              userType={'creator'}
              item={item}
              onPress={() => {
                navigation.navigate('CreatorProductDetail', {
                  _id: item?._id,
                });
              }}
            />
          );
        }}
      />
    </View>
  );
};

export default CollectionPreview;

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
