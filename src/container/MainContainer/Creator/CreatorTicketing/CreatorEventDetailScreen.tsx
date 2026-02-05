import React, {useState, useMemo} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Image,
} from 'react-native';
import {CreatorEventDetailScreenProps} from '@navigation/screens';
import FastImage from 'react-native-fast-image';
import {fonts} from '@constant/fontfamily';
import {fontSize} from '@constant/fontSize';
import {Colors} from '@constant/colors';
import CustomButton from '@components/CustomButtons/CustomButton';
import {useGetEventDetailByIdQuery} from '@rtkServices/CreatorTicketingService';
import AnimationBackground from '@components/AnimationComponent/AnimationBackground';
import StackHeader from '@components/CustomHeaders/StackHeader';
import Loader from '@components/CustomLoader/Loader';
import {eventFormatDate, eventFormatTime} from '@utils/general';
import dayjs from 'dayjs';

const CreatorEventDetailScreen = ({
  navigation,
  route,
}: CreatorEventDetailScreenProps) => {
  const {eventId} = route.params || {};
  const [showFullDescription, setShowFullDescription] = useState(false);

  // Fetch event details using RTK Query
  const {
    data: eventData,
    isLoading,
    isError,
  } = useGetEventDetailByIdQuery({
    eventId,
  });

  const event = eventData?.data.event || {};

  // Determine event status based on date
  const eventStatus = useMemo(() => {
    if (!event?.eventDateTime) return 'Coming';

    const now = dayjs();
    const eventDate = dayjs(event.eventDateTime);
    const publishDate = dayjs(event.eventPublishOnDate);

    // Check if event has passed
    if (eventDate.isBefore(now)) {
      return 'Ended';
    }

    // Check if sale is live (publish date has passed but event hasn't)
    if (publishDate.isBefore(now) && eventDate.isAfter(now)) {
      return 'Live';
    }

    // Otherwise, it's coming soon
    return 'Coming';
  }, [event?.eventDateTime, event?.eventPublishOnDate]);

  const isPastEvent = eventStatus === 'Ended';

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <AnimationBackground
          animationSource={require('@assets/animations/AuthAnimation4.json')}
          backgroundColor={'#1a1538'}
          zIndex={0}
        />
        <ActivityIndicator size="large" color={Colors.primaryColor} />
      </View>
    );
  }

  if (isError || !event) {
    return (
      <View style={styles.loadingContainer}>
        <AnimationBackground
          animationSource={require('@assets/animations/AuthAnimation4.json')}
          backgroundColor={'#1a1538'}
          zIndex={0}
        />
        <Text style={styles.errorText}>Failed to load event details</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <AnimationBackground
        animationSource={require('@assets/animations/AuthAnimation4.json')}
        backgroundColor={'#1a1538'}
        zIndex={0}
      />
      <View style={styles.contentOverlay}>
        <StackHeader title={''} onBackPress={() => navigation.goBack()} />
        {isLoading ? (
          <Loader visible={isLoading} />
        ) : (
          <>
            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.scrollViewContent}>
              <View style={styles.allContainerData}>
                {/* Event Banner */}
                <View style={styles.bannerContainer}>
                  <FastImage
                    source={{
                      uri:
                        event?.eventCoverImageUrl ||
                        'https://via.placeholder.com/400x300',
                    }}
                    style={styles.bannerImage}
                    resizeMode={FastImage.resizeMode.cover}
                  />
                </View>

                <View style={styles.contentContainer}>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}>
                    <View style={styles.titleSection}>
                      <Text style={styles.eventTitle}>{event?.eventName}</Text>
                      <Text style={styles.categoryText}>
                        {event?.eventCategory}
                      </Text>
                    </View>

                    <View style={styles.statusAndTicketsContainer}>
                      <View
                        style={[
                          styles.statusBadge,
                          eventStatus === 'Live' && styles.statusBadgeLive,
                          eventStatus === 'Coming' && styles.statusBadgeComing,
                          eventStatus === 'Ended' && styles.statusBadgeEnded,
                        ]}>
                        <Text
                          style={[
                            styles.statusText,
                            eventStatus === 'Live' && styles.statusTextLive,
                            eventStatus === 'Coming' && styles.statusTextComing,
                            eventStatus === 'Ended' && styles.statusTextEnded,
                          ]}>
                          Sale {eventStatus}
                        </Text>
                      </View>
                      <Text style={styles.ticketsSoldText}>
                        {event?.ticketsSold || 0} tickets
                      </Text>
                    </View>
                  </View>

                  {/* Date and Time */}
                  <View style={styles.infoContainer}>
                    <View style={styles.infoSection}>
                      <View style={styles.infoLeft}>
                        <Text style={styles.infoLabel}>Date and Time</Text>
                        <Text style={styles.infoValue}>
                          {eventFormatDate(event?.eventDateTime)} |{' '}
                          {eventFormatTime(event?.eventDateTime)}
                        </Text>
                      </View>
                      <Image
                        source={require('@assets/images/calendarImage.png')}
                        style={styles.locationIcon}
                        resizeMode={FastImage.resizeMode.contain}
                      />
                    </View>

                    <View style={styles.dashedSeparator} />

                    {/* Location */}
                    <View style={styles.infoSection}>
                      <View style={styles.infoLeft}>
                        <Text style={styles.infoLabel}>Location</Text>
                        <Text style={styles.infoValue}>
                          {event?.eventLocation?.address ||
                            'No location specified'}
                        </Text>
                      </View>
                      <Image
                        source={require('@assets/images/locationIcon.png')}
                        style={styles.locationIcon}
                        resizeMode={FastImage.resizeMode.contain}
                      />
                    </View>
                  </View>

                  {/* Event Details */}
                  <View style={styles.expandableSection}>
                    <View style={styles.expandableHeader}>
                      <Image
                        source={require('@assets/images/noteBook.png')}
                        style={styles.noteBookIcon}
                        resizeMode={FastImage.resizeMode.contain}
                      />
                      <Text style={styles.expandableTitle}>Event Details</Text>
                    </View>
                    <View style={styles.expandableContent}>
                      <Text
                        style={styles.descriptionText}
                        numberOfLines={showFullDescription ? undefined : 3}>
                        {event?.eventDescription || ''}
                      </Text>
                      {(event?.eventDescription?.length > 150 ||
                        !event?.eventDescription) && (
                        <TouchableOpacity
                          onPress={() =>
                            setShowFullDescription(!showFullDescription)
                          }>
                          <Text style={styles.readMoreText}>
                            {showFullDescription ? 'Show Less' : 'Read More'}
                          </Text>
                        </TouchableOpacity>
                      )}
                    </View>
                  </View>
                </View>
              </View>
            </ScrollView>

            {/* Bottom Buttons - Hide edit button for past events */}
            {!isPastEvent && (
              <View style={styles.bottomButtonsContainer}>
                <CustomButton
                  text="Edit event info"
                  onPress={() => {
                    navigation.navigate('EditEvent', {eventId});
                  }}
                  btnStyle={styles.editButton}
                  textStyle={styles.editButtonText}
                />
                <CustomButton
                  text="View ticket details"
                  onPress={() => {
                    navigation.navigate('CreatorTicketDetailScreen', {eventId});
                  }}
                  btnStyle={styles.viewButton}
                  textStyle={styles.viewButtonText}
                />
              </View>
            )}
          </>
        )}
      </View>
    </View>
  );
};

export default CreatorEventDetailScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1538',
  },
  contentOverlay: {
    zIndex: 2,
    position: 'relative',
    flex: 1,
  },
  allContainerData: {
    paddingHorizontal: 15,
  },
  scrollViewContent: {
    paddingBottom: 100,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1a1538',
  },
  errorText: {
    fontSize: fontSize.f16,
    fontFamily: fonts['Poppins-Regular'],
    color: Colors.white,
  },
  bannerContainer: {
    width: '100%',
    height: 230,
    position: 'relative',
  },
  bannerImage: {
    width: '100%',
    height: '100%',
    borderRadius: 12,
  },
  contentContainer: {
    marginTop: 10,
  },
  titleSection: {
    marginBottom: 16,
    flex: 1,
    paddingRight: 12,
  },
  eventTitle: {
    fontSize: fontSize.f16,
    fontFamily: fonts['Poppins-SemiBold'],
    color: Colors.white,
    marginBottom: 4,
  },
  categoryText: {
    fontSize: fontSize.f14,
    fontFamily: fonts['Poppins-Medium'],
    color: 'rgba(255, 255, 255, 0.7)',
  },
  statusAndTicketsContainer: {
    alignItems: 'flex-end',
    gap: 8,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 15,
  },
  statusBadgeLive: {
    backgroundColor: 'rgba(0, 255, 81, 0.16)',
  },
  statusBadgeComing: {
    backgroundColor: 'rgba(255, 165, 0, 0.16)',
  },
  statusBadgeEnded: {
    backgroundColor: 'rgba(255, 255, 255, 0.16)',
  },
  statusText: {
    fontSize: fontSize.f12,
    fontFamily: fonts['Poppins-SemiBold'],
  },
  statusTextLive: {
    color: 'rgba(73, 255, 130, 1)',
  },
  statusTextComing: {
    color: 'rgba(255, 165, 0, 1)',
  },
  statusTextEnded: {
    color: 'rgba(207, 207, 207, 1)',
  },
  ticketsSoldText: {
    fontSize: fontSize.f14,
    fontFamily: fonts['Poppins-SemiBold'],
    color: Colors.white,
  },
  infoContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  infoSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  infoLeft: {
    flex: 1,
    paddingRight: 12,
  },
  dashedSeparator: {
    height: 1,
    borderStyle: 'dashed',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    marginVertical: 4,
  },
  infoLabel: {
    fontSize: fontSize.f14,
    fontFamily: fonts['Poppins-Medium'],
    color: 'rgba(255, 255, 255, 0.6)',
    marginBottom: 6,
  },
  infoValue: {
    fontSize: fontSize.f14,
    fontFamily: fonts['Poppins-Medium'],
    color: Colors.white,
    lineHeight: 24,
  },
  expandableSection: {
    marginBottom: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    padding: 20,
  },
  expandableHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 12,
  },
  expandableTitle: {
    fontSize: fontSize.f16,
    fontFamily: fonts['Poppins-SemiBold'],
    color: Colors.white,
  },
  expandableContent: {
    paddingLeft: 0,
  },
  descriptionText: {
    fontSize: fontSize.f14,
    fontFamily: fonts['Poppins-Regular'],
    color: Colors.white,
    lineHeight: 24,
    opacity: 0.7,
  },
  readMoreText: {
    fontSize: fontSize.f14,
    fontFamily: fonts['Poppins-Medium'],
    color: Colors.white,
    marginTop: 12,
    textDecorationLine: 'underline',
  },
  noteBookIcon: {
    width: 23,
    height: 23,
    tintColor: Colors.white,
  },
  bottomButtonsContainer: {
    position: 'absolute',
    bottom: 10,
    left: 0,
    right: 0,
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 16,
    gap: 12,
  },
  editButton: {
    flex: 1,
    backgroundColor: Colors.white,
    marginBottom: 0,
    marginTop: 0,
    height: 48,
  },
  editButtonText: {
    fontSize: fontSize.f14,
    fontFamily: fonts['Poppins-SemiBold'],
    color: Colors.black,
  },
  viewButton: {
    flex: 1,
    marginBottom: 0,
    marginTop: 0,
    height: 48,
  },
  viewButtonText: {
    fontSize: fontSize.f14,
    fontFamily: fonts['Poppins-SemiBold'],
    color: Colors.white,
  },
  locationIcon: {
    width: 23,
    height: 23,
    tintColor: Colors.white,
  },
});
