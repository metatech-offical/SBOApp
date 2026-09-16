import {View, StyleSheet, FlatList, ActivityIndicator} from 'react-native';
import React, {useMemo, useState} from 'react';
import {FavoriteCreatorListProps} from '@navigation/screens';
import GlowBackground from '@components/AnimationComponent/GlowBackground';
import {
  useAddFavoriteCreatorMutation,
  useGetFavoriteCreatorsQuery,
  useRemoveFavoriteCreatorMutation,
  useUserSuggestedAccountQuery,
} from '@rtkServices/HomeService';
import NodataFound from '@components/DataEmpty/NodataFound';
import Loader from '@components/CustomLoader/Loader';
import FavoriteItemComp, {
  CreatorListItem,
} from '@components/ScreenLayouts/Home/FavoriteItemComp';
import HomeHeader from '@components/ScreenLayouts/Home/HomeHeader';
import SearchInput from '@components/CustomInputs/SearchInput';
import {useGetSearchResultsQuery} from '@rtkServices/SearchService';
import {RootState, useAppSelector} from '@store/index';
import {useToastMessage} from '@hooks/useToastMessage';
import {Colors} from '@constant/colors';
import CustomRefreshControler from '@components/CustomLoader/CustomRefreshControler';
import {DUMMY_FAVORITE_CREATORS, DUMMY_SUGGESTED_ACCOUNTS, isDummyHomeId} from '@utils/dummyHome';

const FavoriteCreatorList = ({navigation}: FavoriteCreatorListProps) => {
  const {user} = useAppSelector((state: RootState) => state.user);
  const {showError} = useToastMessage();
  const [search, setSearch] = useState('');
  const [favoriteOverrides, setFavoriteOverrides] = useState<
    Record<string, boolean>
  >({});
  const [pendingId, setPendingId] = useState<string | null>(null);

  const {
    data,
    isLoading,
    isFetching,
    refetch,
  } = useGetFavoriteCreatorsQuery({
    page: 1,
    limit: 50,
  });
  const {data: suggestedAccount} = useUserSuggestedAccountQuery({
    page: 1,
    limit: 20,
  });
  const trimmedSearch = search.trim();
  const {data: searchResults, isFetching: isSearching} =
    useGetSearchResultsQuery(
      {search: trimmedSearch},
      {skip: trimmedSearch.length === 0},
    );

  const [addFavorite] = useAddFavoriteCreatorMutation();
  const [removeFavorite] = useRemoveFavoriteCreatorMutation();

  const favoriteCreators = data?.data?.creators?.length
    ? data.data.creators
    : DUMMY_FAVORITE_CREATORS;
  const favoriteIdSet = useMemo(() => {
    return new Set(favoriteCreators.map(item => item.creator._id));
  }, [favoriteCreators]);

  const isFavorite = (id: string) =>
    favoriteOverrides[id] ?? favoriteIdSet.has(id);

  const favoriteRows: CreatorListItem[] = useMemo(
    () =>
      favoriteCreators
        .map(item => ({
          id: item.creator._id,
          username: item.creator.username,
          displayName: item.creator.displayName,
          profilePicture: item.creator.profilePicture,
          verified: item.creator.verified,
          isFavorite: isFavorite(item.creator._id),
        }))
        .filter(item => item.isFavorite),
    [favoriteCreators, favoriteOverrides, favoriteIdSet],
  );

  const suggestedRows: CreatorListItem[] = useMemo(() => {
    const accounts = suggestedAccount?.data?.data?.length
      ? suggestedAccount.data.data
      : DUMMY_SUGGESTED_ACCOUNTS;
    return accounts
      .filter(item => item._id !== user?._id)
      .map(item => ({
        id: item._id,
        username: item.username,
        displayName: item.displayName,
        profilePicture: item.profilePicture,
        verified: item.verified,
        isFavorite: isFavorite(item._id),
      }));
  }, [suggestedAccount, user?._id, favoriteOverrides, favoriteIdSet]);

  const searchRows: CreatorListItem[] = useMemo(() => {
    const users = searchResults?.data?.users || [];
    return users
      .filter(item => item._id !== user?._id)
      .map(item => ({
        id: item._id,
        username: item.username,
        displayName: item.displayName,
        profilePicture: item.profilePicture,
        verified: item.verified,
        followersCount: item.followersCount,
        isFavorite: isFavorite(item._id),
      }));
  }, [searchResults, user?._id, favoriteOverrides, favoriteIdSet]);

  const listData = trimmedSearch
    ? searchRows
    : favoriteRows.length > 0
    ? favoriteRows
    : suggestedRows;

  const handleToggleFavorite = async (item: CreatorListItem) => {
    if (pendingId) {
      return;
    }

    const nextValue = !isFavorite(item.id);
    setPendingId(item.id);
    setFavoriteOverrides(prev => ({...prev, [item.id]: nextValue}));

    if (isDummyHomeId(item.id)) {
      setPendingId(null);
      return;
    }

    try {
      if (nextValue) {
        await addFavorite({creatorId: item.id}).unwrap();
      } else {
        await removeFavorite({creatorId: item.id}).unwrap();
      }
    } catch (error: any) {
      setFavoriteOverrides(prev => {
        const next = {...prev};
        delete next[item.id];
        return next;
      });
      showError(error?.data?.message || 'Something went wrong');
    } finally {
      setPendingId(null);
    }
  };

  return (
    <View style={styles.container}>
      <GlowBackground />
      <View style={styles.contentOverlay}>
        <HomeHeader
          showLogo
          showBecomeCreator
          onLogoPress={() => navigation.goBack()}
        />
        <SearchInput
          value={search}
          onChangeText={setSearch}
          placeholder="Search for creators..."
          placeholderTextColor="rgba(255,255,255,0.5)"
          autoCapitalize="none"
          autoCorrect={false}
          containerStyle={styles.searchInput}
        />
        {isLoading ? (
          <Loader visible={isLoading} />
        ) : (
          <FlatList
            data={listData}
            renderItem={({item}) => (
              <FavoriteItemComp
                item={item}
                onToggleFavorite={handleToggleFavorite}
                disabled={pendingId === item.id}
              />
            )}
            keyExtractor={item => item.id}
            ListEmptyComponent={
              isSearching ? (
                <ActivityIndicator
                  style={styles.searchLoader}
                  color={Colors.white}
                />
              ) : (
                <NodataFound />
              )
            }
            ListHeaderComponent={
              isSearching && listData.length > 0 ? (
                <ActivityIndicator
                  style={styles.searchLoader}
                  color={Colors.white}
                />
              ) : null
            }
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            style={styles.list}
            contentContainerStyle={styles.listContent}
            refreshControl={
              <CustomRefreshControler
                refreshing={isFetching && !isSearching}
                onRefresh={refetch}
              />
            }
          />
        )}
      </View>
    </View>
  );
};

export default FavoriteCreatorList;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    overflow: 'hidden',
    backgroundColor: '#100E12',
  },
  contentOverlay: {
    flex: 1,
    zIndex: 2,
  },
  list: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  searchInput: {
    marginHorizontal: 16,
    marginTop: 0,
    height: 41,
    borderRadius: 8,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    paddingLeft: 16,
  },
  listContent: {
    paddingTop: 16,
    paddingBottom: 40,
    flexGrow: 1,
  },
  searchLoader: {
    marginVertical: 12,
  },
});
