import {
  ActivityIndicator,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useMemo, useState} from 'react';
import AnimationBackground from '@components/AnimationComponent/AnimationBackground';
import TicketingHeader from '@components/ScreenLayouts/TicketingComp/TicketingHeader';
import {CheckoutProps} from '@navigation/screens';
import LinearGradient from 'react-native-linear-gradient';
import {getCurrencySymbol} from '@utils/general';
import dayjs from 'dayjs';
import {fontSize} from '@constant/fontSize';
import {fonts} from '@constant/fontfamily';
import {Colors} from '@constant/colors';
import CustomButton from '@components/CustomButtons/CustomButton';
import SubtotalCard from '@components/TicketComponents/SubTotalCard';
import {BlurView} from '@react-native-community/blur';
import BookingSuccess from './BookingSuccess';
import {useCreateUserTicketMutation} from '@rtkServices/TicketingService';
import {useToastMessage} from '@hooks/useToastMessage';

const Checkout = ({navigation, route}: CheckoutProps) => {
  const {eventData: eventAllData, bookedTicketData} = route?.params || {};
  const data = eventAllData?.event;
  const currency = getCurrencySymbol(data?.eventCurrencyType);
  const [isChecked, setIsChecked] = useState(false);
  const [createTicket, {isLoading, isSuccess}] = useCreateUserTicketMutation();
  const {showError, showSuccess} = useToastMessage();
  const totalnumberTicketOfBoooking = useMemo(
    () =>
      bookedTicketData?.reduce(
        (sum, item) => sum + (item?.numberOfBoooking || 0),
        0,
      ),
    [bookedTicketData],
  );

  const totalPrice = useMemo(
    () =>
      bookedTicketData?.reduce(
        (sum, item) =>
          sum + (item?.numberOfBoooking || 0) * item?.originalPrice,
        0,
      ),
    [bookedTicketData],
  );

  const onToggle = () => {
    setIsChecked(val => !val);
  };
  const onPressTerms = () => {};

  const onPlaceOrder = async () => {
    const tickets = bookedTicketData
      ?.filter?.((item: any) => item?.numberOfBoooking)
      ?.map?.((item: any) => ({
        eventTicketId: item?._id,
        quantity: item?.numberOfBoooking,
      }));
    let payload = {
      eventId: data?._id,
      tickets,
    };
    try {
      await createTicket(payload).then(res => {
        if (!res.error?.data?.success) {
          showError(res.error.data.message);
        }
      });
    } catch (error) {
      //
      console.error(error);
    }
  };

  return (
    <View style={styles.container}>
      <AnimationBackground
        animationSource={require('@assets/animations/AuthAnimation4.json')}
        backgroundColor={'#1a1538'}
        zIndex={0}
      />
      <View style={styles.innercontainer}>
        <TicketingHeader
          onBackPress={() => navigation.goBack()}
          onLikePress={() => {}}
          title="Checkout"
          isSemiboldtitle
          isLikeVisible={false}
        />
        <View style={{flex: 1, paddingHorizontal: 15, paddingBottom: 24}}>
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{flexGrow: 1}}>
            <View style={{flex: 1}}>
              <View style={styles.ticketCard}>
                <LinearGradient
                  start={{x: 0, y: 0}}
                  end={{y: 0.7, x: 0.4}}
                  colors={['#D9D9D930', '#FFFFFF16']}
                  style={styles.gradientCard}
                />
                <Text style={styles.titleText}>{data?.eventName}</Text>
                <Text style={styles.descriptionText}>
                  {dayjs(data?.eventDateTime).format('ddd DD MMM · h:mm A')}
                </Text>
                <Text style={styles.descriptionText}>
                  {data?.eventLocation?.address}
                </Text>
                <View style={styles.detailContainer}>
                  <View style={styles.iconWrapper}>
                    <Image
                      source={require('@assets/images/seatIcon.png')}
                      style={styles.iconImg}
                    />
                  </View>
                  <View style={styles.textBlock}>
                    <Text style={styles.title}>Lower level</Text>
                    <Text style={styles.subtitle}>
                      Tickets are not reserved yet. To secure your seats, Click
                      Next
                    </Text>
                  </View>
                </View>
                <View style={styles.detailContainer}>
                  <View style={styles.iconWrapper}>
                    <Image
                      source={require('@assets/images/TicketManage.png')}
                      style={{...styles.iconImg, opacity: 0.5}}
                    />
                  </View>
                  <View style={styles.textBlock}>
                    <Text style={styles.title}>
                      {totalnumberTicketOfBoooking} ticket
                      {totalnumberTicketOfBoooking > 1 ? 's' : ''}
                    </Text>
                    <Text style={styles.subtitle}>
                      2 SEC 205, Row 25, Seats 3 &4
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          </ScrollView>
          <Text style={styles.exceptionText}>
            *All sales final • No refunds
          </Text>
          <SubtotalCard
            tickets={totalnumberTicketOfBoooking}
            amount={totalPrice}
            currency={currency}
            title="Total"
            isShowNumTicket={false}
            containerStyle={{padding: 0}}
            amountTextStyle={{fontSize: fontSize.f28}}
          />
          <View style={styles.termRow}>
            <TouchableOpacity onPress={onToggle} style={styles.circle}>
              {isChecked && <View style={styles.circleFilled} />}
            </TouchableOpacity>
            <Text style={styles.termlabel}>
              I have read & agreed to the current{' '}
              <Text style={styles.link} onPress={onPressTerms}>
                Terms of Use
              </Text>
            </Text>
          </View>
          <CustomButton
            text="Place order"
            onPress={onPlaceOrder}
            disabled={!isChecked}
            btnStyle={
              !isChecked
                ? {opacity: 0.5}
                : {opacity: 1, backgroundColor: '#ffffff'}
            }
            textStyle={
              !isChecked
                ? {color: 'rgba(255, 255, 255, 0.5)'}
                : {color: Colors.black}
            }
          />
          <Text style={styles.exceptionText}>
            *Exceptions may apply, see our Terms of use
          </Text>
        </View>
      </View>
      {(isSuccess || isLoading) && (
        <View style={styles.loaderAndSuccessContainer}>
          <BlurView
            style={StyleSheet.absoluteFillObject}
            blurType="dark"
            blurAmount={2}
            reducedTransparencyFallbackColor="white"
          />
          {isLoading && (
            <View style={styles.loader}>
              <ActivityIndicator size={'large'} color={'#FFFFFF'} />
              <Text style={styles.confirmText}>
                Confirming your{'\n'}availability
              </Text>
            </View>
          )}
          {isSuccess && (
            <BookingSuccess
              eventData={data}
              numOfTicket={totalnumberTicketOfBoooking}
            />
          )}
        </View>
      )}
    </View>
  );
};

export default Checkout;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  innercontainer: {
    flex: 1,
  },
  gradientCard: {
    ...StyleSheet.absoluteFillObject,
  },
  ticketCard: {
    borderRadius: 16,
    overflow: 'hidden',
    paddingVertical: 24,
    paddingHorizontal: 20,
  },
  titleText: {
    fontSize: fontSize.f24,
    fontFamily: fonts['Poppins-Medium'],
    color: Colors.white,
    lineHeight: 32,
    marginBottom: 8,
  },
  descriptionText: {
    fontSize: fontSize.f12,
    fontFamily: fonts['Poppins-Regular'],
    color: '#FFFFFF60',
    lineHeight: 20,
  },
  exceptionText: {
    fontSize: fontSize.f14,
    fontFamily: fonts['Poppins-Medium'],
    color: '#CAC9CE50',
  },

  termRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
  },

  circle: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 2,
    borderColor: 'white',
    marginRight: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },

  circleFilled: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: 'white',
  },

  termlabel: {
    fontSize: fontSize.f13,
    fontFamily: fonts['Poppins-Regular'],
    color: 'white',
  },

  link: {
    color: 'white',
    textDecorationLine: 'underline',
  },
  iconImg: {
    height: 20,
    width: 20,
  },
  iconWrapper: {
    height: 34,
    width: 34,
    borderRadius: 34,
    backgroundColor: '#FFFFFF10',
    justifyContent: 'center',
    alignItems: 'center',
  },
  textBlock: {
    flex: 1,
  },
  detailContainer: {
    flexDirection: 'row',
    gap: 14,
    marginTop: 24,
  },
  title: {
    color: 'white',
    fontSize: fontSize.f16,
    fontFamily: fonts['Poppins-Medium'],
  },

  subtitle: {
    marginTop: 2,
    color: '#CAC9CE50',
    fontSize: 15,
    lineHeight: 20,
    width: '70%',
  },
  loaderAndSuccessContainer: {
    ...StyleSheet.absoluteFillObject,
  },
  loader: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
  confirmText: {
    color: 'white',
    fontSize: fontSize.f16,
    fontFamily: fonts['Poppins-Medium'],
    textAlign: 'center',
  },
});
