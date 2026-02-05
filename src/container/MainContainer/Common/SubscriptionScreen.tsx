import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {SubscriptionScreenProps} from '@navigation/screens';
import FastImage from 'react-native-fast-image';
import {fonts} from '@constant/fontfamily';
import {fontSize, hp} from '@constant/fontSize';
import {Colors} from '@constant/colors';
import {wp} from '@constant/fontSize';
import {VerifiedIcon} from '@assets/svg/AuthFlowIcons';
import AnimatedBackground from '@components/AnimationComponent/AnimationBackground';
import StackHeader from '@components/CustomHeaders/StackHeader';
import LinearGradient from 'react-native-linear-gradient';
import {
  useGetCreatorPlansQuery,
  useSubscribeToPlanMutation,
} from '@rtkServices/SubcriptionService';
import NodataFound from '@components/DataEmpty/NodataFound';
import Loader from '@components/CustomLoader/Loader';
import {useToastMessage} from '@hooks/useToastMessage';
import {textConverter} from '@utils/general';

export default function SubscriptionScreen({
  navigation,
  route,
}: SubscriptionScreenProps) {
  const {showError, showSuccess} = useToastMessage();
  const {profileData} = route?.params || {};
  const {data: subscriptionPlans, isLoading: isLoadingSubscriptionPlans} =
    useGetCreatorPlansQuery(profileData?._id);
  const [subscribeToPlan, {isLoading: isSubscribingToPlan}] =
    useSubscribeToPlanMutation();
  const [selectedPlan, setSelectedPlan] = useState<string>('');

  useEffect(() => {
    if (
      subscriptionPlans?.data?.length &&
      subscriptionPlans?.data?.length > 0
    ) {
      setSelectedPlan(subscriptionPlans?.data?.[0]?._id || '');
    }
  }, [subscriptionPlans]);

  const handleSubscribeToPlan = async () => {
    await subscribeToPlan({
      planId: selectedPlan,
    }).then(res => {
      if (res?.data?.success) {
        showSuccess(res?.data?.message || '');
        navigation.goBack();
      }
      if (res?.error) {
        showError(res?.error?.data?.message || '');
      }
    });
  };

  const selectedPlanData = subscriptionPlans?.data?.find(
    plan => plan?._id === selectedPlan,
  );

  return (
    <View style={styles.container}>
      <AnimatedBackground
        animationSource={require('@assets/animations/AuthAnimation4.json')}
        backgroundColor={'#1a1538'}
        zIndex={0}
      />
      <StackHeader
        title="Subscription"
        onBackPress={() => navigation.goBack()}
      />
      <ScrollView style={{flexGrow: 1}}>
        <View style={styles.userImageContainer}>
          <FastImage
            source={
              profileData?.profilePicture
                ? {uri: profileData?.profilePicture}
                : require('@assets/images/DummyUserImage.png')
            }
            style={[
              styles.userImageStyle,
              profileData?.isLive ? styles.userImageLive : null,
            ]}
          />
          {profileData?.isLive && (
            <View style={styles.liveIconContainer}>
              <Text style={styles.liveIconText}>Live</Text>
            </View>
          )}
        </View>

        <View style={styles.userNameRow}>
          <Text numberOfLines={1} style={styles.userNameStyle}>
            {profileData?.displayName || profileData?.username || 'No Name'}
          </Text>
          {profileData?.membership !== 'standard' && (
            <VerifiedIcon width={20} height={20} style={{marginTop: 10}} />
          )}
        </View>

        <View style={styles.planContainer}>
          {subscriptionPlans?.data ? (
            subscriptionPlans?.data?.map(plan => (
              <TouchableOpacity
                key={plan._id}
                onPress={() => setSelectedPlan(plan?._id)}>
                <LinearGradient
                  colors={
                    selectedPlan === plan?._id
                      ? ['#8800FF', '#1AD655']
                      : ['transparent', 'transparent']
                  }
                  style={styles.gradientContainer}>
                  <View
                    style={[
                      styles.planContent,
                      {
                        backgroundColor:
                          selectedPlan === plan?._id ? '#21173F' : '#FFFFFF14',
                      },
                    ]}>
                    <Text style={styles.planTitle}>
                      {textConverter(plan?.interval)} Plan
                    </Text>
                    <Text style={styles.planPrice}>
                      {plan?.price} {plan?.currency}
                    </Text>
                  </View>
                </LinearGradient>
              </TouchableOpacity>
            ))
          ) : isLoadingSubscriptionPlans ? (
            <Loader visible={isLoadingSubscriptionPlans} />
          ) : (
            <NodataFound />
          )}
        </View>

        {subscriptionPlans?.data && subscriptionPlans?.data?.length > 0 && (
          <TouchableOpacity
            disabled={isSubscribingToPlan}
            onPress={handleSubscribeToPlan}>
            <FastImage
              source={require('@assets/images/SubscribedButton.png')}
              style={styles.subscribedButtonImage}
              resizeMode={FastImage.resizeMode.stretch}>
              {isSubscribingToPlan ? (
                <ActivityIndicator size="small" color={Colors.white} />
              ) : (
                <Text style={styles.followButtonText}>Subscribe</Text>
              )}
            </FastImage>
          </TouchableOpacity>
        )}

        <Text style={styles.Terms}>
          By tapping Subscribe, you will be charged and your subscription will
          auto-renew for the same price and package length until you cancel via
          settings, and you agree to our Terms.
        </Text>

        {selectedPlanData && (
          <View style={styles.benefitsCard}>
            <View style={styles.includedContainer}>
              <Text style={styles.includedText}>
                Included with Subscription
              </Text>
            </View>
            <View style={styles.benefitsSection}>
              <View style={styles.benefitRow}>
                <View style={styles.benefitIconContainer}>
                  <Text style={styles.checkmarkIcon}>✓</Text>
                </View>
                <View style={styles.benefitTextContainer}>
                  <Text style={styles.benefitText}>Plan Description</Text>
                  <Text style={styles.benefitDes}>
                    {selectedPlanData?.description}
                  </Text>
                </View>
              </View>
            </View>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  userImageStyle: {
    width: wp('35%'),
    height: wp('35%'),
    alignSelf: 'center',
    borderRadius: 100,
  },
  userImageLive: {
    borderWidth: 3,
    borderColor: Colors.green,
  },
  userImageContainer: {
    width: wp('35%'),
    height: wp('35%'),
    alignSelf: 'center',
  },
  liveIconContainer: {
    position: 'absolute',
    bottom: -10,
    alignSelf: 'center',
    backgroundColor: '#8800FF',
    paddingHorizontal: 5,
    paddingVertical: 2,
    borderRadius: 3,
  },
  liveIconText: {
    fontSize: fontSize.f8,
    color: Colors.white,
    fontFamily: fonts['Poppins-Medium'],
  },
  userNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  userNameStyle: {
    fontSize: fontSize.f28,
    color: Colors.white,
    fontFamily: fonts['Poppins-Medium'],
    textAlign: 'center',
    marginTop: 10,
    paddingHorizontal: wp('4%'),
    maxWidth: '100%',
  },
  gradientContainer: {
    width: '100%',
    height: hp('9'),
    borderRadius: 13,
  },
  planContainer: {
    width: '100%',
    paddingHorizontal: wp('4%'),
    marginTop: hp('2%'),
    gap: 20,
  },
  planContent: {
    flex: 1,
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: wp('4%'),
    backgroundColor: '#21173F',
    margin: 3,
    borderRadius: 10,
  },
  planTitle: {
    fontSize: fontSize.f18,
    color: Colors.white,
    fontFamily: fonts['Poppins-Medium'],
    textTransform: 'capitalize',
  },
  planPrice: {
    fontSize: fontSize.f16,
    color: Colors.white,
    fontFamily: fonts['Poppins-Medium'],
  },
  selectedPlanDetails: {
    paddingHorizontal: wp('4%'),
    marginTop: hp('2%'),
  },
  planDescription: {
    fontSize: fontSize.f14,
    color: Colors.white,
    fontFamily: fonts['Poppins-Regular'],
    textAlign: 'center',
    lineHeight: 20,
  },
  subscribedButtonImage: {
    width: '90%',
    alignSelf: 'center',
    borderRadius: 10,
    height: hp('6'),
    marginTop: hp('2%'),
    alignItems: 'center',
    justifyContent: 'center',
  },
  followButtonText: {
    fontSize: fontSize.f16,
    color: Colors.white,
    fontFamily: fonts['Poppins-Medium'],
  },
  Terms: {
    fontSize: fontSize.f8,
    fontFamily: fonts['Poppins-Regular'],
    textAlign: 'left',
    color: '#8D8C8C',
    marginTop: hp('3%'),
    paddingHorizontal: wp('7%'),
  },
  benefitsCard: {
    marginTop: 40,
    marginHorizontal: wp('2%'),
    borderRadius: 12,
    padding: 16,
    shadowColor: Colors.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    borderWidth: 4,
    borderColor: '#2F2E2E2E',
    width: '90%',
    alignSelf: 'center',
  },
  includedContainer: {
    marginBottom: 15,
    alignItems: 'center',
    position: 'absolute',
    top: -19,
    alignSelf: 'center',
    backgroundColor: '#2A2A3E',
    minHeight: 40,
    width: 260,
    borderRadius: 30,
    justifyContent: 'center',
  },
  includedText: {
    fontSize: fontSize.f14,
    fontFamily: fonts['Poppins-Medium'],
    color: Colors.white,
  },
  benefitsSection: {
    gap: 16,
    marginTop: 30,
  },
  benefitRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  benefitIconContainer: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#1AD655',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    marginTop: 2,
  },
  checkmarkIcon: {
    color: Colors.white,
    fontSize: fontSize.f12,
    fontFamily: fonts['Poppins-Bold'],
  },
  benefitTextContainer: {
    flex: 1,
  },
  benefitText: {
    fontSize: fontSize.f14,
    fontFamily: fonts['Poppins-Medium'],
    color: Colors.white,
    marginBottom: 4,
  },
  benefitDes: {
    fontSize: fontSize.f12,
    fontFamily: fonts['Poppins-Regular'],
    color: '#8E8E93',
    lineHeight: 25,
  },
});
