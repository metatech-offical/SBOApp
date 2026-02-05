import {ActivityIndicator, FlatList, StyleSheet, View} from 'react-native';
import React, {useState} from 'react';
import {useGetUserContentByIdQuery} from '@rtkServices/ProfileService';
import {hp, wp} from '@constant/fontSize';
import ShortsListCard from '@components/ScreenLayouts/Explore/ShortsListCard';
import NodataFound from '@components/DataEmpty/NodataFound';
import {Colors} from '@constant/colors';
import Loading from '@components/CustomLoader/Loading';

const ShortsProfileTab = ({userId}: {userId: string | undefined}) => {
  const [page, setPage] = useState(1);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const {data, isLoading} = useGetUserContentByIdQuery({
    id: userId || '',
    types: 'shorts',
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
          data={data?.data?.content || []}
          numColumns={3}
          showsVerticalScrollIndicator={false}
          columnWrapperStyle={{
            gap: wp('2'),
          }}
          contentContainerStyle={{
            paddingHorizontal: wp('1'),
            paddingBottom: hp('20'),
            gap: wp('2'),
          }}
          renderItem={({item}) => (
            <ShortsListCard data={item} isGradientVisible={true} />
          )}
          ListEmptyComponent={() => <NodataFound />}
          keyExtractor={item => item._id}
          onEndReached={LoadMore}
          onEndReachedThreshold={0.5}
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
});
