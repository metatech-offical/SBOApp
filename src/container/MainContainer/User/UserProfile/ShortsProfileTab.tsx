import {FlatList, StyleSheet, View} from 'react-native';
import React from 'react';
import {useGetUserContentByIdQuery} from '@rtkServices/ProfileService';
import {width} from '@constant/fontSize';
import ShortsListCard from '@components/ScreenLayouts/Explore/ShortsListCard';
import ProfileShortsCard from '@components/ScreenLayouts/ProfileComponent/ProfileShortsCard';
import NodataFound from '@components/DataEmpty/NodataFound';
import Loading from '@components/CustomLoader/Loading';
import {DUMMY_PROFILE_SHORTS} from '@utils/dummyVideos';

const CARD_GAP = 12;
const SHEET_HORIZONTAL_PADDING = 36;

const ShortsProfileTab = ({
  userId,
  embedded,
  useDummyFallback,
}: {
  userId: string | undefined;
  embedded?: boolean;
  useDummyFallback?: boolean;
}) => {
  const {data, isLoading} = useGetUserContentByIdQuery(
    {
      id: userId || '',
      types: 'shorts',
      page: 1,
      limit: 10,
      search: '',
    },
    {skip: !userId},
  );

  const apiShorts = data?.data?.content || [];
  const shorts =
    apiShorts.length > 0
      ? apiShorts
      : useDummyFallback
        ? DUMMY_PROFILE_SHORTS
        : [];

  if (!embedded) {
    return (
      <View style={styles.container}>
        {isLoading ? (
          <Loading />
        ) : (
          <FlatList
            data={shorts}
            numColumns={3}
            showsVerticalScrollIndicator={false}
            columnWrapperStyle={styles.legacyRow}
            contentContainerStyle={styles.legacyList}
            renderItem={({item}) => (
              <ShortsListCard data={item} isGradientVisible={true} />
            )}
            ListEmptyComponent={() => <NodataFound />}
            keyExtractor={item => item._id}
          />
        )}
      </View>
    );
  }

  const cardWidth = (width - SHEET_HORIZONTAL_PADDING * 2 - CARD_GAP * 2) / 3;

  return (
    <View style={styles.embedded}>
      {isLoading ? (
        <Loading />
      ) : (
        <FlatList
          data={shorts}
          numColumns={3}
          scrollEnabled={false}
          nestedScrollEnabled
          showsVerticalScrollIndicator={false}
          columnWrapperStyle={styles.row}
          contentContainerStyle={styles.grid}
          renderItem={({item}) => (
            <ProfileShortsCard item={item} width={cardWidth} />
          )}
          ListEmptyComponent={() => <NodataFound compact />}
          keyExtractor={item => item._id}
        />
      )}
    </View>
  );
};

export default ShortsProfileTab;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  embedded: {
    width: '100%',
  },
  row: {
    gap: CARD_GAP,
  },
  grid: {
    gap: CARD_GAP,
  },
  legacyRow: {
    gap: 8,
  },
  legacyList: {
    paddingHorizontal: 4,
    paddingBottom: 80,
    gap: 8,
  },
});
