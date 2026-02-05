import {View, Text, StyleSheet, FlatList} from 'react-native';
import React from 'react';
import NodataFound from '@components/DataEmpty/NodataFound';
import AnimationBackground from '@components/AnimationComponent/AnimationBackground';
import Loading from '@components/CustomLoader/Loading';
import CreatorEventCard from '@components/ScreenLayouts/CreatorEventComp/CreatorEventCard';
import {useGetPastEventsQuery} from '@rtkServices/CreatorTicketingService';
import {useNavigation} from '@react-navigation/native';
import {RootState, useAppSelector} from '@store/index';
import SearchInput from '@components/CustomInputs/SearchInput';

interface PastEventsProps {
  searchQuery: string;
  onSearchChange: (text: string) => void;
}

const PastEvents = ({searchQuery, onSearchChange}: PastEventsProps) => {
  const {user} = useAppSelector((state: RootState) => state.user);
  const navigation = useNavigation<any>();
  const {data: pastEvents, isLoading} = useGetPastEventsQuery({
    page: 1,
    limit: 20,
    creatorId: user?._id || '',
    search: searchQuery || undefined,
  });
  return (
    <View style={styles.container}>
      <AnimationBackground
        animationSource={require('@assets/animations/AuthAnimation4.json')}
        backgroundColor={'#1a1538'}
        zIndex={0}
      />
      {isLoading ? (
        <Loading />
      ) : (
        <FlatList
          ListHeaderComponent={
            <SearchInput
              value={searchQuery}
              onChangeText={onSearchChange}
              placeholder="Search for events..."
              containerStyle={styles.searchInput}
            />
          }
          stickyHeaderIndices={[0]}
          data={pastEvents?.data?.events || []}
          ListEmptyComponent={<NodataFound />}
          showsVerticalScrollIndicator={false}
          renderItem={({item}) => (
            <CreatorEventCard
              id={item._id}
              event_Name={item.eventName}
              event_Cover_Image={item.eventCoverImageUrl}
              event_Date={item.eventDateTime}
              // event_Status={item.eventStatus}
              event_Status="Ended"
              SoldticketsCount={item.ticketSold || 0}
              onPress={() => {
                navigation.navigate('CreatorEventDetailScreen', {
                  eventId: item._id,
                });
              }}
            />
          )}
        />
      )}
    </View>
  );
};

export default PastEvents;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchInput: {
    marginHorizontal: 10,
    marginTop: 15,
    marginBottom: 15,
  },
});
