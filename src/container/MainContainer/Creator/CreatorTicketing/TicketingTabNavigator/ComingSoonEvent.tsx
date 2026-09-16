import {View, Text, StyleSheet, FlatList} from 'react-native';
import React from 'react';
import NodataFound from '@components/DataEmpty/NodataFound';
import AnimationBackground from '@components/AnimationComponent/AnimationBackground';
import Loading from '@components/CustomLoader/Loading';
import CreatorEventCard from '@components/ScreenLayouts/CreatorEventComp/CreatorEventCard';
import {useGetComingSoonEventsQuery} from '@rtkServices/CreatorTicketingService';
import {useNavigation} from '@react-navigation/native';
import {RootState, useAppSelector} from '@store/index';
import SearchInput from '@components/CustomInputs/SearchInput';
import {DUMMY_UPCOMING_EVENTS, filterDummyEvents} from '@utils/dummyTicketing';

interface ComingSoonEventProps {
  searchQuery: string;
  onSearchChange: (text: string) => void;
}

const ComingSoonEvent = ({searchQuery, onSearchChange}: ComingSoonEventProps) => {
  const navigation = useNavigation<any>();
  const {user} = useAppSelector((state: RootState) => state.user);
  const {data: comingSoonEvents, isLoading} = useGetComingSoonEventsQuery({
    page: 1,
    limit: 20,
    creatorId: user?._id || '',
    search: searchQuery || undefined,
  });
  const events = comingSoonEvents?.data?.events?.length
    ? comingSoonEvents.data.events
    : filterDummyEvents(DUMMY_UPCOMING_EVENTS, {search: searchQuery});
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
          data={events}
          ListEmptyComponent={<NodataFound />}
          showsVerticalScrollIndicator={false}
          renderItem={({item}) => (
            <CreatorEventCard
              id={item._id}
              event_Name={item.eventName}
              event_Cover_Image={item.eventCoverImageUrl}
              event_Date={item.eventDateTime}
              event_Status="Coming"
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

export default ComingSoonEvent;

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
