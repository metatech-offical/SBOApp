import {
  StyleSheet,
  FlatList,
  View,
  Text,
  ActivityIndicator,
} from 'react-native';
import React, {useEffect, useMemo, useState} from 'react';
import {UserMerchandiseProps} from '@navigation/screens';
import StoreListItem from '@components/ScreenLayouts/UserMerchandise/StoreListItem';
import HomeHeader from '@components/ScreenLayouts/Home/HomeHeader';
import GlowBackground from '@components/AnimationComponent/GlowBackground';
import SearchInput from '@components/CustomInputs/SearchInput';
import {fonts} from '@constant/fontfamily';
import {Colors} from '@constant/colors';
import {useGetAllStoresCollectionsQuery} from '@rtkServices/UserMerchandiesService';
import TicketingNoResult from '@components/DataEmpty/TicketingNoResult';
import CustomRefreshControler from '@components/CustomLoader/CustomRefreshControler';
import {fontSize} from '@constant/fontSize';
import {filterDummyMerchandise} from '@utils/dummyMerchandise';

const UserMerchandise = ({navigation}: UserMerchandiseProps) => {
  const [collections, setCollections] = useState<StoreCollection[]>([]);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const {
    data: storesCollections,
    isLoading,
    isFetching,
    refetch,
  } = useGetAllStoresCollectionsQuery({page, limit: 10, search});

  useEffect(() => {
    setPage(1);
  }, [search]);

  useEffect(() => {
    const next = storesCollections?.data?.collections;
    if (!next) {
      return;
    }
    setCollections(prev => {
      if (page === 1) {
        return next;
      }
      const existing = new Set(prev.map(item => item._id));
      return [...prev, ...next.filter(item => !existing.has(item._id))];
    });
  }, [page, storesCollections]);

  const displayCollections = useMemo(() => {
    const dummy = filterDummyMerchandise(search);
    if (collections.length === 0) {
      return dummy;
    }
    if (collections.length < 4) {
      const existing = new Set(
        collections.map(item => item.name?.toLowerCase?.()),
      );
      return [
        ...collections,
        ...dummy.filter(item => !existing.has(item.name?.toLowerCase?.())),
      ];
    }
    return collections;
  }, [collections, search]);

  const handleLoadMore = () => {
    if (
      collections.length > 0 &&
      storesCollections?.data?.pagination?.hasNextPage
    ) {
      setPage(prev => prev + 1);
    }
  };

  const handleRefresh = () => {
    setPage(1);
    setSearch('');
    refetch();
  };

  return (
    <View style={styles.container}>
      <GlowBackground />
      <HomeHeader showLogo showBecomeCreator showCart />
      <SearchInput
        value={search}
        onChangeText={setSearch}
        placeholder="Search for merch..."
        placeholderTextColor="rgba(255,255,255,0.5)"
        containerStyle={styles.searchInput}
      />
      <FlatList
        data={displayCollections}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={
          <Text style={styles.sectionTitle}>Buy from top creators</Text>
        }
        ListEmptyComponent={
          isLoading ? (
            <View style={styles.loaderContainer}>
              <ActivityIndicator size="small" color={Colors.white} />
            </View>
          ) : (
            <TicketingNoResult />
          )
        }
        renderItem={({item}) => (
          <StoreListItem
            item={item}
            onPress={() => {
              navigation.navigate('UserMerchandiseDetail', {
                collectionId: item._id,
                name: (item as any)?.store?.name,
                profilePicture: (item as any)?.store?.owner?.profilePicture,
                collectionImage: item?.coverImage,
              });
            }}
          />
        )}
        keyExtractor={item => item._id}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.8}
        refreshControl={
          <CustomRefreshControler
            refreshing={isFetching && page === 1}
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
  );
};

export default UserMerchandise;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    overflow: 'hidden',
  },
  searchInput: {
    marginHorizontal: 16,
    marginTop: 0,
    marginBottom: 4,
    height: 41,
    borderRadius: 8,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    paddingLeft: 16,
  },
  listContent: {
    paddingTop: 12,
    paddingBottom: 120,
  },
  sectionTitle: {
    fontSize: fontSize.f16,
    fontFamily: fonts['Poppins-SemiBold'],
    color: Colors.white,
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  loaderContainer: {
    paddingVertical: 48,
    alignItems: 'center',
  },
});
