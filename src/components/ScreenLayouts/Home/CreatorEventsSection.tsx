import {Pressable, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {HomeChevronIcon} from '@assets/svg/HomeScreenIcon';
import {navigate} from '@navigation/utils';
import {useGetComingSoonEventsQuery} from '@rtkServices/CreatorTicketingService';
import {RootState, useAppSelector} from '@store/index';
import {Colors} from '@constant/colors';
import {fontSize} from '@constant/fontSize';
import {fonts} from '@constant/fontfamily';
import {DUMMY_UPCOMING_EVENTS, isDummyEventId} from '@utils/dummyTicketing';

export default function CreatorEventsSection() {
  const {user} = useAppSelector((state: RootState) => state.user);
  const {data} = useGetComingSoonEventsQuery({
    page: 1,
    limit: 10,
    creatorId: user?._id || '',
  });
  const apiEvents = data?.data?.events || [];
  const events =
    apiEvents.length > 0 ? apiEvents : DUMMY_UPCOMING_EVENTS.slice(0, 3);

  const openEvent = (eventId: string) => {
    if (isDummyEventId(eventId)) {
      navigate('CreatorTicketing', {});
      return;
    }
    navigate('CreatorEventDetailScreen', {eventId});
  };

  return (
    <View style={styles.container}>
      <Pressable
        onPress={() => navigate('CreatorTicketing', {})}
        style={styles.header}>
        <Text style={styles.title}>Upcoming events</Text>
        <HomeChevronIcon strokeOpacity={0.7} />
      </Pressable>
      <Text style={styles.subtitle}>Latest</Text>
      <View style={styles.list}>
        {events.slice(0, 3).map(event => (
          <Pressable
            key={event._id}
            onPress={() => openEvent(event._id)}
            style={styles.row}>
            <Text numberOfLines={1} style={styles.rowTitle}>
              {event.eventName}
            </Text>
            <HomeChevronIcon strokeOpacity={0.5} />
          </Pressable>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 24,
    paddingHorizontal: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    minHeight: 20,
  },
  title: {
    fontSize: fontSize.f16,
    fontFamily: fonts['Poppins-SemiBold'],
    color: Colors.white,
  },
  subtitle: {
    marginTop: 20,
    fontSize: fontSize.f12,
    fontFamily: fonts['Poppins-Regular'],
    color: Colors.white,
    opacity: 0.5,
  },
  list: {
    marginTop: 22,
    gap: 44,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 20,
    gap: 12,
  },
  rowTitle: {
    flex: 1,
    fontSize: fontSize.f14,
    fontFamily: fonts['Poppins-Medium'],
    color: Colors.white,
    opacity: 0.9,
  },
});
