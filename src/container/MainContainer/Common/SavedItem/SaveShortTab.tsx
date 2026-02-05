import AnimationBackground from '@components/AnimationComponent/AnimationBackground';
import CustomRefreshControler from '@components/CustomLoader/CustomRefreshControler';
import Loader from '@components/CustomLoader/Loader';
import NodataFound from '@components/DataEmpty/NodataFound';
import ShortsListCard from '@components/ScreenLayouts/Explore/ShortsListCard';
import {hp, wp} from '@constant/fontSize';
import {useGetSaveContentQuery} from '@rtkServices/SettingsService';
import {useEffect, useState} from 'react';
import {View, StyleSheet, FlatList} from 'react-native';

const SaveShortTab = ({navigation}: any) => {
  const {data, isLoading, refetch, isFetching} = useGetSaveContentQuery({
    contentType: 'shorts',
  });
  const [shorts, setShorts] = useState<any[]>([]);
  useEffect(() => {
    if (data) {
      setShorts(data?.data?.content);
    }
  }, [data]);

  const refresh = async () => {
    await refetch();
  };

  return (
    <View style={styles.container}>
      <AnimationBackground
        animationSource={require('@assets/animations/AuthAnimation4.json')}
        backgroundColor={'#1a1538'}
        zIndex={0}
      />
      <View>
        {isLoading ? (
          <Loader visible={isLoading} />
        ) : (
          <FlatList
            data={shorts || []}
            numColumns={3}
            showsVerticalScrollIndicator={false}
            columnWrapperStyle={{
              gap: wp('2'),
            }}
            contentContainerStyle={{
              paddingHorizontal: wp('1'),
              paddingBottom: hp('20'),
              gap: wp('2'),
              marginTop: hp('2'),
            }}
            renderItem={({item}) => (
              <ShortsListCard data={item?.content} isGradientVisible={true} />
            )}
            ListEmptyComponent={() => <NodataFound />}
            keyExtractor={item => item._id}
            refreshControl={
              <CustomRefreshControler
                refreshing={isFetching}
                onRefresh={refresh}
              />
            }
          />
        )}
      </View>
    </View>
  );
};

export default SaveShortTab;

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
