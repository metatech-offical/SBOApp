import {Pressable, StyleSheet, View} from 'react-native';
import React from 'react';
import {UserHomeProps} from '@navigation/screens';
import HomeHeader from '@components/ScreenLayouts/Home/HomeHeader';
import FavoriteCreatorSection from '@components/ScreenLayouts/Home/FavoriteCreatorSection';
import SubscriptionsScection from '@components/ScreenLayouts/Home/SubscriptionsScection';
import WishListSection from '@components/ScreenLayouts/Home/WishListSection';
import OrderAndTicketSection from '@components/ScreenLayouts/Home/OrderAndTicketSection';
import {ScrollView} from 'react-native-gesture-handler';
import GlowBackground from '@components/AnimationComponent/GlowBackground';
import {hp} from '@constant/fontSize';
import {useUserSuggestedAccountQuery} from '@rtkServices/HomeService';
import SuggestedAccountsSection from '@components/ScreenLayouts/Home/SuggestedAccountsSection';
import SearchInput from '@components/CustomInputs/SearchInput';
import {DUMMY_SUGGESTED_ACCOUNTS} from '@utils/dummyHome';

const UserHome = ({navigation}: UserHomeProps) => {
  const {data: suggestedAccount} = useUserSuggestedAccountQuery({
    page: 1,
    limit: 10,
  });
  const apiSuggested = suggestedAccount?.data?.data || [];
  const suggestedAccounts =
    apiSuggested.length > 0 ? apiSuggested : DUMMY_SUGGESTED_ACCOUNTS;
  const suggestedTotal =
    apiSuggested.length > 0
      ? suggestedAccount?.data?.pagination?.totalRecords || 0
      : DUMMY_SUGGESTED_ACCOUNTS.length;

  return (
    <View style={styles.container}>
      <GlowBackground />
      <HomeHeader showLogo showBecomeCreator />
      <Pressable onPress={() => navigation.navigate('UserExplore')}>
        <View pointerEvents="none">
          <SearchInput
            value=""
            disabled
            placeholder="Search"
            placeholderTextColor="rgba(255,255,255,0.5)"
            containerStyle={styles.searchInput}
          />
        </View>
      </Pressable>
      <ScrollView
        contentContainerStyle={styles.scrollView}
        showsVerticalScrollIndicator={false}>
        <FavoriteCreatorSection />
        <SubscriptionsScection />
        <SuggestedAccountsSection
          data={suggestedAccounts}
          totalRecord={suggestedTotal}
        />
        <WishListSection />
        <OrderAndTicketSection navigation={navigation} variant="section" />
      </ScrollView>
    </View>
  );
};

export default UserHome;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    overflow: 'hidden',
  },
  searchInput: {
    marginHorizontal: 16,
    marginTop: 0,
    marginBottom: 4,
    height: 41,
    borderRadius: 8,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    paddingLeft: 16,
  },
  scrollView: {
    paddingVertical: hp('1'),
    paddingBottom: hp('10'),
  },
});
