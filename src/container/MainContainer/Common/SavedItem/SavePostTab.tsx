import AnimationBackground from '@components/AnimationComponent/AnimationBackground';
import PostListCard from '@components/Cards/PostListCard';
import NodataFound from '@components/DataEmpty/NodataFound';
import {useGetSaveContentQuery} from '@rtkServices/SettingsService';
import {useEffect, useState} from 'react';
import {View,StyleSheet, FlatList} from 'react-native';

const SavePostTab = ({navigation}: any) => {
  const {data} = useGetSaveContentQuery({
    contentType: 'posts',
  });
  const [posts, setPosts] = useState<any[]>([]);

  useEffect(() => {
    if (data) {
      const transformedPosts =
        data?.data?.content?.map((item: any) => ({
          ...item.content,
          _id: item.contentId,
          isLiked: item.isLiked,
          isFollowing: item.isFollowing,
          savedAt: item.savedAt,
        })) || [];
      setPosts(transformedPosts);
    }
  }, [data]);

  return (
    <View style={styles.container}>
      <AnimationBackground
        animationSource={require('@assets/animations/AuthAnimation4.json')}
        backgroundColor={'#1a1538'}
        zIndex={0}
      />
      <View>
        <FlatList
          data={posts} // Use the transformed posts instead of data?.data?.content
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{paddingBottom: 100}}
          ListEmptyComponent={<NodataFound />}
          renderItem={({item}) => (
            <PostListCard
              postData={item}
              onComment={() => {}}
              onShare={() => {}}
              onMorePress={() => {}}
              onUserPress={() => {}}
              showVerifiedBadge={true}
              showActionBar={true}
              textColor="#fff"
            />
          )}
        />
      </View>
    </View>
  );
};

export default SavePostTab;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentOverlay: {
    zIndex: 2,
    position: 'relative',
    flex: 1,
    paddingHorizontal: 16,
  },
});
