import {
  ActivityIndicator,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import LinearGradient from 'react-native-linear-gradient';
import GlowBackground from '@components/AnimationComponent/GlowBackground';
import TicketingHeader from '@components/ScreenLayouts/TicketingComp/TicketingHeader';
import {BookTIcketProps} from '@navigation/screens';
import {fonts} from '@constant/fontfamily';
import {Colors} from '@constant/colors';
import CustomDropDown from '@components/DropDown/CustomDropDown';
import {fontSize} from '@constant/fontSize';
import SeatMapZoom from '@components/SeatMapZoom';
import dayjs from 'dayjs';
import {Slider} from '@miblanchard/react-native-slider';
import {useGetEventDetailQuery} from '@rtkServices/TicketingService';
import TicketCounter from '@components/TicketComponents/TicketCounter';
import FastImage from 'react-native-fast-image';
import {debounce} from '@utils/helper';
import {getCurrencySymbol} from '@utils/general';
import CustomButton from '@components/CustomButtons/CustomButton';
import SeeMore from './SeeMore';
import {getDummyEventDetail, isDummyEventId} from '@utils/dummyTicketing';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

const sliderMin = 0;
const sliderMax = 100;
const FALLBACK_EVENT_IMAGE = require('@assets/images/EventImg.png');

const createNumberTickets = (limit: number) => {
  return Array.from({length: limit || 4}, (_, i) => {
    const number = i + 1;
    return {
      label: `${number} ticket${number > 1 ? 's' : ''}`,
      value: number,
    };
  });
};

const BookTIcket = ({navigation, route}: BookTIcketProps) => {
  const {data} = route?.params || {};
  const ticketsRef = useRef<any[]>([]);
  const [priceRange, setPriceRange] = useState([0, 100]);
  const [numOfTicket, setNumOfTicket] = useState(0);
  const [maxMinPrice, setmaxMinPrice] = useState({max: 0, min: 0});
  const isDummyEvent = isDummyEventId(data?._id);
  const {data: detailData, isLoading} = useGetEventDetailQuery(
    {id: data?._id},
    {skip: !data?._id || isDummyEvent},
  );
  const eventAllData = isDummyEvent
    ? getDummyEventDetail(data)
    : detailData?.data;
  const [numberOfticketData] = useState<any[]>([
    ...createNumberTickets(data?.eventLimitPerUser),
  ]);
  const [tickets, setTickets] = useState<any[]>([]);
  const [openIndex, setOpenIndex] = useState<number>(-1);
  const {bottom} = useSafeAreaInsets();

  const currency = getCurrencySymbol(data?.eventCurrencyType);
  const coverImage = data?.eventCoverImageUrl
    ? {uri: data.eventCoverImageUrl}
    : FALLBACK_EVENT_IMAGE;
  const arenaImageUrl =
    data?.eventArenaImageUrl || eventAllData?.event?.eventArenaImageUrl;
  const startingPrice =
    data?.startingPrice ??
    (maxMinPrice.min > 0 ? maxMinPrice.min : undefined);

  useEffect(() => {
    if (eventAllData?.tickets?.length) {
      ticketsRef.current = JSON.parse(JSON.stringify(eventAllData?.tickets));
      setTickets([...ticketsRef.current]);
      setmaxMinPrice(getMinMax(eventAllData?.tickets));
    }
  }, [eventAllData]);

  const getMinMax = (arr: any[]) => {
    const nums = arr?.map?.(item => item?.originalPrice);
    return {
      min: Math.min(...nums),
      max: Math.max(...nums),
    };
  };

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

  const onSliderChange = (value: any[]) => {
    setPriceRange(value);
    debouncedFilter(value);
  };

  const onChangenumberOfBoooking = (val: number, index: number) => {
    let temp: any[] = [...tickets];
    temp[index].numberOfBoooking = val;
    setTickets(temp);
  };

  const convert = (val: number) => {
    return (
      maxMinPrice.min +
      ((val - sliderMin) / (sliderMax - sliderMin)) *
        (maxMinPrice.max - maxMinPrice.min)
    );
  };

  const totalnumberTicketOfBoooking = useMemo(
    () =>
      tickets?.reduce((sum, item) => sum + (item?.numberOfBoooking || 0), 0),
    [tickets],
  );

  const onContinue = () => {
    navigation.navigate('BookedTicket', {
      eventData: eventAllData,
      bookedTicketData: tickets.filter(item => !!item?.numberOfBoooking),
      numOfTicket,
    });
  };

  const isBtnEnable =
    totalnumberTicketOfBoooking == numOfTicket && numOfTicket > 0;
  return (
    <View style={styles.container}>
      <GlowBackground />
      <View style={[styles.content, {paddingBottom: Math.max(bottom, 16)}]}>
        <TicketingHeader
          onBackPress={() => navigation.goBack()}
          title="Back"
          isLikeVisible={false}
        />
        <View style={styles.body}>
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}>
            <FastImage source={coverImage} style={styles.coverImage} />
            <View style={styles.contentOverlay}>
              <SeeMore text={data?.eventName} textStyle={styles.titleText} />
              <Text style={styles.descriptionText}>
                {dayjs(data?.eventDateTime).format('ddd DD MMM · h:mm A')}
              </Text>
              {!!data?.eventLocation?.address && (
                <Text style={styles.descriptionText}>
                  {data?.eventLocation?.address}
                </Text>
              )}
              {startingPrice != null && (
                <Text style={styles.priceFromText}>
                  {currency}
                  {startingPrice} onwards
                </Text>
              )}
            </View>
            {!!arenaImageUrl && <SeatMapZoom imageUri={arenaImageUrl} />}
            <View style={styles.mainContainer}>
              <CustomDropDown
                placeHolder="Select Ticket "
                data={numberOfticketData}
                onSelect={val => {
                  setNumOfTicket(val.value);
                }}
                commonStyle={styles.dropDown}
              />

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
                renderThumbComponent={() => <View style={styles.sliderThumb} />}
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

              {tickets?.map?.((item, index) => {
                const maxDisabled =
                  item?.numberOfBoooking >= numOfTicket ||
                  totalnumberTicketOfBoooking >= numOfTicket;
                const minDisabled = !item?.numberOfBoooking;

                const availableNumberOfTickets =
                  item?.numberOfTickets - item?.numberOfSoldTickets;
                const rowDisabled =
                  (totalnumberTicketOfBoooking >= numOfTicket &&
                    !item?.numberOfBoooking) ||
                  !availableNumberOfTickets;

                return (
                  <View
                    key={item?._id || item?.ticketName}
                    pointerEvents={rowDisabled ? 'none' : 'auto'}
                    style={{opacity: rowDisabled ? 0.3 : 1}}>
                    <TouchableOpacity
                      activeOpacity={0.8}
                      onPress={() => {
                        if (
                          typeof item?.numberOfBoooking == 'undefined' &&
                          numOfTicket &&
                          totalnumberTicketOfBoooking < numOfTicket
                        ) {
                          onChangenumberOfBoooking(1, index);
                        }
                        setOpenIndex(prev => (prev == index ? -1 : index));
                      }}
                      style={styles.priceDetail}>
                      <View style={styles.ticketNameContainer}>
                        <Image
                          source={require('@assets/images/TicketManage.png')}
                          style={styles.ticketManageImg}
                        />
                        <Text style={styles.ticketNamePrice}>
                          {item?.ticketName}
                        </Text>
                      </View>
                      <Text style={styles.ticketNamePrice}>
                        {currency}
                        {item?.originalPrice}
                      </Text>
                    </TouchableOpacity>
                    {((index === openIndex && !rowDisabled) ||
                      item?.numberOfBoooking > 0) && (
                      <View style={styles.counterContainer}>
                        <TicketCounter
                          maxDisabled={maxDisabled}
                          minDisabled={minDisabled}
                          max={availableNumberOfTickets}
                          onChange={val => onChangenumberOfBoooking(val, index)}
                          value={item?.numberOfBoooking || 0}
                        />
                      </View>
                    )}
                    <LinearGradient
                      start={{x: 0, y: 0}}
                      end={{y: 0, x: 1}}
                      colors={['#FFFFFF00', '#FFFFFF30', '#FFFFFF00']}
                      style={styles.gradientBorder}
                    />
                  </View>
                );
              })}
            </View>
            {isLoading && (
              <View style={styles.loaderContainer}>
                <ActivityIndicator size="small" color="#ffffff" />
              </View>
            )}
          </ScrollView>
          <CustomButton
            text="Continue"
            onPress={onContinue}
            disabled={!isBtnEnable}
            btnStyle={
              !isBtnEnable
                ? {opacity: 0.5}
                : {opacity: 1, backgroundColor: '#ffffff'}
            }
            textStyle={
              !isBtnEnable
                ? {color: 'rgba(255, 255, 255, 0.5)'}
                : {color: Colors.black}
            }
          />
        </View>
      </View>
    </View>
  );
};

export default BookTIcket;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    overflow: 'hidden',
  },
  content: {
    flex: 1,
    zIndex: 2,
  },
  body: {
    flex: 1,
    paddingHorizontal: 16,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 12,
  },
  coverImage: {
    width: '100%',
    height: 200,
    borderRadius: 10,
  },
  contentOverlay: {
    marginTop: 16,
    marginBottom: 8,
  },
  titleText: {
    fontSize: fontSize.f22,
    fontFamily: fonts['Poppins-SemiBold'],
    color: Colors.white,
    lineHeight: 32,
  },
  mainContainer: {
    flex: 1,
  },
  descriptionText: {
    fontSize: fontSize.f12,
    fontFamily: fonts['Poppins-Regular'],
    color: '#FFFFFF99',
    lineHeight: 20,
    marginTop: 4,
  },
  priceFromText: {
    fontSize: fontSize.f14,
    fontFamily: fonts['Poppins-SemiBold'],
    color: Colors.white,
    marginTop: 8,
  },
  dropDown: {
    height: 55,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderWidth: 1,
    borderRadius: 10,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  labelContainer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: -5,
    marginBottom: 24,
  },
  priceLabel: {
    color: Colors.white,
    fontSize: fontSize.f14,
    fontFamily: fonts['Poppins-Regular'],
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
  priceDetail: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
  },
  gradientBorder: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 1,
  },
  ticketNameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    flex: 1,
  },
  ticketManageImg: {
    height: 19,
    width: 19,
    tintColor: '#8800FF',
  },
  ticketNamePrice: {
    color: Colors.white,
    fontSize: fontSize.f18,
    fontFamily: fonts['Poppins-SemiBold'],
  },
  counterContainer: {
    alignItems: 'flex-end',
    marginBottom: 8,
  },
  loaderContainer: {
    ...StyleSheet.absoluteFillObject,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
