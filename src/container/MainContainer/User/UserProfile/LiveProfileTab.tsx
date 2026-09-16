import {FlatList, StyleSheet, View} from 'react-native';
import React from 'react';
import NodataFound from '@components/DataEmpty/NodataFound';
import {useGetUserContentByIdQuery} from '@rtkServices/ProfileService';
import LiveVideoCard from '@components/VideosComponent/LiveVideoCard';
import ProfileLiveCard from '@components/ScreenLayouts/ProfileComponent/ProfileLiveCard';
import {useNavigation} from '@react-navigation/native';
import {useFollowUnfollowUserMutation} from '@rtkServices/ContentActionService';
import Loading from '@components/CustomLoader/Loading';
import {useToastMessage} from '@hooks/useToastMessage';
import {DUMMY_LIVE_STREAMS, isDummyReelId} from '@utils/dummyVideos';

const LiveProfileTab = ({
  userId,
  embedded,
  useDummyFallback,
}: {
  userId: string | undefined;
  embedded?: boolean;
  useDummyFallback?: boolean;
}) => {
  const navigation = useNavigation();
  const {showError} = useToastMessage();
  const [followAndUnfollow] = useFollowUnfollowUserMutation();
  const {data, isLoading} = useGetUserContentByIdQuery(
    {
      id: userId || '',
      types: 'video-live',
      page: 1,
      limit: 10,
      search: '',
    },
    {skip: !userId},
  );

  const apiLives = data?.data?.content || [];
  const lives =
    apiLives.length > 0
      ? apiLives
      : useDummyFallback
        ? DUMMY_LIVE_STREAMS
        : [];

  const handleFollow = async (id: string) => {
    try {
      const payload = {targetUserId: id};
      await followAndUnfollow(payload).then((res: any) => {
        if (res?.error) {
          showError(
            res?.error?.data?.message
              ? res?.error?.data?.message
              : res?.error?.data,
          );
        }
      });
    } catch (error) {
      console.log('error', error);
    }
  };

  const openLive = (item: any) => {
    if (isDummyReelId(item?._id)) {
      return;
    }
    (navigation as any).navigate('LiveViewer', {liveID: item?._id});
  };

  if (!embedded) {
    return (
      <View style={styles.container}>
        {isLoading ? (
          <Loading />
        ) : (
          <FlatList
            data={lives}
            nestedScrollEnabled
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={<NodataFound />}
            keyExtractor={item => item._id}
            renderItem={({item}) => (
              <LiveVideoCard
                item={item}
                handleFollow={() => handleFollow(item?.creator?._id)}
                navigation={navigation}
                isOptionPress={() => {}}
                type="profile"
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
          data={lives}
          scrollEnabled={false}
          nestedScrollEnabled
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={<NodataFound compact />}
          keyExtractor={item => item._id}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          contentContainerStyle={styles.list}
          renderItem={({item}) => (
            <ProfileLiveCard
              item={item}
              onPress={() => openLive(item)}
              onFollow={() => handleFollow(item?.creator?._id)}
            />
          )}
        />
      )}
    </View>
  );
};

export default LiveProfileTab;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginHorizontal: 10,
  },
  embedded: {
    width: '100%',
  },
  list: {
    paddingBottom: 26,
  },
  separator: {
    height: 28,
  },
});
