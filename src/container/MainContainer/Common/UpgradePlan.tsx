import React, {useMemo, useState} from 'react';
import {
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  View,
  Pressable,
  TouchableOpacity,
  Platform,
} from 'react-native';
import {fonts} from '@constant/fontfamily';
import {UpgradePlanProps} from '@navigation/screens';
import {planData} from '@utils/data';
import {BackArrow, CheckIcon, VerifiedIcon} from '@assets/svg/AuthFlowIcons';
import {CrossIcon} from '@assets/svg/AuthFlowIcons';
import CustomButton from '@components/CustomButtons/CustomButton';
import LinearGradient from 'react-native-linear-gradient';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useUpdateMembershipPlanMutation} from '@rtkServices/ProfileService';
import {useToastMessage} from '@hooks/useToastMessage';
import {Colors} from '@constant/colors';
import {fontSize} from '@constant/fontSize';
import FastImage from 'react-native-fast-image';

const UpgradePlan: React.FC<UpgradePlanProps> = ({navigation, route}) => {
  const {showError, showSuccess} = useToastMessage();
  const {currentPlan} = route?.params || {};
  const [selectedPlanIndex, setSelectedPlanIndex] = useState(1);
  const [upgradePlan] = useUpdateMembershipPlanMutation();
  const enhancedData = useMemo(() => ['Header', ...planData.features], []);
  const {top} = useSafeAreaInsets();

  const getButtonColors = () => {
    if (selectedPlanIndex === 1) {
      return {
        backgroundColor: Colors.white,
        textColor: Colors.white,
        borderColor: Colors.white,
        opacity: 1,
      };
    }
    return {
      backgroundColor: Colors.grey,
      textColor: Colors.white,
      borderColor: Colors.grey,
      opacity: 0.5,
    };
  };

  const handleUpgrade = async () => {
    const selectedPlan = planData.plans[selectedPlanIndex];

    const res = await upgradePlan({
      membership: selectedPlan.name.toLowerCase(),
    });
    if (res?.data?.success) {
      showSuccess(res?.data?.message);
      navigation.reset({
        index: 0,
        routes: [{name: 'MainNavigator'}],
      });
    } else {
      showError(res?.error?.data?.message || 'Failed to upgrade plan');
    }
  };

  const renderPlanItem = ({item, index}: {item: string; index: number}) => {
    if (item === 'Header') {
      return (
        <View style={styles.itemContainer2}>
          <View style={styles.featureHeaderItem} />
          {planData?.plans?.map((plan, i) => {
            const isCurrentPlan = currentPlan === plan.name.toLowerCase();
            const isDisabled =
              isCurrentPlan || (currentPlan === 'creator' && i === 0);

            return (
              <Pressable
                key={i}
                style={[
                  styles.headerItem,
                  i === 1 && selectedPlanIndex === 1 && styles.creatorPlan,
                  isCurrentPlan && styles.currentPlan,
                  isDisabled && styles.disabledPlan,
                ]}
                onPress={() => !isDisabled && setSelectedPlanIndex(i)}
                disabled={isDisabled}>
                {isCurrentPlan && (
                  <Text style={styles.currentPlanBadge}>Current Plan</Text>
                )}
                <Text
                  style={[
                    styles.planNameText,
                    i === 1 &&
                      selectedPlanIndex === 1 &&
                      styles.creatorPlanText,
                    isDisabled && styles.disabledText,
                  ]}>
                  {plan.name}
                </Text>
                <View style={styles.priceContainer}>
                  {plan.name === 'Creator' && i === 1 ? (
                    <LinearGradient
                      colors={['#AC7815', '#D5A64D', '#E1B353']}
                      style={styles.priceContainerGradient}>
                      <Text
                        style={[
                          styles.planPriceText,
                          i === 1 &&
                            selectedPlanIndex === 1 &&
                            styles.creatorPlanText,
                        ]}>
                        {plan.price}
                      </Text>
                    </LinearGradient>
                  ) : (
                    <View style={styles.priceContainerGradient}>
                      <Text
                        style={[
                          styles.planPriceText,
                          i === 1 &&
                            selectedPlanIndex === 1 &&
                            styles.creatorPlanText,
                        ]}>
                        {plan.price}
                      </Text>
                    </View>
                  )}
                </View>
              </Pressable>
            );
          })}
        </View>
      );
    }

    const isLastItem = index === enhancedData.length - 1;

    return (
      <View style={styles.itemContainer}>
        <Text style={styles.itemText}>{item}</Text>
        {planData?.plans?.map((plan, i) => {
          const isCurrentPlan = currentPlan === plan.name.toLowerCase();
          const isDisabled =
            isCurrentPlan || (currentPlan === 'creator' && i === 0);
          const featureValue = plan.features[index - 1];
          const isVerificationFeature = item === 'Verification';

          return (
            <Pressable
              key={i}
              style={[
                styles.itemValueContainer,
                i === 1 && selectedPlanIndex === 1 && styles.creatorFeatureItem,
                isCurrentPlan && styles.currentPlanFeature,
                isLastItem && i === 1 && styles.creatorLastItem,
                isDisabled && styles.disabledPlan,
              ]}
              onPress={() => !isDisabled && setSelectedPlanIndex(i)}
              disabled={isDisabled}>
              {typeof featureValue === 'boolean' ? (
                <View
                  style={[
                    styles.checkmarkContainer,
                    featureValue && i === 1 && styles.creatorCheckmark,
                  ]}>
                  {isVerificationFeature && featureValue && i === 1 ? (
                    <VerifiedIcon width={30} height={30} />
                  ) : (
                    (() => {
                      const showCheck = isDisabled ? true : featureValue;
                      const isCheck = !!showCheck;
                      let iconColor = Colors.white; // Default white color
                      if (selectedPlanIndex === i) {
                        if (i === 0) {
                          iconColor = Colors.white; // Free plan - white
                        } else if (i === 1) {
                          iconColor = Colors.white; // Creator plan - white
                        }
                      } else {
                        iconColor = Colors.white;
                      }

                      return isCheck ? (
                        <CheckIcon fill={iconColor} />
                      ) : (
                        <CrossIcon fill={iconColor} />
                      );
                    })()
                  )}
                </View>
              ) : (
                <Text
                  style={[
                    styles.itemValue,
                    i === 1 && {color: buttonColors.textColor},
                    isDisabled && styles.disabledText,
                  ]}>
                  {featureValue}
                </Text>
              )}
            </Pressable>
          );
        })}
      </View>
    );
  };

  const buttonColors = getButtonColors();
  const selectedPlan = planData.plans[selectedPlanIndex];
  const isUpgradeAvailable =
    selectedPlanIndex !== 0 && currentPlan !== selectedPlan.name.toLowerCase();

  return (
    <View style={styles.container}>
      <LinearGradient colors={['#1f0e52', '#140b2e']} style={{flex: 1}}>
        <ScrollView bounces={false} showsVerticalScrollIndicator={false}>
          <View style={[styles.subViewStyle, {marginTop: top}]}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                position: 'relative',
              }}>
              <TouchableOpacity
                onPress={() => navigation.goBack()}
                style={styles.icon}>
                <BackArrow
                  color={Colors.white}
                  height={23}
                  width={23}
                  hitSlop={20}
                />
              </TouchableOpacity>
              <Text style={[styles.titleStyle, {flex: 1}]}>
                Upgrade Your Plan
              </Text>
            </View>
            <Text style={styles.subTitleStyle}>
              Stream Exclusive Live streams, Immersive VR Content, also Monetize
              Content and many more
            </Text>

            {/* Early Creators Banner */}
            <FastImage
              source={require('@assets/images/yellowBgImage.png')}
              style={styles.bannerImage}>
              <View style={{padding: 13}}>
                <Text style={styles.bannerTitle}>
                  Early Creators Get in Free !
                </Text>
                <Text style={styles.bannerSubtitle}>
                  Join now and secure your spot as one of the first creators on
                  our platform - no £9.99/month fee, ever.
                </Text>
              </View>
            </FastImage>
          </View>

          <View style={styles.mainContainer}>
            <LinearGradient
              colors={['#3A2F59', '#3A2F59']}
              style={{flex: 1, borderRadius: 12}}>
              <FlatList
                data={enhancedData}
                renderItem={renderPlanItem}
                keyExtractor={(item, index) => index.toString()}
                bounces={false}
                scrollEnabled={false}
                style={{zIndex: 2}}
                contentContainerStyle={{paddingBottom: 16, paddingTop: 10}}
              />
              <View style={styles.popularButton}>
                <Text
                  style={{
                    color: Colors.white,
                    fontSize: fontSize.f13,
                    fontFamily: fonts['Poppins-Regular'],
                  }}>
                  Popular
                </Text>
              </View>
            </LinearGradient>
          </View>

          <View style={[styles.subViewStyle]}>
            <CustomButton
              text={isUpgradeAvailable ? 'Upgrade Now' : 'Current Plan'}
              onPress={handleUpgrade}
              disabled={!isUpgradeAvailable}
              textStyle={[
                styles.buttonText,
                {
                  color: isUpgradeAvailable ? Colors.black : '#666',
                  opacity: isUpgradeAvailable ? buttonColors.opacity : 0.5,
                },
              ]}
              btnStyle={[
                styles.btnStyle,
                {
                  backgroundColor: isUpgradeAvailable
                    ? buttonColors.backgroundColor
                    : '#red',
                  borderColor: isUpgradeAvailable
                    ? buttonColors.borderColor
                    : '#666',
                  borderWidth: 1,
                },
              ]}
              iconRight={
                isUpgradeAvailable ? (
                  <FastImage
                    source={require('@assets/images/SubmitIcon.png')}
                    style={styles.submitIcon}
                  />
                ) : undefined
              }
            />
            {isUpgradeAvailable && (
              <Text style={styles.descriptionStyle}>
                By tapping Continue, you will be charged, your subscription will
                auto-renew for the same price and package length until you
                cancel via App Store settings, and you agree to our{' '}
                <Text style={{textDecorationLine: 'underline'}}>Terms</Text>.
              </Text>
            )}
            {!isUpgradeAvailable && currentPlan === 'creator' && (
              <Text style={styles.descriptionStyle}>
                You're already on the Creator plan with access to all premium
                features.
              </Text>
            )}
          </View>
        </ScrollView>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  titleStyle: {
    color: Colors.white,
    fontSize: fontSize.f26,
    fontFamily: fonts['Poppins-Bold'],
    letterSpacing: 0.5,
    textAlign: 'center',
    lineHeight: 38,
  },
  subTitleStyle: {
    color: Colors.white,
    fontSize: fontSize.f10,
    fontFamily: fonts['Poppins-Regular'],
    marginTop: 10,
    textAlign: 'left',
    lineHeight: 18,
  },
  subViewStyle: {
    padding: 15,
    justifyContent: 'center',
    alignItems: 'flex-start',
    marginTop: -13,
  },
  buttonText: {
    textTransform: 'none',
    fontFamily: fonts['Poppins-Medium'],
    fontSize: fontSize.f16,
  },
  descriptionStyle: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: fontSize.f10,
    fontFamily: fonts['Poppins-Regular'],
    lineHeight: 18,
    textAlign: 'center',
    marginTop: 20,
    marginBottom: 40,
  },
  btnStyle: {
    height: 52,
    borderRadius: 12,
  },
  itemContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  featureHeaderItem: {
    width: '50%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerItem: {
    alignItems: 'center',
    justifyContent: 'flex-start',
    width: '22%',
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    position: 'relative',
  },
  priceContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  priceContainerGradient: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 7,
    height: 27,
    width: 65,
  },
  currentPlan: {
    backgroundColor: '#4CAF50',
    borderWidth: 2,
    borderColor: '#4CAF50',
  },
  currentPlanBadge: {
    position: 'absolute',
    top: 5,
    backgroundColor: '#2E7D32',
    color: Colors.white,
    fontSize: fontSize.f8,
    fontFamily: fonts['Poppins-Medium'],
    paddingHorizontal: 4,
    paddingVertical: 2,
    borderRadius: 4,
    textAlign: 'center',
  },
  currentPlanFeature: {
    backgroundColor: '#4CAF50',
    borderWidth: 1,
    borderColor: '#4CAF50',
  },
  creatorPlan: {
    backgroundColor: '#6C6382',
    paddingTop: 15,
  },
  creatorFeatureItem: {
    backgroundColor: '#6C6382',
    borderWidth: 1,
    borderColor: '#6C6382',
  },
  creatorLastItem: {
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
  },
  planNameText: {
    color: Colors.white,
    fontSize: fontSize.f14,
    fontFamily: fonts['Poppins-Medium'],
    textAlign: 'center',
    marginBottom: 8,
  },
  planPriceText: {
    color: Colors.white,
    fontSize: fontSize.f14,
    fontFamily: fonts['Poppins-Medium'],
    textAlign: 'center',
  },
  creatorPlanText: {
    color: Colors.white,
  },
  itemText: {
    width: '50%',
    color: Colors.white,
    fontSize: fontSize.f12,
    fontFamily: fonts['Poppins-Regular'],
    paddingVertical: 15,
    lineHeight: 16,
    paddingLeft: 15,
    textAlign: 'left',
  },
  itemValueContainer: {
    width: '22%',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14.2,
  },
  itemValue: {
    color: Colors.white,
    fontSize: fontSize.f12,
    fontFamily: fonts['Poppins-Regular'],
    textAlign: 'center',
    lineHeight: 16,
  },
  checkmarkContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  creatorCheckmark: {},
  disabledPlan: {
    opacity: 1,
  },
  disabledText: {
    color: Colors.white,
  },
  mainContainer: {
    flex: 1,
    marginHorizontal: 10,
    borderRadius: 12,
    overflow: 'hidden',
    paddingHorizontal: 8,
    paddingBottom: 16,
  },
  itemContainer2: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    minHeight: 50,
    alignItems: 'flex-end',
  },
  icon: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitIcon: {
    width: 16,
    height: 16,
    marginLeft: 8,
    tintColor: Colors.black,
  },
  bannerImage: {
    width: '100%',
    borderRadius: 20,
    overflow: 'hidden',
    marginTop: 25,
    marginBottom: 5,
  },
  bannerTitle: {
    color: Colors.white,
    fontSize: fontSize.f20,
    fontFamily: fonts['Poppins-SemiBold'],
    marginBottom: 5,
    marginLeft: 10,
  },
  bannerSubtitle: {
    color: Colors.white,
    fontSize: fontSize.f12,
    fontFamily: fonts['Poppins-Regular'],
    lineHeight: 18,
    marginLeft: 10,
  },
  popularButton: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 37,
    width: 100,
    backgroundColor: '#1EB54C',
    borderRadius: 12,
    alignSelf: 'flex-end',
    marginBottom: 12,
    // position: 'absolute',
    // bottom: 0,
    right: Platform.OS === 'ios' ? 26 : 20,
  },
});

export default UpgradePlan;
