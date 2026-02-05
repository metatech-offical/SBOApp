import {View, FlatList} from 'react-native';
import React from 'react';
import VeideoSearchListCard from './VeideoSearchListCard';
import NodataFound from '@components/DataEmpty/NodataFound';

export default function VideoSearchList({data}: any) {
  return (
    <View>
      <FlatList
        data={data || []}
        renderItem={({item}) => <VeideoSearchListCard data={item} />}
        ListEmptyComponent={<NodataFound />}
        contentContainerStyle={{paddingBottom: 280}}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}
