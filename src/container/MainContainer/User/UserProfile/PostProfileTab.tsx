import {ActivityIndicator, FlatList, StyleSheet, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import PostListCard from '@components/Cards/PostListCard';
import {useGetUserContentByIdQuery} from '@rtkServices/ProfileService';
import NodataFound from '@components/DataEmpty/NodataFound';
import {Colors} from '@constant/colors';
import {hp} from '@constant/fontSize';
import Loading from '@components/CustomLoader/Loading';

const PostProfileTab = ({
  userId,
  handleCommentPress = () => {},
}: {
  userId?: string;
  handleCommentPress?: (postId: string) => void;
}) => {
  const [page, setPage] = useState(1);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [content, setContent] = useState<any[]>([]);

  const {data, isLoading, isFetching, refetch} = useGetUserContentByIdQuery({
    id: userId || '',
    types: 'posts',
    page: page,
    limit: 10,
    search: '',
  });

  useEffect(() => {
    if (data?.data?.content) {
      if (page === 1) {
        // First page - replace content
        setContent(data?.data?.content);
      } else {
        // Subsequent pages - append content
        setContent(prevContent => [...prevContent, ...data?.data?.content]);
      }
      setIsLoadingMore(false);
    }
  }, [data?.data?.content, page]);

  const LoadMore = () => {
    const totalPages = data?.data?.pagination?.totalPages || 0;
    const currentPage = data?.data?.pagination?.currentPage || 1;

    if (currentPage < totalPages && !isLoadingMore && !isFetching) {
      setPage(prevPage => prevPage + 1);
      setIsLoadingMore(true);
    }
  };

  const renderPost = ({item, index}: {item: any; index: number}) => (
    <PostListCard
      postData={item}
      onComment={() => handleCommentPress(item?._id || '')}
      onShare={() => {}}
      onMorePress={() => {}}
      onUserPress={() => {}}
      showVerifiedBadge={true}
      showActionBar={true}
      textColor="#fff"
    />
  );

  const renderFooter = () => {
    if (!isLoadingMore) return null;

    return (
      <View style={styles.footerLoader}>
        <ActivityIndicator size="small" color={Colors.white} />
      </View>
    );
  };

  const onRefresh = () => {
    if (page === 1) {
      refetch();
    } else {
      setPage(1);
    }
  };

  return (
    <View style={styles.container}>
      {isLoading && page === 1 && <Loading />}
      <FlatList
        data={content}
        nestedScrollEnabled={true}
        showsVerticalScrollIndicator={false}
        renderItem={renderPost}
        ListEmptyComponent={() => (!isFetching ? <NodataFound /> : null)}
        onEndReached={LoadMore}
        onEndReachedThreshold={0.1}
        ListFooterComponent={renderFooter}
        keyExtractor={(item, index) =>
          item?._id?.toString?.() || index.toString()
        }
        refreshing={isFetching}
        onRefresh={onRefresh}
        contentContainerStyle={{paddingBottom: hp('10')}}
      />
    </View>
  );
};

export default PostProfileTab;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  footerLoader: {
    // paddingVertical: 20,
    alignItems: 'center',
  },
});
