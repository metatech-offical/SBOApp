import {FlatList, StyleSheet, Text, View} from 'react-native';
import React, {useRef, useState} from 'react';
import NodataFound from '@components/DataEmpty/NodataFound';
import {useGetUserContentByIdQuery} from '@rtkServices/ProfileService';
import LiveVideoCard from '@components/VideosComponent/LiveVideoCard';
import {useNavigation} from '@react-navigation/native';
import {useFollowUnfollowUserMutation} from '@rtkServices/ContentActionService';
import Loading from '@components/CustomLoader/Loading';
import {useToastMessage} from '@hooks/useToastMessage';

const LiveProfileTab = ({userId}: {userId: string | undefined}) => {
  const navigation = useNavigation();
  const streamIdRef = useRef<string>('');
  const {showError} = useToastMessage();
  const [followAndUnfollow] = useFollowUnfollowUserMutation();
  const {data, isLoading} = useGetUserContentByIdQuery({
    id: userId || '',
    types: 'video-live',
    page: 1,
    limit: 10,
    search: '',
  });

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
          renderItem={({item}) => (
            <LiveVideoCard
              item={item}
              handleFollow={() => {
                handleFollow(item?.creator?._id);
              }}
              navigation={navigation}
              isOptionPress={() => {
                streamIdRef.current = item?._id;
              }}
              type="profile"
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
  contentContainer: {},
});
