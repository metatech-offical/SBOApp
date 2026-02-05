import {FlatList, StyleSheet, View} from 'react-native';
import React from 'react';
import ShortsListCard from './ShortsListCard';
import {hp, wp} from '@constant/fontSize';
import NodataFound from '@components/DataEmpty/NodataFound';

export default function ShortsList({data}: {data: shorts[]}) {
  return (
    <View>
      <FlatList
        data={data || []}
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
      />
    </View>
  );
}

const styles = StyleSheet.create({});
