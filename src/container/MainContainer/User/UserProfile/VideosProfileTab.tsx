import {
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import React, {useMemo, useState} from 'react';
import VideoListCard from '@components/Cards/VideoListCard';
import ProfileVideoCard from '@components/ScreenLayouts/ProfileComponent/ProfileVideoCard';
import NodataFound from '@components/DataEmpty/NodataFound';
import {useGetUserContentByIdQuery} from '@rtkServices/ProfileService';
import {useNavigation} from '@react-navigation/native';
import Loading from '@components/CustomLoader/Loading';
import {SearchIcon, ChevronDownSmallIcon} from '@assets/svg/HomeScreenIcon';
import {DUMMY_PROFILE_VIDEOS} from '@utils/dummyVideos';
import {fonts} from '@constant/fontfamily';

const VideosProfileTab = ({
  userId,
  embedded,
  useDummyFallback,
}: {
  userId: string | undefined;
  embedded?: boolean;
  useDummyFallback?: boolean;
}) => {
  const navigation = useNavigation();
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState<'latest' | 'popular'>('latest');
  const [sortOpen, setSortOpen] = useState(false);

  const {data, isLoading} = useGetUserContentByIdQuery(
    {
      id: userId || '',
      types: 'videos',
      page: 1,
      limit: 10,
      search,
    },
    {skip: !userId},
  );

  const apiVideos = data?.data?.content || [];
  const sourceVideos =
    apiVideos.length > 0
      ? apiVideos
      : useDummyFallback
        ? DUMMY_PROFILE_VIDEOS
        : [];

  const videos = useMemo(() => {
    const query = search.trim().toLowerCase();
    const filtered = sourceVideos.filter((item: any) => {
      if (!query) {
        return true;
      }
      return `${item?.title || ''} ${item?.description || ''}`
        .toLowerCase()
        .includes(query);
    });

    return [...filtered].sort((a: any, b: any) => {
      if (sortBy === 'popular') {
        return (b?.viewsCount || 0) - (a?.viewsCount || 0);
      }
      return (
        new Date(b?.createdAt || 0).getTime() -
        new Date(a?.createdAt || 0).getTime()
      );
    });
  }, [search, sortBy, sourceVideos]);

  const openVideo = (item: any) => {
    if (item?.settings?.visibility === 'subscribers' && !item?.videoUrl) {
      return;
    }
    (navigation as any).navigate('NormalPlayer', {
      streamId: item._id,
    });
  };

  const listHeader = embedded ? (
    <View style={styles.toolbarWrap}>
      <View style={styles.toolbar}>
        <View style={styles.search}>
          <SearchIcon width={14} height={14} stroke="#FFFFFF" />
          <TextInput
            value={search}
            onChangeText={setSearch}
            placeholder="Search"
            placeholderTextColor="rgba(255, 255, 255, 0.46)"
            style={styles.searchInput}
            allowFontScaling={false}
          />
        </View>
        <Pressable
          style={styles.sortButton}
          onPress={() => setSortOpen(open => !open)}>
          <Text style={styles.sortLabel}>Sort by</Text>
          <View style={sortOpen ? styles.chevronUp : undefined}>
            <ChevronDownSmallIcon width={7} height={3} stroke="#FFFFFF" />
          </View>
        </Pressable>
      </View>
      {sortOpen && (
        <View style={styles.sortMenu}>
          <Pressable
            style={styles.sortOption}
            onPress={() => {
              setSortBy('latest');
              setSortOpen(false);
            }}>
            <Text
              style={[
                styles.sortOptionText,
                sortBy === 'latest' && styles.sortOptionActive,
              ]}>
              Latest
            </Text>
          </Pressable>
          <Pressable
            style={styles.sortOption}
            onPress={() => {
              setSortBy('popular');
              setSortOpen(false);
            }}>
            <Text
              style={[
                styles.sortOptionText,
                sortBy === 'popular' && styles.sortOptionActive,
              ]}>
              Popular
            </Text>
          </Pressable>
        </View>
      )}
    </View>
  ) : null;

  if (!embedded) {
    return (
      <View style={styles.container}>
        {isLoading ? (
          <Loading />
        ) : (
          <FlatList
            data={videos}
            nestedScrollEnabled
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={<NodataFound />}
            keyExtractor={item => item._id}
            renderItem={({item}: any) => (
              <VideoListCard
                imageSource={item.thumbnailUrl}
                title={item.title}
                streamedTime={item?.createdAt}
                duration={item.duration}
                viewCount={item.viewsCount}
                onPress={() => openVideo(item)}
                item={item}
              />
            )}
          />
        )}
      </View>
    );
  }

  return (
    <View style={styles.embedded}>
      {isLoading ? (
        <Loading />
      ) : (
        <FlatList
          data={videos}
          scrollEnabled={false}
          nestedScrollEnabled
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={listHeader}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          contentContainerStyle={styles.list}
          ListEmptyComponent={<NodataFound compact />}
          keyExtractor={item => item._id}
          renderItem={({item}) => (
            <ProfileVideoCard item={item} onPress={() => openVideo(item)} />
          )}
        />
      )}
    </View>
  );
};

export default VideosProfileTab;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingBottom: 100,
    paddingHorizontal: 10,
  },
  embedded: {
    width: '100%',
  },
  toolbarWrap: {
    zIndex: 4,
    marginBottom: 16,
  },
  toolbar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    height: 41,
  },
  search: {
    flex: 1,
    height: 41,
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 14,
    paddingRight: 12,
    paddingVertical: 12,
    gap: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 8,
  },
  searchInput: {
    flex: 1,
    padding: 0,
    fontSize: 13,
    lineHeight: 17,
    fontFamily: fonts['Poppins-Regular'],
    color: '#FFFFFF',
  },
  sortButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    height: 17,
  },
  sortLabel: {
    fontSize: 12,
    lineHeight: 17,
    fontFamily: fonts['Poppins-Medium'],
    color: '#FFFFFF',
    textAlign: 'center',
  },
  chevronUp: {
    transform: [{rotate: '180deg'}],
  },
  sortMenu: {
    position: 'absolute',
    top: 45,
    right: 0,
    minWidth: 110,
    backgroundColor: 'rgba(20, 20, 20, 0.96)',
    borderRadius: 8,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
  },
  sortOption: {
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  sortOptionText: {
    fontSize: 12,
    lineHeight: 16,
    fontFamily: fonts['Poppins-Regular'],
    color: 'rgba(255, 255, 255, 0.7)',
  },
  sortOptionActive: {
    color: '#FFFFFF',
    fontFamily: fonts['Poppins-Medium'],
  },
  list: {
    paddingBottom: 26,
  },
  separator: {
    height: 28,
  },
});
