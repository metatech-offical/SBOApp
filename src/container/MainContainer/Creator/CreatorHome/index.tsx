import {StyleSheet, View} from 'react-native';
import React from 'react';
import {CreatorHomeProps} from '@navigation/screens';
import HomeHeader from '@components/ScreenLayouts/Home/HomeHeader';
import UserStatics from '@components/ScreenLayouts/Home/UserStatics';
import WishListSection from '@components/ScreenLayouts/Home/WishListSection';
import OrderAndTicketSection from '@components/ScreenLayouts/Home/OrderAndTicketSection';
import {ScrollView} from 'react-native-gesture-handler';
import CreatorActionSection from '@components/ScreenLayouts/Home/CreatorActionSection';
import AnimatedBackground from '@components/AnimationComponent/AnimationBackground';
import SubscriptionsScection from '@components/ScreenLayouts/Home/SubscriptionsScection';
import SuggestedAccountsSection from '@components/ScreenLayouts/Home/SuggestedAccountsSection';
import {
  useHomeStatisticsQuery,
  useUserSuggestedAccountQuery,
} from '@rtkServices/HomeService';
import Loader from '@components/CustomLoader/Loader';

const CreatorHome = ({navigation}: CreatorHomeProps) => {
  const {data, isLoading} = useHomeStatisticsQuery();
  const {data: suggestedAccount} = useUserSuggestedAccountQuery({
    page: 1,
    limit: 10,
  });

  return (
    <View style={{flex: 1}}>
      <AnimatedBackground
        animationSource={require('@assets/animations/AuthAnimation4.json')}
        backgroundColor="#1a1538"
        zIndex={0}
      />
      <HomeHeader isCreator={true} />
      {isLoading ? (
        <Loader visible={isLoading} />
      ) : (
        <ScrollView
          contentContainerStyle={styles.scrollView}
          showsVerticalScrollIndicator={false}>
          <CreatorActionSection navigation={navigation} />
          <UserStatics data={data} isCreator={true} />
          <SuggestedAccountsSection
            data={suggestedAccount?.data?.data || []}
            totalRecord={suggestedAccount?.data?.pagination?.totalRecords || 0}
          />
          <SubscriptionsScection />
          <WishListSection />
          <OrderAndTicketSection navigation={navigation} />
        </ScrollView>
      )}
    </View>
  );
};

export default CreatorHome;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  scrollView: {
    paddingVertical: 10,
    paddingBottom: 70,
  },
});
