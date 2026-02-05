import {View, Text, StyleSheet, FlatList} from 'react-native';
import React from 'react';
import NodataFound from '@components/DataEmpty/NodataFound';
import {useGetCollectionsQuery} from '@rtkServices/CreatorStoreService';
import AnimationBackground from '@components/AnimationComponent/AnimationBackground';
import CreatorCollectionItem from '@components/ScreenLayouts/CreatorMerchandise/CreatorCollectionItem';
import Loading from '@components/CustomLoader/Loading';

const Livecollections = ({navigation}: any) => {
  const {data: collections, isLoading} = useGetCollectionsQuery();

  return (
    <View style={styles.container}>
      <AnimationBackground
        animationSource={require('@assets/animations/AuthAnimation4.json')}
        backgroundColor="#1a1538"
        zIndex={0}
      />
      {isLoading ? (
        <Loading />
      ) : (
        <FlatList
          data={collections?.data || []}
          ListEmptyComponent={<NodataFound />}
          nestedScrollEnabled={true}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.flatListContent}
          renderItem={({item}) => {
            return (
              <CreatorCollectionItem
                item={item}
                onPress={() =>
                  navigation.navigate('CollectionDetail', {
                    collectionId: item?._id,
                  })
                }
              />
            );
          }}
        />
      )}
    </View>
  );
};

export default Livecollections;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  flatListContent: {
    paddingBottom: 200,
  },
});
