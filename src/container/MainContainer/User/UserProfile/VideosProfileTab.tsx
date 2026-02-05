import {ActivityIndicator, FlatList, StyleSheet, View} from 'react-native';
import React, {useState} from 'react';
import VideoListCard from '@components/Cards/VideoListCard';
import NodataFound from '@components/DataEmpty/NodataFound';
import {useGetUserContentByIdQuery} from '@rtkServices/ProfileService';
import {useNavigation} from '@react-navigation/native';
import {Colors} from '@constant/colors';
import Loading from '@components/CustomLoader/Loading';

const VideosProfileTab = ({userId}: {userId: string | undefined}) => {
  const navigation = useNavigation();
  const [page, setPage] = useState(1);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const {data, isLoading} = useGetUserContentByIdQuery({
    id: userId || '',
    types: 'videos',
    page: 1,
    limit: 10,
    search: '',
  });

  const LoadMore = () => {
    if (data?.data?.pagination?.totalPages || (0 > page && !isLoadingMore)) {
      setPage(page + 1);
      setIsLoadingMore(true);
    }
  };

  return (
    <View style={styles.container}>
      {isLoading ? (
        <Loading />
      ) : (
        <FlatList
          data={data?.data?.content}
          nestedScrollEnabled={true}
          contentContainerStyle={styles.contentContainer}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={<NodataFound />}
          renderItem={({item}: any) => (
            <VideoListCard
              imageSource={item.thumbnailUrl}
              title={item.title}
              streamedTime={item?.createdAt}
              duration={item.duration}
              viewCount={item.viewsCount}
              onPress={() => {
                navigation.navigate('NormalPlayer' as never, {
                  streamId: item._id,
                });
              }}
              item={item}
            />
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
  contentContainer: {
    // paddingTop: 20,
  },
});
