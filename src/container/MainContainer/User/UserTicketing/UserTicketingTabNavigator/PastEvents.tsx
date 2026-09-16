import {View, StyleSheet, FlatList} from 'react-native';
import React, {useCallback, useMemo} from 'react';
import dayjs from 'dayjs';
import NodataFound from '@components/DataEmpty/NodataFound';
import EventCard from '@components/ScreenLayouts/CreatorEventComp/EventCard';
import {navigationRef} from '@navigation/utils';
import {DUMMY_PAST_EVENTS, filterDummyEvents} from '@utils/dummyTicketing';

const FALLBACK_EVENT_IMAGE = require('@assets/images/EventImg.png');

const PastEvents = ({
  search = '',
  city = '',
  date,
}: {
  search?: string;
  city?: string;
  date?: any;
}) => {
  const events = useMemo(
    () => filterDummyEvents(DUMMY_PAST_EVENTS, {search, city, date}),
    [search, city, date],
  );

  const formatDate = useCallback(
    (value?: string) => (value ? dayjs(value).format('DD MMM YYYY') : '--'),
    [],
  );

  const formatTime = useCallback(
    (value?: string) => (value ? dayjs(value).format('hh:mm A') : '--'),
    [],
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={events}
        ListEmptyComponent={<NodataFound />}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{paddingBottom: 100}}
        keyExtractor={item => item._id}
        renderItem={({item}) => (
          <EventCard
            id={item._id}
            item={item}
            event_Name={item.eventName}
            event_Cover_Image={
              item.eventCoverImageUrl
                ? {uri: item.eventCoverImageUrl}
                : FALLBACK_EVENT_IMAGE
            }
            event_Date={formatDate(item.eventDateTime)}
            event_Status={item.eventStatus ?? 'Ended'}
            SoldticketsCount={item.eventLimitPerUser ?? 0}
            showStartTime={formatTime(item.eventDateTime)}
            ShowEndTime={formatTime(item.eventPublishOnDate)}
            onPress={() => {
              navigationRef.navigate('BookTIcket', {
                data: item,
                creatorId: item?.creatorId?._id,
              });
            }}
          />
        )}
      />
    </View>
  );
};

export default PastEvents;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
