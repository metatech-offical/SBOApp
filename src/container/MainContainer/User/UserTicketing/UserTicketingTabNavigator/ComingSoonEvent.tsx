import {
  View,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import React, {useCallback, useEffect, useMemo, useState} from 'react';
import dayjs from 'dayjs';
import TicketingNoResult from '@components/DataEmpty/TicketingNoResult';
import EventCard from '@components/ScreenLayouts/CreatorEventComp/EventCard';
import {useGetEventsQuery} from '@rtkServices/TicketingService';
import {navigationRef} from '@navigation/utils';
import {Tabs} from 'react-native-collapsible-tab-view';
import {
  DUMMY_UPCOMING_EVENTS,
  filterDummyEvents,
} from '@utils/dummyTicketing';

const FALLBACK_EVENT_IMAGE = require('@assets/images/EventImg.png');

const ComingSoonEvent = ({
  navigation,
  city,
  search,
  date,
  onGetCreatorId,
}: {
  navigation: any;
  city: string;
  search: string;
  date: any;
  onGetCreatorId?: (val: any) => void;
}) => {
  const [debouncedSearch, setDebouncedSearch] = useState(search);

  const {data, isLoading, refetch, isFetching} = useGetEventsQuery({
    page: 1,
    limit: 10,
    timeFilter: 'upcoming',
    search: debouncedSearch,
    city,
    date,
  });
  const apiEvents = data?.data?.events ?? [];
  const events = useMemo(() => {
    if (apiEvents.length > 0) {
      return apiEvents;
    }
    return filterDummyEvents(DUMMY_UPCOMING_EVENTS, {
      search: debouncedSearch,
      city,
      date,
    });
  }, [apiEvents, debouncedSearch, city, date]);

  useEffect(() => {
    const creatorId = events?.[0]?.creatorId?._id || events?.[0]?.creatorId;
    if (creatorId) {
      onGetCreatorId?.(creatorId);
    }
  }, [events]);

  // Debounce effect
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
    }, 300);

    return () => clearTimeout(handler);
  }, [search]);

  const renderEmptyComponent = useMemo(() => {
    if (isLoading) {
      return (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="small" color="#ffffff" />
        </View>
      );
    }

    return <TicketingNoResult />;
  }, [isLoading]);

  const formatDate = useCallback(
    (value?: string) => (value ? dayjs(value).format('DD MMM YYYY') : '--'),
    [],
  );

  const formatTime = useCallback(
    (value?: string) => (value ? dayjs(value).format('hh:mm A') : '--'),
    [],
  );

  return (
    <Tabs.FlatList
      data={events}
      contentContainerStyle={{
        ...(events.length === 0 ? styles.emptyContent : {}),
        paddingBottom: 100,
      }}
      refreshing={isFetching}
      onRefresh={refetch}
      bounces={false}
      ListEmptyComponent={renderEmptyComponent}
      keyExtractor={item => item._id}
      showsVerticalScrollIndicator={false}
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
          event_Status={item.eventStatus ?? 'Scheduled'}
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
  );
};

export default ComingSoonEvent;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loaderContainer: {
    paddingVertical: 40,
  },
  errorContainer: {
    paddingVertical: 40,
    alignItems: 'center',
  },
  errorText: {
    color: '#FF9B9B',
  },
  emptyContent: {
    flexGrow: 1,
    justifyContent: 'center',
  },
});
