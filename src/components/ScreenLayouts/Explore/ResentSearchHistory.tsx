import {StyleSheet, Text, View, FlatList, TouchableOpacity} from 'react-native';
import React from 'react';
import {ResentIcon} from '@assets/svg/CommonIcons';
import {CrossIcon} from '@assets/svg/AuthFlowIcons';
import {Colors} from '@constant/colors';
import {fonts} from '@constant/fontfamily';
import {navigate} from '@navigation/utils';
import {isDummyReelId} from '@utils/dummyVideos';
import {useDeleteSearchHistoryMutation} from '@rtkServices/SearchService';
import { fontSize } from '@constant/fontSize';

interface ResentSearchHistoryProps {
  data?: RecentSearchItem[];
  onItemPress?: (text: string) => void;
}

export default function ResentSearchHistory({data}: ResentSearchHistoryProps) {
  const [deleteSearchHistory] = useDeleteSearchHistoryMutation();
  const onDeleteItem = async (item: RecentSearchItem) => {
    if (isDummyReelId(item._id)) {
      return;
    }
    try {
      await deleteSearchHistory({search: item.keyword}).unwrap();
    } catch (error) {
      console.log('error-------->', error);
    }
  };
  const onItemPress = (text: string) => {
    navigate('SearchResultScreen', {
      searchQuery: text,
    });
  };
  const renderItem = ({item}: {item: RecentSearchItem}) => (
    <TouchableOpacity
      style={styles.searchItem}
      onPress={() => onItemPress(item.keyword)}>
      <View style={styles.iconContainer}>
        <ResentIcon width={18} height={18} />
      </View>
      <Text style={styles.searchText}>{item.keyword}</Text>
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => onDeleteItem(item)}>
        <CrossIcon color={Colors.white} size={16} />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={item => item._id}
        scrollEnabled={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 10,
  },
  searchItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEF21',
    // backgroundColor: '#1E0433',
    marginBottom: 1,
    borderRadius: 4,
  },
  iconContainer: {
    marginRight: 14,
    opacity: 0.7,
  },
  searchText: {
    flex: 1,
    color: Colors.white,
    fontFamily: fonts['Poppins-Regular'],
    fontSize: fontSize.f12,
  },
  deleteButton: {
    padding: 5,
  },
});
