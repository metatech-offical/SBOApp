import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {CreatorTicketingScreenProps} from '@navigation/screens';
import AnimationBackground from '@components/AnimationComponent/AnimationBackground';
import TicketingHeader from '@components/ScreenLayouts/TicketingComp/TicketingHeader';
import {fonts} from '@constant/fontfamily';
import {Colors} from '@constant/colors';
import {CalendarIcon} from '@assets/svg/HomeScreenIcon';
import {OptionIcon} from '@assets/svg/ShortsIcon';
import {UserTicketData} from '@utils/data';
import NodataFound from '@components/DataEmpty/NodataFound';
import TicketCard from '@components/ScreenLayouts/UserTicketing/TicketCard';
import TextInputWithLabels from '@components/CustomInputs/TextInputWithLabels';
import {LocationIcon} from '@assets/svg/TicktingIcons';
import CustomCalander from '@components/ScreenLayouts/TicketingComp/CustomCalander';
import FastImage from 'react-native-fast-image';
import {fontSize} from '@constant/fontSize';
import EventCard from '@components/ScreenLayouts/CreatorEventComp/EventCard';
import {navigationRef} from '@navigation/utils';
import {formatDate, formatTime} from '@utils/general';
import DateTimePickerInput from '@components/DateTimePicker/DateTimePickerInput';
import dayjs from 'dayjs';
import {useGetEventsOfCreatorQuery} from '@rtkServices/TicketingService';
const FALLBACK_EVENT_IMAGE = require('@assets/images/EventImg.png');
const CreatorTicketingScreen = ({
  navigation,
  route,
}: CreatorTicketingScreenProps) => {
  const {creatorId} = route.params || {};

  const [selectedView, setSelectedView] = useState<'calendar' | 'list'>('list');
  const [city, setCity] = useState('');
  const [date, setDate] = useState<any>(null);
  const [debouncedSearch, setDebouncedSearch] = useState(city);
  const {data, isLoading, error, refetch, isFetching} =
    useGetEventsOfCreatorQuery({
      creatorid: creatorId,
      page: 1,
      limit: 10,
      city: debouncedSearch,
      date,
    });
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(city);
    }, 300);

    return () => clearTimeout(handler);
  }, [city]);
  const eventsData = data?.data?.events;
  const formatDate = useCallback(
    (value?: string) => (value ? dayjs(value).format('DD MMM YYYY') : '--'),
    [],
  );

  const formatTime = useCallback(
    (value?: string) => (value ? dayjs(value).format('hh:mm A') : '--'),
    [],
  );

  const renderEmptyComponent = useMemo(() => {
    if (isLoading) {
      return (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="small" color="#ffffff" />
        </View>
      );
    }

    if (error) {
      return (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>
            {'data' in error && error.data?.message
              ? error.data.message
              : 'Unable to fetch events right now.'}
          </Text>
        </View>
      );
    }

    return <NodataFound />;
  }, [error, isLoading]);
  return (
    <View style={styles.container}>
      <AnimationBackground
        animationSource={require('@assets/animations/AuthAnimation4.json')}
        backgroundColor={'#1a1538'}
        zIndex={0}
      />
      <FastImage
        source={require('@assets/images/WimHoff.png')}
        style={styles.imageBackground}
      />
      <TicketingHeader
        onBackPress={() => navigation.goBack()}
        onLikePress={() => {}}
        likeCount={223}
      />
      <View style={styles.contentOverlay}>
        <View>
          <View style={styles.ratingContainer}>
            <Text style={styles.ratingText}>4.5</Text>
            <Text style={styles.categoryText}>Personal development</Text>
          </View>
          <Text style={styles.titleText}>The Wim Hof show</Text>
        </View>
        {/* <View style={styles.ToggleContainer}>
            <TouchableOpacity
              style={[
                styles.toggleSegment,
                styles.leftSegment,
                selectedView === 'list' && styles.activeSegment,
              ]}
              onPress={() => setSelectedView('list')}>
              <OptionIcon
                width={20}
                height={20}
                stroke={selectedView === 'list' ? '#1a1538' : Colors.white}
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.toggleSegment,
                styles.rightSegment,
                selectedView === 'calendar' && styles.activeSegment,
              ]}
              onPress={() => setSelectedView('calendar')}>
              <CalendarIcon
                width={20}
                height={20}
                stroke={selectedView === 'calendar' ? '#1a1538' : Colors.white}
              />
            </TouchableOpacity>
          </View> */}
      </View>
      <View style={styles.mainContainer}>
        {selectedView === 'list' && (
          <>
            <View style={styles.TopContainer}>
              <TextInputWithLabels
                placeholder="City / Zipcode"
                value={city}
                onChangeText={val => {
                  setCity(val.trimStart());
                }}
                mainContainerProps={styles.inputStyle}
                icon={<LocationIcon />}
                btnStyle={{height: 45}}
              />
              <DateTimePickerInput
                containerStyle={{width: '50%', marginBottom: 0}}
                onChange={setDate}
                inputContainerStyle={{height: 45}}
                customBtn={
                  <View style={styles.calenderbtn}>
                    <CalendarIcon />
                    <Text
                      style={{
                        ...styles.placeholder,
                        color: date ? '#FFFFFF' : '#FFFFFF20',
                      }}>
                      {date ? `${dayjs(date).format('DD MMM YYYY')}` : 'When'}
                    </Text>
                  </View>
                }
              />
            </View>
            <FlatList
              data={eventsData}
              ListEmptyComponent={renderEmptyComponent}
              showsVerticalScrollIndicator={false}
              refreshing={isFetching}
              onRefresh={refetch}
              keyExtractor={item => item.id}
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
          </>
        )}
        {selectedView === 'calendar' && <CustomCalander />}
      </View>
    </View>
  );
};

export default CreatorTicketingScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  imageBackground: {
    width: '100%',
    height: 320,
    resizeMode: 'cover',
    opacity: 0.2,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
  },
  contentOverlay: {
    paddingHorizontal: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    paddingBottom: 20,
    marginTop: 138,
  },

  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  ratingText: {
    fontSize: fontSize.f12,
    fontFamily: fonts['Poppins-Regular'],
    color: 'rgba(255, 255, 255, 0.7)',
    marginRight: 4,
  },
  categoryText: {
    fontSize: fontSize.f12,
    fontFamily: fonts['Poppins-Regular'],
    color: 'rgba(255, 255, 255, 0.7)',
    marginLeft: 8,
  },
  titleText: {
    fontSize: fontSize.f22,
    fontFamily: fonts['Poppins-Medium'],
    color: Colors.white,
    lineHeight: 32,
  },
  mainContainer: {
    flex: 1,
  },
  ForRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
    paddingHorizontal: 15,
  },
  ConcertsText: {
    fontSize: fontSize.f12,
    fontFamily: fonts['Poppins-SemiBold'],
    color: Colors.white,
    textDecorationLine: 'underline',
  },
  ToggleContainer: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 20,
    width: 70,
    height: 30,
  },
  toggleSegment: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 18,
  },
  leftSegment: {
    borderTopRightRadius: 0,
    borderBottomRightRadius: 0,
  },
  rightSegment: {
    borderTopLeftRadius: 0,
    borderBottomLeftRadius: 0,
  },
  activeSegment: {
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
  },
  TopContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    columnGap: 10,
    paddingHorizontal: 15,
  },
  inputStyle: {
    width: '48%',
    height: 45,
  },
  calenderbtn: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  placeholder: {
    fontSize: fontSize.f14,
    fontFamily: fonts['Poppins-Medium'],
    color: '#FFFFFF20',
    marginLeft: 6,
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
