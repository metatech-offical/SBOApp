import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
} from 'react-native';
import React, {useCallback, useEffect, useRef, useState} from 'react';
import {CreatorTicketDetailScreenProps} from '@navigation/screens';
import AnimationBackground from '@components/AnimationComponent/AnimationBackground';
import {useGetEventDetailByIdQuery} from '@rtkServices/CreatorTicketingService';
import Loader from '@components/CustomLoader/Loader';
import {fonts} from '@constant/fontfamily';
import {fontSize, height} from '@constant/fontSize';
import {Colors} from '@constant/colors';
import FastImage from 'react-native-fast-image';
import LinearGradient from 'react-native-linear-gradient';
import dayjs from 'dayjs';
import {BackArrow} from '@assets/svg/AuthFlowIcons';
import SeatMapZoom from '@components/SeatMapZoom';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {Slider} from '@miblanchard/react-native-slider';
import {debounce} from '@utils/helper';
import {getCurrencySymbol} from '@utils/general';

const sliderMin = 0;
const sliderMax = 100;

const CreatorTicketDetailScreen = ({
  navigation,
  route,
}: CreatorTicketDetailScreenProps) => {
  const {eventId} = route.params || {};
  const {data: eventData, isLoading} = useGetEventDetailByIdQuery({eventId});
  const eventDetail = eventData?.data?.event || {};
  const ticketsData = eventData?.data?.tickets || [];
  const ticketsRef = useRef<any[]>([]);
  const [priceRange, setPriceRange] = useState([0, 100]);
  const [maxMinPrice, setMaxMinPrice] = useState({max: 0, min: 0});
  const [tickets, setTickets] = useState<any[]>([]);

  const {top} = useSafeAreaInsets();
  const currency = getCurrencySymbol(eventDetail?.eventCurrencyType);

  // Get min and max prices
  const getMinMax = (arr: any[]) => {
    if (!arr || arr.length === 0) return {min: 0, max: 0};
    const nums = arr.map(item => item?.originalPrice);
    return {
      min: Math.min(...nums),
      max: Math.max(...nums),
    };
  };

  // Convert slider value to actual price
  const convert = (val: number) => {
    return (
      maxMinPrice.min +
      ((val - sliderMin) / (sliderMax - sliderMin)) *
        (maxMinPrice.max - maxMinPrice.min)
    );
  };

  // Debounced filter function
  const debouncedFilter = useCallback(
    debounce((value: any[]) => {
      const temp = [...ticketsRef.current];
      setTickets(
        temp.filter(
          item =>
            item?.originalPrice >= convert(value?.[0]) &&
            item?.originalPrice <= convert(value?.[1]),
        ),
      );
    }, 200),
    [maxMinPrice],
  );

  // Handle slider change
  const onSliderChange = (value: any[]) => {
    setPriceRange(value);
    debouncedFilter(value);
  };

  // Initialize tickets when data loads
  useEffect(() => {
    if (ticketsData?.length) {
      ticketsRef.current = JSON.parse(JSON.stringify(ticketsData));
      const sortedData = [...ticketsRef.current].sort(
        (a, b) => a.originalPrice - b.originalPrice,
      );
      setTickets(sortedData);
      setMaxMinPrice(getMinMax(ticketsData));
    }
  }, [ticketsData]);

  return (
    <View style={styles.container}>
      <AnimationBackground
        animationSource={require('@assets/animations/AuthAnimation4.json')}
        backgroundColor={'#1a1538'}
        zIndex={0}
      />
      {isLoading ? (
        <Loader visible={isLoading} />
      ) : (
        <View style={{flex: 1}}>
          <View
            style={{
              position: 'absolute',
              height: height / 2.5,
              top: 0,
              left: 0,
              right: 0,
            }}>
            {eventDetail?.eventCoverImageUrl && (
              <FastImage
                source={{uri: eventDetail.eventCoverImageUrl}}
                style={[styles.coverImage, {opacity: 0.2}]}
                resizeMode={FastImage.resizeMode.cover}
              />
            )}
            <LinearGradient
              colors={['rgba(38, 0, 65, 0.1)', 'rgb(50, 41, 41)']}
              start={{x: 0, y: 0}}
              end={{x: 1, y: 1}}
              style={StyleSheet.absoluteFill}
            />
          </View>
          {/* Back Button */}
          <TouchableOpacity
            style={[styles.backButton, {marginTop: top}]}
            onPress={() => navigation.goBack()}>
            <BackArrow color={Colors.white} width={20} height={20} />
            <Text style={styles.backText}>Back</Text>
          </TouchableOpacity>
          <View style={{flex: 1}}>
            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.scrollContent}>
              <View style={styles.headerImageContainer}>
                {/* Event Info Overlay */}
                <View style={styles.eventInfoOverlay}>
                  <Text style={styles.titleText}>{eventDetail?.eventName}</Text>
                  <Text style={styles.dateText}>
                    {dayjs(eventDetail?.eventDateTime).format(
                      'ddd DD MMM · h:mm A',
                    )}
                  </Text>
                  <Text style={styles.locationText}>
                    {eventDetail?.eventLocation?.address}
                  </Text>
                </View>
              </View>

              <SeatMapZoom imageUri={eventDetail?.eventArenaImageUrl || ''} />

              {/* Price Range Slider */}
              <View style={styles.sliderContainer}>
                <Slider
                  value={priceRange}
                  onValueChange={onSliderChange}
                  minimumValue={0}
                  maximumValue={100}
                  minimumTrackTintColor="#B687D9"
                  maximumTrackTintColor="#E6E7E8"
                  renderBelowThumbComponent={(index, value) =>
                    (
                      index == 0
                        ? maxMinPrice.min != convert(value)
                        : maxMinPrice.max != convert(value)
                    ) ? (
                      <View style={styles.valueContainer}>
                        <Text style={styles.valueText}>
                          {Math.round(convert(value))}
                        </Text>
                      </View>
                    ) : (
                      <></>
                    )
                  }
                  renderThumbComponent={() => (
                    <View style={styles.sliderThumb} />
                  )}
                />
                <View style={styles.labelContainer}>
                  <Text style={styles.priceLabel}>
                    {currency}
                    {maxMinPrice.min}
                  </Text>
                  <Text style={styles.priceLabel}>
                    {currency}
                    {maxMinPrice.max}
                  </Text>
                </View>
              </View>

              {/* Tickets List Section */}
              <View style={styles.ticketsSection}>
                {tickets.map((ticket, index) => (
                  <View key={ticket._id} style={styles.ticketItem}>
                    <View style={styles.ticketInfo}>
                      <Image
                        source={require('@assets/images/TicketManage.png')}
                        style={styles.ticketManageImg}
                      />
                      <View style={styles.ticketDetails}>
                        <Text style={styles.ticketName}>
                          {ticket.ticketName}
                        </Text>
                      </View>
                    </View>
                    <Text style={styles.ticketPrice}>
                      {eventDetail?.eventCurrencyType === 'USD' ? '$' : '₹'}
                      {ticket.originalPrice.toFixed(2)}
                    </Text>
                  </View>
                ))}
              </View>
            </ScrollView>
          </View>
        </View>
      )}
    </View>
  );
};

export default CreatorTicketDetailScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1538',
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 30,
    paddingHorizontal: 4,
  },
  headerImageContainer: {
    width: '100%',
    marginTop: 20,
  },
  coverImage: {
    width: '100%',
    height: '100%',
  },
  backButton: {
    left: 15,
    flexDirection: 'row',
    alignItems: 'center',
    zIndex: 2,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 20,
  },
  backText: {
    fontSize: fontSize.f14,
    fontFamily: fonts['Poppins-Regular'],
    color: Colors.white,
  },
  eventInfoOverlay: {
    paddingHorizontal: 15,
    paddingBottom: 20,
    marginTop: 20,
  },
  titleText: {
    fontSize: fontSize.f24,
    fontFamily: fonts['Poppins-SemiBold'],
    color: Colors.white,
    lineHeight: 32,
    marginBottom: 10,
  },
  dateText: {
    fontSize: fontSize.f14,
    fontFamily: fonts['Poppins-Regular'],
    color: '#FFFFFF90',
    lineHeight: 20,
    marginBottom: 10,
  },
  locationText: {
    fontSize: fontSize.f12,
    fontFamily: fonts['Poppins-Regular'],
    color: '#FFFFFF90',
    lineHeight: 18,
  },
  arenaImage: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
  },
  sliderContainer: {
    paddingHorizontal: 15,
  },
  sliderThumb: {
    height: 16,
    width: 16,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#919191',
    backgroundColor: '#FFF',
  },
  valueContainer: {
    backgroundColor: '#485067',
    paddingHorizontal: 8,
    borderRadius: 4,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: -12,
  },
  valueText: {
    color: Colors.white,
    fontSize: fontSize.f12,
    fontFamily: fonts['Poppins-Medium'],
  },
  labelContainer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: -5,
    marginBottom: 10,
  },
  priceLabel: {
    color: Colors.white,
    fontSize: fontSize.f14,
    fontFamily: fonts['Poppins-Regular'],
  },
  ticketsSection: {
    paddingHorizontal: 15,
    marginTop: 15,
  },
  ticketItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    marginBottom: 12,
  },
  ticketInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 12,
  },
  ticketDetails: {
    flex: 1,
  },
  ticketName: {
    fontSize: fontSize.f16,
    fontFamily: fonts['Poppins-SemiBold'],
    color: Colors.white,
    lineHeight: 22,
  },
  ticketPrice: {
    fontSize: fontSize.f18,
    fontFamily: fonts['Poppins-SemiBold'],
    color: Colors.white,
  },
  ticketManageImg: {
    height: 21,
    width: 21,
    tintColor: '#8800FF',
  },
});
