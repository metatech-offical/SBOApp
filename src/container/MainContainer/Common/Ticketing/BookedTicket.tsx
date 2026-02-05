import {
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
import {fontSize, height, wp} from '@constant/fontSize';
import dayjs from 'dayjs';
import TicketCounter from '@components/TicketComponents/TicketCounter';
import FastImage from 'react-native-fast-image';
import {getCurrencySymbol} from '@utils/general';
import CustomButton from '@components/CustomButtons/CustomButton';
import SubtotalCard from '@components/TicketComponents/SubTotalCard';
import SeeMore from './SeeMore';
import {BlurView} from '@react-native-community/blur';

const BookedTicket = ({navigation, route}: BookTIcketProps) => {
  const {
    eventData: eventAllData,
    bookedTicketData,
    numOfTicket,
  } = route?.params || {};
  const [tickets, setTickets] = useState<any[]>(bookedTicketData);
  const data = eventAllData?.event;
  const currency = getCurrencySymbol(data?.eventCurrencyType);

  const onChangenumberOfBoooking = (val: number, index: number) => {
    let temp: any[] = [...tickets];
    temp[index].numberOfBoooking = val;
    setTickets(temp);
  };

  const totalnumberTicketOfBoooking = useMemo(
    () =>
      tickets?.reduce((sum, item) => sum + (item?.numberOfBoooking || 0), 0),
    [tickets],
  );

  const totalPrice = useMemo(
    () =>
      tickets?.reduce(
        (sum, item) =>
          sum + (item?.numberOfBoooking || 0) * item?.originalPrice,
        0,
      ),
    [tickets],
  );

  const onNext = () => {
    navigation.navigate('Checkout', {
      eventData: eventAllData,
      bookedTicketData: tickets.filter(item => !!item?.numberOfBoooking),
    });
  };

  const isBtnEnable =
    totalnumberTicketOfBoooking >= numOfTicket && numOfTicket > 0;
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
          style={{...StyleSheet.absoluteFillObject, opacity: 0.25}}
        />
        <LinearGradient
          colors={['rgba(38, 0, 65, 0.01)', 'rgba(22, 11, 53,0.8)']}
          style={StyleSheet.absoluteFill}
        />
      </View>
      <View
        style={{
          ...StyleSheet.absoluteFillObject,
          opacity: Platform.OS == 'ios' ? 0.8 : 0.5,
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
          isLikeVisible={false}
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
                <View style={styles.mainContainer}>
                  {tickets?.map?.((item, index) => {
                    const maxDisabled =
                      item?.numberOfBoooking >= numOfTicket ||
                      totalnumberTicketOfBoooking >= numOfTicket;
                    const minDisabled = !item?.numberOfBoooking;
                    return (
                      <View key={item?.ticketName} style={styles.ticketCard}>
                        <BlurView
                          style={{
                            ...StyleSheet.absoluteFillObject,
                            opacity: 0.2,
                          }}
                          blurType={'light'}
                          blurAmount={2}
                          reducedTransparencyFallbackColor="white"
                        />
                        <LinearGradient
                          start={{x: 0, y: 0}}
                          end={{y: 0.7, x: 0.4}}
                          colors={['#D9D9D930', '#FFFFFF06']}
                          style={styles.gradientCard}
                        />
                        <Text style={styles.ticketName}>
                          {item?.ticketName}
                        </Text>
                        <Text style={styles.ticketNamePrice}>
                          <Text style={styles.currency}>{currency}</Text>
                          {item?.originalPrice}
                          {/* {item?.originalPrice * (item?.numberOfBoooking || 1)} */}
                        </Text>
                        <TicketCounter
                          maxDisabled={maxDisabled}
                          minDisabled={minDisabled}
                          max={
                            item?.numberOfTickets - item?.numberOfSoldTickets
                          }
                          onChange={val => onChangenumberOfBoooking(val, index)}
                          value={item?.numberOfBoooking || 0}
                        />
                      </View>
                    );
                  })}
                </View>
                <View style={styles.priceBorder} />
                <View style={styles.seatDetail}>
                  <Text style={styles.lowerLevelText}>Lower level</Text>
                  <Text
                    style={
                      styles.lowerLevelDesc
                    }>{`Tickets are not reserved yet.\nTo secure your seats, Click Next`}</Text>
                </View>
                <SubtotalCard
                  tickets={totalnumberTicketOfBoooking}
                  amount={totalPrice}
                  currency={currency}
                />
              </View>
            </ScrollView>
          </View>
          <CustomButton
            text="Next"
            onPress={onNext}
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

export default BookedTicket;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  imageBackground: {
    width: '100%',
    height: height / 4,
    ...StyleSheet.absoluteFillObject,
    // resizeMode: 'cover',
  },
  contentOverlay: {
    marginBottom: 24,
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
    gap: 16,
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
    width: '70%',
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
  gradientCard: {
    ...StyleSheet.absoluteFillObject,
  },
  ticketCard: {
    borderRadius: 16,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 36,
    paddingBottom: 48,
  },
  ticketNameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },

  ticketNamePrice: {
    color: '#E9E9EE',
    fontSize: fontSize.f48,
    fontFamily: fonts['Poppins-Medium'],
  },
  ticketName: {
    color: '#E9E9EE',
    fontSize: fontSize.f20,
    fontFamily: fonts['Poppins-SemiBold'],
  },
  counterContainer: {
    alignItems: 'flex-end',
    marginBottom: 8,
  },
  currency: {
    color: '#FFFFFF50',
    fontSize: fontSize.f28,
    fontFamily: fonts['Poppins-Medium'],
  },
  priceBorder: {
    height: 3,
    borderWidth: 1.5,
    borderColor: '#FFFFFF10',
    borderStyle: 'dashed',
    width: '80%',
    alignSelf: 'center',
  },
  seatDetail: {
    padding: 17,
    paddingHorizontal: 24,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#FFFFFF10',
  },
  lowerLevelText: {
    color: '#FFFFFF',
    fontSize: fontSize.f16,
    fontFamily: fonts['Poppins-Medium'],
  },
  lowerLevelDesc: {
    color: '#FFFFFF60',
    fontSize: fontSize.f13,
    fontFamily: fonts['Poppins-Medium'],
  },
});
