import {
  ActivityIndicator,
  Image,
  ImageBackground,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import LinearGradient from 'react-native-linear-gradient';
import AnimationBackground from '@components/AnimationComponent/AnimationBackground';
import TicketingHeader from '@components/ScreenLayouts/TicketingComp/TicketingHeader';
import {BookTIcketProps} from '@navigation/screens';
import {fonts} from '@constant/fontfamily';
import {Colors} from '@constant/colors';
import CustomDropDown from '@components/DropDown/CustomDropDown';
import {fontSize, height, wp} from '@constant/fontSize';
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
const sliderMin = 0;
const sliderMax = 100;

const createNumberTickets = (limit: number) => {
  return Array.from({length: limit}, (_, i) => {
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
  const {data: detailData, isLoading} = useGetEventDetailQuery({id: data?._id});
  const eventAllData = detailData?.data;
  const [numberOfticketData, setnumberOfTicketData] = useState<any[]>([
    ...createNumberTickets(data?.eventLimitPerUser),
  ]);
  const [tickets, setTickets] = useState<any[]>([]);
  const [openIndex, setOpenIndex] = useState<number>(-1);
  // console.log('detailDatadetailData', detailData);
  // console.log('datadatadatadatadata', data);
  //

  const currency = getCurrencySymbol(data?.eventCurrencyType);
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
      <AnimationBackground
        animationSource={require('@assets/animations/AuthAnimation4.json')}
        backgroundColor={'#1a1538'}
        zIndex={0}
      />
      <View style={styles.imageBackground}>
        <FastImage
          source={{uri: data?.eventCoverImageUrl}}
          style={{...StyleSheet.absoluteFillObject, opacity: 0.3}}
        />
        <LinearGradient
          colors={['rgba(38, 0, 65, 0.01)', 'rgba(22, 11, 53,0.8)']}
          style={StyleSheet.absoluteFill}
        />
      </View>
      <View
        style={{
          ...StyleSheet.absoluteFillObject,
          opacity: Platform.OS == 'ios' ? 0.7 : 0.5,
        }}>
        <AnimationBackground
          animationSource={require('@assets/animations/AuthAnimation4.json')}
          backgroundColor={'#1a1538'}
          zIndex={0}
        />
      </View>
      <View style={{flex: 1, paddingBottom: 24}}>
        <TicketingHeader
          onBackPress={() => navigation.goBack()}
          onLikePress={() => {}}
          title="Back"
          likeCount={223}
        />
        <View style={{flex: 1, paddingHorizontal: 15}}>
          <View style={{flex: 1}}>
            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{flexGrow: 1}}>
              <View style={{flex: 1}}>
                <View style={styles.contentOverlay}>
                  <SeeMore
                    text={data?.eventName}
                    textStyle={styles.titleText}
                  />
                  {/* <Text style={styles.titleText}>{data?.eventName}</Text> */}
                  <Text style={styles.descriptionText}>
                    {dayjs(data?.eventDateTime).format('ddd DD MMM · h:mm A')}
                  </Text>
                  <Text style={styles.descriptionText}>
                    {data?.eventLocation?.address}
                  </Text>
                </View>
                <View style={{flex: 1}}>
                  <SeatMapZoom imageUri={data?.eventArenaImageUrl} />
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
                          key={item?.ticketName}
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
                              setOpenIndex(prev =>
                                prev == index ? -1 : index,
                              );
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
                                onChange={val =>
                                  onChangenumberOfBoooking(val, index)
                                }
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
                </View>
              </View>
            </ScrollView>
          </View>
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
  },
  imageBackground: {
    width: '100%',
    height: height / 3,
    ...StyleSheet.absoluteFillObject,
    // resizeMode: 'cover',
  },
  contentOverlay: {
    // paddingHorizontal: 15,
  },
  contentContainer: {},
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
  imageContainer: {
    width: '100%',
    height: 220,
    overflow: 'hidden',
    resizeMode: 'cover',
    alignItems: 'center',
  },
  image: {
    width: '95%',
    height: '95%',
    borderRadius: 10,
  },
  mainContainer: {
    flex: 1,
    // paddingHorizontal: 15,
  },
  descriptionText: {
    fontSize: fontSize.f12,
    fontFamily: fonts['Poppins-Regular'],
    color: '#FFFFFF60',
    lineHeight: 20,
    marginTop: 4,
  },
  dropDown: {
    // width: '70%',
    height: 55,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 10,
    backgroundColor: 'rgba(rgba(0, 0, 0, 0.3))',
    borderWidth: 1,
    borderRadius: 10,
    borderColor: 'rgba(rgba(0, 0, 0, 0.1))',
  },
  sliderWrapper: {
    width: '100%',
    marginTop: 20,
    alignItems: 'center',
  },

  slider: {
    width: '100%',
    justifyContent: 'center',
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

  bubbleContainer: {
    position: 'absolute',
    top: -18,
    alignItems: 'center',
  },

  bubble: {
    backgroundColor: '#434957',
    paddingHorizontal: 15,
    paddingVertical: 6,
    borderRadius: 8,
  },

  bubbleText: {
    color: Colors.white,
    fontSize: fontSize.f14,
    fontFamily: fonts['Poppins-Medium'],
  },

  bubblePointer: {
    width: 0,
    height: 0,
    borderLeftWidth: 7,
    borderRightWidth: 7,
    borderTopWidth: 8,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderTopColor: '#434957',
    alignSelf: 'center',
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
