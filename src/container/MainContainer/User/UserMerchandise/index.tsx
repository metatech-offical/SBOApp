import {
  StyleSheet,
  FlatList,
  View,
  Text,
  ActivityIndicator,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {UserMerchandiseProps} from '@navigation/screens';
import MerchandiseHeader from '@components/CustomHeaders/MerchandiseHeader';
import StoreListItem from '@components/ScreenLayouts/UserMerchandise/StoreListItem';
import {fonts} from '@constant/fontfamily';
import {Colors} from '@constant/colors';
import AnimatedBackground from '@components/AnimationComponent/AnimationBackground';
import SearchBar from '@components/ScreenLayouts/UserMerchandise/SearchBar';
import {useGetAllStoresCollectionsQuery} from '@rtkServices/UserMerchandiesService';
import NodataFound from '@components/DataEmpty/NodataFound';
import Loader from '@components/CustomLoader/Loader';
import CustomRefreshControler from '@components/CustomLoader/CustomRefreshControler';
import {fontSize} from '@constant/fontSize';

const UserMerchandise = ({navigation}: UserMerchandiseProps) => {
  const [collections, setCollections] = useState<StoreCollection[]>([]);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const {
    data: storesCollections,
    isLoading,
    isFetching,
    refetch,
  } = useGetAllStoresCollectionsQuery({page: page, limit: 10, search: search});

  useEffect(() => {
    if (storesCollections) {
      if (storesCollections?.data?.pagination?.totalCount === 0) {
        setCollections([]);
      } else {
        setCollections([...collections, ...storesCollections.data.collections]);
      }
    }
  }, [storesCollections]);

  const handleLoadMore = () => {
    if (storesCollections?.data?.pagination?.hasNextPage) {
      setPage(page + 1);
    }
  };

  const handleRefresh = () => {
    setPage(1);
    setSearch('');
    refetch();
  };

  return (
    <View style={styles.container}>
      <AnimatedBackground
        animationSource={require('@assets/animations/AuthAnimation4.json')}
        backgroundColor="#1a1538"
      />
      <View style={styles.contentOverlay}>
        <MerchandiseHeader
          onBackPress={() => navigation.goBack()}
          onCartPress={() => navigation.navigate('CartListScreen')}
        />
        <FlatList
          data={collections}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{paddingBottom: 120}}
          ListEmptyComponent={
            isLoading ? <Loader visible={isLoading} /> : <NodataFound />
          }
          ListHeaderComponent={
            <>
              <Text style={styles.text}>Buy directly from top creators</Text>
              <SearchBar
                showFilterIcon={false}
                value={search}
                onChangeText={setSearch}
                placeholder="Search for collections"
                onFilterPress={() => {}}
              />
            </>
          }
          renderItem={({item}) => (
            <StoreListItem
              item={item}
              onPress={() =>
                navigation.navigate('UserMerchandiseDetail', {
                  collectionId: item._id,
                  name: item?.store?.name,
                  profilePicture: item?.store?.owner?.profilePicture,
                  collectionImage: item?.coverImage,
                })
              }
            />
          )}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.8}
          refreshControl={
            <CustomRefreshControler
              refreshing={isFetching}
              onRefresh={handleRefresh}
            />
          }
          ListFooterComponent={
            isFetching && page !== 1 ? (
              <ActivityIndicator size="small" color={Colors.white} />
            ) : null
          }
        />
      </View>
    </View>
  );
};

export default UserMerchandise;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  columnWrapper: {
    columnGap: 10,
  },
  contentContainer: {
    paddingBottom: 280,
  },
  text: {
    fontSize: fontSize.f34,
    fontFamily: fonts['Poppins-SemiBold'],
    color: Colors.white,
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  contentOverlay: {
    zIndex: 2,
    position: 'relative',
    paddingHorizontal: 5,
  },
});
