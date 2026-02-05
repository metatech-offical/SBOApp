import {View, Text, StyleSheet, FlatList} from 'react-native';
import React from 'react';
import {FavoriteCreatorListProps} from '@navigation/screens';
import AnimationBackground from '@components/AnimationComponent/AnimationBackground';
import SettingHeader from '@components/CustomHeaders/SettingHeader';
import {useGetFavoriteCreatorsQuery} from '@rtkServices/HomeService';
import NodataFound from '@components/DataEmpty/NodataFound';
import Loader from '@components/CustomLoader/Loader';
import FavoriteItemComp from '@components/ScreenLayouts/Home/FavoriteItemComp';

const FavoriteCreatorList = ({navigation}: FavoriteCreatorListProps) => {
  const {data, isLoading} = useGetFavoriteCreatorsQuery({
    page: 1,
    limit: 10,
  });
  const favoriteCreators = data?.data?.creators || [];

  return (
    <View style={styles.container}>
      <AnimationBackground
        animationSource={require('@assets/animations/AuthAnimation4.json')}
        backgroundColor={'#1a1538'}
        zIndex={0}
      />
      <View style={styles.contentOverlay}>
        <SettingHeader
          title="Favorite Creators"
          onBackPress={() => navigation.goBack()}
        />
        {isLoading ? (
          <Loader visible={isLoading} />
        ) : (
          <FlatList
            data={favoriteCreators}
            renderItem={({item}) => <FavoriteItemComp item={item} />}
            ListEmptyComponent={<NodataFound />}
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>
    </View>
  );
};

export default FavoriteCreatorList;
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
