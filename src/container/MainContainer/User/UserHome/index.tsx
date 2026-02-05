import {StyleSheet, View} from 'react-native';
import React from 'react';
import {UserHomeProps} from '@navigation/screens';
import HomeHeader from '@components/ScreenLayouts/Home/HomeHeader';
import UserStatics from '@components/ScreenLayouts/Home/UserStatics';
import FavoriteCreatorSection from '@components/ScreenLayouts/Home/FavoriteCreatorSection';
import SubscriptionsScection from '@components/ScreenLayouts/Home/SubscriptionsScection';
import WishListSection from '@components/ScreenLayouts/Home/WishListSection';
import OrderAndTicketSection from '@components/ScreenLayouts/Home/OrderAndTicketSection';
import {ScrollView} from 'react-native-gesture-handler';
import AnimatedBackground from '@components/AnimationComponent/AnimationBackground';
import {hp} from '@constant/fontSize';
import {
  useHomeStatisticsQuery,
  useUserSuggestedAccountQuery,
} from '@rtkServices/HomeService';
import Loader from '@components/CustomLoader/Loader';
import SuggestedAccountsSection from '@components/ScreenLayouts/Home/SuggestedAccountsSection';

const UserHome = ({navigation}: UserHomeProps) => {
  const {data, isLoading} = useHomeStatisticsQuery();
  const {data: suggestedAccount} = useUserSuggestedAccountQuery({
    page: 1,
    limit: 10,
  });

  return (
    <View style={styles.container}>
      <AnimatedBackground
        animationSource={require('@assets/animations/AuthAnimation4.json')}
        backgroundColor="#1a1538"
        zIndex={0}
      />
      <HomeHeader />
      {isLoading ? (
        <Loader visible={isLoading} />
      ) : (
        <ScrollView
          contentContainerStyle={styles.scrollView}
          showsVerticalScrollIndicator={false}>
          <UserStatics data={data} isCreator={false} />
          <SuggestedAccountsSection
            data={suggestedAccount?.data?.data || []}
            totalRecord={suggestedAccount?.data?.pagination?.totalRecords || 0}
          />
          <FavoriteCreatorSection />
          <SubscriptionsScection />
          <WishListSection />
          <OrderAndTicketSection navigation={navigation} />
        </ScrollView>
      )}
    </View>
  );
};

export default UserHome;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  scrollView: {
    paddingVertical: hp('2'),
    paddingBottom: hp('10'),
  },
});
