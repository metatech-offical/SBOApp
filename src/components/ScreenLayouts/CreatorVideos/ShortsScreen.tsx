import React, {useMemo, useCallback} from 'react';
import {View, Text, StyleSheet, ScrollView} from 'react-native';
import {fonts} from '@constant/fontfamily';
import ShortsCard from '@components/VideosComponent/ShortsCard';
import {
  useGetRecommendedShortsQuery,
  useGetTrendingShortsQuery,
} from '@rtkServices/ShortsService';
import {useNavigation} from '@react-navigation/native';
import Loader from '@components/CustomLoader/Loader';
import NodataFound from '@components/DataEmpty/NodataFound';
import { fontSize } from '@constant/fontSize';
import { Colors } from '@constant/colors';

// Types
interface ShortsData {
  _id: string;
  id: string;
  thumbnailUrl: string;
  description: string;
  creator?: {
    userName: string;
  };
  userName?: string;
}

interface ShortsSectionProps {
  title: string;
  data: ShortsData[] | undefined;
  isLoading: boolean;
  onCardPress: (shortsId: string) => void;
}

// Skeleton data - moved outside component to prevent recreation
const SKELETON_DATA = [
  {id: 'skeleton1', thumbnail: '', title: '', userName: ''},
  {id: 'skeleton2', thumbnail: '', title: '', userName: ''},
  {id: 'skeleton3', thumbnail: '', title: '', userName: ''},
];

// Memoized skeleton row component
const SkeletonRow = React.memo(() => (
  <View style={styles.row}>
    {SKELETON_DATA.map(item => (
      <ShortsCard
        key={item.id}
        thumbnail={item.thumbnail}
        title={item.title}
        userName={item.userName}
        onPress={() => {}}
        isLoading={true}
      />
    ))}
  </View>
));

// Memoized shorts row component
const ShortsRow = React.memo<{
  data: ShortsData[];
  onCardPress: (shortsId: string) => void;
}>(({data, onCardPress}) => (
  <View style={styles.row}>
    {data?.map((item: ShortsData) => (
      <ShortsCard
        key={item?._id || item?.id}
        thumbnail={item?.thumbnailUrl}
        title={item?.description}
        userName={item?.creator?.userName || item?.userName || ''}
        onPress={() => onCardPress(item?._id || item?.id)}
        item={item}
      />
    ))}
  </View>
));

// Memoized section component
const ShortsSection = React.memo<ShortsSectionProps>(
  ({title, data, isLoading, onCardPress}) => {
    const {firstRow, secondRow} = useMemo(() => {
      if (!data) return {firstRow: [], secondRow: []};
      return {
        firstRow: data?.slice(0, 3),
        secondRow: data?.slice(3, 6),
      };
    }, [data]);

    return (
      <View style={styles.subscriptionContainers}>
        <View style={styles.forRow}>
          <Text style={styles.heading}>{title}</Text>
        </View>
        <View style={styles.cardsContainer}>
          {isLoading ? (
            <>
              <SkeletonRow />
              <SkeletonRow />
            </>
          ) : (
            <>
              {firstRow.length > 0 && (
                <ShortsRow data={firstRow} onCardPress={onCardPress} />
              )}
              {secondRow.length > 0 && (
                <ShortsRow data={secondRow} onCardPress={onCardPress} />
              )}
            </>
          )}
        </View>
      </View>
    );
  },
);

const ShortsScreen = () => {
  const navigation = useNavigation();

  // API queries
  const {data: recommendedShorts, isLoading: recommendedLoading} =
    useGetRecommendedShortsQuery({
      page: 1,
      limit: 10,
    });

  const {data: trendingShorts, isLoading: trendingLoading} =
    useGetTrendingShortsQuery({
      page: 1,
      limit: 10,
    });

  // Memoized navigation handler
  const handleCardPress = useCallback(
    (shortsId: string) => {
      (navigation as any).navigate('ShortsFeed', {shortsId});
    },
    [navigation],
  );

  // Memoized data extraction
  const recommendedData = useMemo(
    () => recommendedShorts?.data || [],
    [recommendedShorts?.data],
  );

  const trendingData = useMemo(
    () => trendingShorts?.data || [],
    [trendingShorts?.data],
  );

  return (
    <ScrollView
      style={styles.container}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.scrollContent}>
      {recommendedLoading || trendingLoading ? (
        <Loader visible={recommendedLoading} />
      ) : (
        <>
          {recommendedData?.length > 0 || trendingData?.length > 0 ? (
            <>
              {recommendedData?.length > 0 && (
                <ShortsSection
                  title="Recommended shorts"
                  data={recommendedData}
                  isLoading={recommendedLoading}
                  onCardPress={handleCardPress}
                />
              )}
              {trendingData?.length > 0 && (
                <ShortsSection
                  title="Trending now"
                  data={trendingData}
                  isLoading={trendingLoading}
                  onCardPress={handleCardPress}
                />
              )}
            </>
          ) : (
            <NodataFound />
          )}
        </>
      )}
    </ScrollView>
  );
};

export default React.memo(ShortsScreen);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
   scrollContent: {
    paddingHorizontal: 10,
    paddingBottom: 100,
  },
  subscriptionContainers: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    marginBottom: 20,
  },
  cardsContainer: {
    width: '100%',
  },
  forRow: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 26,
    paddingBottom: 10,
  },
  heading: {
    fontFamily: fonts['Poppins-SemiBold'],
    fontSize: fontSize.f16,
    color: Colors.white,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginBottom: 10,
    paddingHorizontal: 1,
    columnGap: 13,
    width: '100%',
  },
});
