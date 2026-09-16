import {
  ActivityIndicator,
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useMemo, useState} from 'react';
import {SubscriptionScreenProps} from '@navigation/screens';
import FastImage from 'react-native-fast-image';
import {fonts} from '@constant/fontfamily';
import {fontSize} from '@constant/fontSize';
import {Colors} from '@constant/colors';
import {BackArrow, VerifiedIcon} from '@assets/svg/AuthFlowIcons';
import GlowBackground from '@components/AnimationComponent/GlowBackground';
import LinearGradient from 'react-native-linear-gradient';
import {
  useGetCreatorPlansQuery,
  useSubscribeToPlanMutation,
} from '@rtkServices/SubcriptionService';
import {useToastMessage} from '@hooks/useToastMessage';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {navigate} from '@navigation/utils';
import {AboutData} from '@utils/data';
import {getCurrencySymbol} from '@utils/general';

const {width: SCREEN_WIDTH} = Dimensions.get('window');
const H_PAD = 24;
const AVATAR_SIZE = Math.round((150 / 393) * SCREEN_WIDTH);
const RING_SIZE = Math.round((164 / 393) * SCREEN_WIDTH);

type PlanBadge = {
  type: 'popular' | 'best';
  label: string;
} | null;

type DisplayPlan = {
  _id: string;
  interval: string;
  label: string;
  priceLabel: string;
  badge: PlanBadge;
  isDummy?: boolean;
};

const PLAN_META: Record<
  string,
  {label: string; months: number; badge: PlanBadge}
> = {
  monthly: {label: 'Monthly', months: 1, badge: null},
  quarterly: {
    label: '3 Months',
    months: 3,
    badge: {type: 'popular', label: 'Popular'},
  },
  six_months: {label: '6 Months', months: 6, badge: null},
  yearly: {
    label: 'Yearly',
    months: 12,
    badge: {type: 'best', label: 'Best value'},
  },
};

const DUMMY_PLANS: DisplayPlan[] = [
  {
    _id: 'dummy-monthly',
    interval: 'monthly',
    label: 'Monthly',
    priceLabel: '$14.99/M',
    badge: null,
    isDummy: true,
  },
  {
    _id: 'dummy-quarterly',
    interval: 'quarterly',
    label: '3 Months',
    priceLabel: '$11.99/M',
    badge: {type: 'popular', label: 'Popular'},
    isDummy: true,
  },
  {
    _id: 'dummy-yearly',
    interval: 'yearly',
    label: 'Yearly',
    priceLabel: '$8.50/M',
    badge: {type: 'best', label: 'Best value'},
    isDummy: true,
  },
];

const BENEFITS = [
  {
    title: 'Subscriber badge',
    description: 'Match and chat with people anywhere in the world.',
  },
  {
    title: 'Exclusive Content',
    description: 'Match and chat with people anywhere in the world.',
  },
  {
    title: 'Ad-Free',
    description: 'Match and chat with people anywhere in the world.',
  },
];

const formatMonthlyPrice = (price: number, months: number, currency: string) => {
  const monthly = months > 0 ? price / months : price;
  return `${getCurrencySymbol(currency)}${monthly.toFixed(2)}/M`;
};

const mapApiPlan = (plan: SubscriptionPlan): DisplayPlan => {
  const meta = PLAN_META[plan.interval] || {
    label: plan.interval,
    months: 1,
    badge: null,
  };
  return {
    _id: plan._id,
    interval: plan.interval,
    label: meta.label,
    priceLabel: formatMonthlyPrice(
      Number(plan.price) || 0,
      meta.months,
      plan.currency || 'USD',
    ),
    badge: meta.badge,
  };
};

export default function SubscriptionScreen({
  navigation,
  route,
}: SubscriptionScreenProps) {
  const {showError, showSuccess} = useToastMessage();
  const {top, bottom} = useSafeAreaInsets();
  const {profileData} = route?.params || {};
  const creatorId = profileData?._id;
  const {data: subscriptionPlans} = useGetCreatorPlansQuery(creatorId, {
    skip: !creatorId,
  });
  const [subscribeToPlan, {isLoading: isSubscribingToPlan}] =
    useSubscribeToPlanMutation();

  const plans = useMemo<DisplayPlan[]>(() => {
    const apiPlans = subscriptionPlans?.data || [];
    if (apiPlans.length > 0) {
      return apiPlans.map(mapApiPlan);
    }
    return DUMMY_PLANS;
  }, [subscriptionPlans?.data]);

  const defaultPlanId = plans[1]?._id || plans[0]?._id || '';
  const [selectedPlan, setSelectedPlan] = useState(defaultPlanId);

  const displayName =
    profileData?.displayName || profileData?.username || 'Wim Hof';

  useEffect(() => {
    setSelectedPlan(defaultPlanId);
  }, [defaultPlanId, creatorId]);

  const handleSubscribeToPlan = async () => {
    const plan = plans.find(item => item._id === selectedPlan);
    if (!plan || plan.isDummy) {
      return;
    }
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

  const renderBadge = (badge: PlanBadge) => {
    if (!badge) {
      return null;
    }
    if (badge.type === 'popular') {
      return (
        <View style={styles.popularBadge}>
          <Text style={styles.popularBadgeText}>{badge.label}</Text>
        </View>
      );
    }
    return (
      <LinearGradient
        colors={['#FFC70F', '#FFE695', '#F1B800']}
        start={{x: 0.2, y: 0}}
        end={{x: 0.8, y: 1}}
        style={styles.bestValueBadge}>
        <Text style={styles.bestValueBadgeText}>{badge.label}</Text>
      </LinearGradient>
    );
  };

  const renderPlanCard = (plan: DisplayPlan) => {
    const isSelected = selectedPlan === plan._id;
    const row = (
      <View style={[styles.planRow, !isSelected && styles.unselectedPlanRow]}>
        <View style={styles.planLeft}>
          <Text style={styles.planTitle}>{plan.label}</Text>
          {renderBadge(plan.badge)}
        </View>
        <Text style={styles.planPrice}>{plan.priceLabel}</Text>
      </View>
    );

    if (isSelected) {
      return (
        <TouchableOpacity
          key={plan._id}
          activeOpacity={0.85}
          onPress={() => setSelectedPlan(plan._id)}>
          <LinearGradient
            colors={['#8800FF', '#1AD655']}
            start={{x: 0.5, y: 0}}
            end={{x: 0.5, y: 1}}
            style={styles.selectedPlanBorder}>
            <View style={styles.selectedPlanInner}>{row}</View>
          </LinearGradient>
        </TouchableOpacity>
      );
    }

    return (
      <TouchableOpacity
        key={plan._id}
        activeOpacity={0.85}
        onPress={() => setSelectedPlan(plan._id)}
        style={styles.unselectedPlanCard}>
        {row}
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <GlowBackground />
      <View style={[styles.header, {paddingTop: top + 4}]}>
        <TouchableOpacity
          hitSlop={20}
          onPress={() => navigation.goBack()}
          style={styles.backButton}>
          <BackArrow color={Colors.white} height={20} width={20} opacity={0.5} />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scroll}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.scrollContent,
          {paddingBottom: Math.max(bottom, 24) + 20},
        ]}>
        <View style={styles.userImageContainer}>
          <View style={styles.avatarRing}>
            <FastImage
              source={
                profileData?.profilePicture
                  ? {uri: profileData.profilePicture}
                  : require('@assets/images/DummyUserImage.png')
              }
              style={styles.userImageStyle}
            />
          </View>
          <View style={styles.badgeRow}>
            <View style={styles.liveBadge}>
              <Text style={styles.liveBadgeText}>LIVE</Text>
            </View>
            <View style={styles.vrBadge}>
              <Text style={styles.vrBadgeText}>VR</Text>
            </View>
          </View>
        </View>

        <View style={styles.userNameRow}>
          <Text numberOfLines={1} style={styles.userNameStyle}>
            {displayName}
          </Text>
          <VerifiedIcon width={22} height={22} />
        </View>

        <View style={styles.planContainer}>{plans.map(renderPlanCard)}</View>

        <TouchableOpacity
          disabled={isSubscribingToPlan}
          onPress={handleSubscribeToPlan}
          activeOpacity={0.85}>
          <LinearGradient
            colors={['#F7CA39', '#CD9D02', '#F7CA3A']}
            start={{x: 0.15, y: 0}}
            end={{x: 0.85, y: 1}}
            style={styles.subscribeBorder}>
            <View style={styles.subscribeInner}>
              {isSubscribingToPlan ? (
                <ActivityIndicator size="small" color={Colors.white} />
              ) : (
                <Text style={styles.subscribeText}>Subscribe</Text>
              )}
            </View>
          </LinearGradient>
        </TouchableOpacity>

        <Text style={styles.terms}>
          By tapping Subscribe, you will be charged and your subscription will
          auto-renew for the same price and package length until you cancel via
          settings, and you agree to our{' '}
          <Text
            style={styles.termsLink}
            onPress={() =>
              navigate('AboutContentScreen', {data: AboutData[1]})
            }>
            Terms
          </Text>
          .
        </Text>

        <View style={styles.benefitsCard}>
          <View style={styles.includedPill}>
            <Text style={styles.includedText}>Included with Subscription</Text>
          </View>
          <View style={styles.benefitsSection}>
            {BENEFITS.map(item => (
              <View key={item.title} style={styles.benefitRow}>
                <VerifiedIcon width={22} height={22} />
                <View style={styles.benefitTextContainer}>
                  <Text style={styles.benefitTitle}>{item.title}</Text>
                  <Text style={styles.benefitDes}>{item.description}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#100E12',
  },
  header: {
    paddingHorizontal: 10,
    zIndex: 2,
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: H_PAD,
  },
  userImageContainer: {
    alignSelf: 'center',
    width: RING_SIZE,
    height: RING_SIZE,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  avatarRing: {
    width: RING_SIZE,
    height: RING_SIZE,
    borderRadius: RING_SIZE / 2,
    borderWidth: 4,
    borderColor: '#1AD655',
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  userImageStyle: {
    width: AVATAR_SIZE,
    height: AVATAR_SIZE,
    borderRadius: AVATAR_SIZE / 2,
  },
  badgeRow: {
    position: 'absolute',
    bottom: -2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  liveBadge: {
    backgroundColor: '#8800FF',
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 3,
    minWidth: 28,
    alignItems: 'center',
  },
  liveBadgeText: {
    fontSize: fontSize.f8,
    color: Colors.white,
    fontFamily: fonts['Poppins-Bold'],
    letterSpacing: 0.6,
  },
  vrBadge: {
    backgroundColor: '#0B63F6',
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 3,
    minWidth: 24,
    alignItems: 'center',
  },
  vrBadgeText: {
    fontSize: fontSize.f8,
    color: Colors.white,
    fontFamily: fonts['Poppins-Bold'],
    letterSpacing: 0.6,
  },
  userNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
    paddingHorizontal: 8,
    gap: 8,
  },
  userNameStyle: {
    fontSize: fontSize.f32,
    color: Colors.white,
    fontFamily: fonts['Poppins-SemiBold'],
    textAlign: 'center',
    maxWidth: '78%',
  },
  planContainer: {
    width: '100%',
    marginTop: 28,
    gap: 12,
  },
  unselectedPlanCard: {
    minHeight: 78,
    borderRadius: 10,
    overflow: 'hidden',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
  },
  selectedPlanBorder: {
    borderRadius: 12,
    padding: 4,
  },
  selectedPlanInner: {
    minHeight: 74,
    borderRadius: 8,
    overflow: 'hidden',
    justifyContent: 'center',
    backgroundColor: 'rgba(16, 14, 18, 0.92)',
  },
  planRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 22,
    zIndex: 1,
  },
  unselectedPlanRow: {
    opacity: 0.6,
  },
  planLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flexShrink: 1,
    paddingRight: 12,
  },
  planTitle: {
    fontSize: fontSize.f20,
    color: Colors.white,
    fontFamily: fonts['Poppins-SemiBold'],
  },
  planPrice: {
    fontSize: fontSize.f18,
    color: Colors.white,
    fontFamily: fonts['Poppins-SemiBold'],
  },
  popularBadge: {
    backgroundColor: '#1F9854',
    borderRadius: 3,
    paddingHorizontal: 6,
    paddingVertical: 2,
    minHeight: 17,
    justifyContent: 'center',
  },
  popularBadgeText: {
    fontSize: fontSize.f8,
    color: Colors.white,
    fontFamily: fonts['Poppins-Medium'],
  },
  bestValueBadge: {
    borderRadius: 3,
    paddingHorizontal: 6,
    paddingVertical: 2,
    minHeight: 17,
    justifyContent: 'center',
  },
  bestValueBadgeText: {
    fontSize: fontSize.f8,
    color: '#5E3E13',
    fontFamily: fonts['Poppins-Medium'],
  },
  subscribeBorder: {
    marginTop: 24,
    borderRadius: 23,
    padding: 1.5,
  },
  subscribeInner: {
    minHeight: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(16, 14, 18, 0.92)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  subscribeText: {
    fontSize: fontSize.f16,
    color: Colors.white,
    fontFamily: fonts['Poppins-SemiBold'],
  },
  terms: {
    fontSize: fontSize.f10,
    fontFamily: fonts['Poppins-Regular'],
    textAlign: 'left',
    color: '#8D8C8C',
    marginTop: 16,
    lineHeight: 18,
  },
  termsLink: {
    textDecorationLine: 'underline',
    color: '#8D8C8C',
  },
  benefitsCard: {
    marginTop: 42,
    borderRadius: 16,
    paddingHorizontal: 18,
    paddingTop: 30,
    paddingBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(47, 46, 46, 0.35)',
  },
  includedPill: {
    position: 'absolute',
    top: -13,
    alignSelf: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    minHeight: 27,
    paddingHorizontal: 16,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  includedText: {
    fontSize: fontSize.f12,
    fontFamily: fonts['Poppins-Medium'],
    color: Colors.white,
  },
  benefitsSection: {
    gap: 18,
  },
  benefitRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  benefitTextContainer: {
    flex: 1,
  },
  benefitTitle: {
    fontSize: fontSize.f16,
    fontFamily: fonts['Poppins-SemiBold'],
    color: Colors.white,
    marginBottom: 2,
  },
  benefitDes: {
    fontSize: fontSize.f13,
    fontFamily: fonts['Poppins-Regular'],
    color: '#8D8C8C',
    lineHeight: 20,
  },
});
