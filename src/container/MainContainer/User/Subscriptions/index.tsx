import {FlatList, StyleSheet, View, Text, TouchableOpacity} from 'react-native';
import React, {useState, useCallback, useEffect} from 'react';
import GlowBackground from '@components/AnimationComponent/GlowBackground';
import StackHeader from '@components/CustomHeaders/StackHeader';
import {navigateBack} from '@navigation/utils';
import {UserIcon} from '@assets/svg/CommonIcons';
import SubscriptionsListCard from '@components/Cards/SubscriptionsListCard';
import {
  useGetMySubscribedCreatorsQuery,
  useGetMySubscribersListQuery,
  useUnsubscribeFromCreatorMutation,
} from '@rtkServices/SubcriptionService';
import Loader from '@components/CustomLoader/Loader';
import NodataFound from '@components/DataEmpty/NodataFound';
import {Colors} from '@constant/colors';
import {fontSize, hp, wp} from '@constant/fontSize';
import {fonts} from '@constant/fontfamily';
import {SubscriptionTabs} from '@utils/data';
import CustomRefreshControler from '@components/CustomLoader/CustomRefreshControler';
import SubscriberItem from '@components/ScreenLayouts/Home/SubscriberItem';
import {useToastMessage} from '@hooks/useToastMessage';
import {
  DUMMY_SUBSCRIBED_CREATORS,
  DUMMY_SUBSCRIBERS,
  isDummyHomeId,
} from '@utils/dummyHome';

type TabType = 'subscribed' | 'subscribers';

export default function Subscriptions() {
  const {showError, showSuccess} = useToastMessage();
  const [activeTab, setActiveTab] = useState<TabType>('subscribed');
  const [unsubscribe] = useUnsubscribeFromCreatorMutation();

  // Pagination state for subscribed creators
  const [creatorsPage, setCreatorsPage] = useState(1);
  const [creatorsData, setCreatorsData] = useState<SubscribedCreator[]>([]);
  const [creatorsHasMore, setCreatorsHasMore] = useState(true);

  // Pagination state for subscribers
  const [subscribersPage, setSubscribersPage] = useState(1);
  const [subscribersData, setSubscribersData] = useState<Subscriber[]>([]);
  const [subscribersHasMore, setSubscribersHasMore] = useState(true);

  const {
    data: creatorsResponse,
    isLoading: creatorsLoading,
    isFetching: creatorsFetching,
  } = useGetMySubscribedCreatorsQuery({
    search: '',
    page: creatorsPage,
    limit: 10,
    sort: 'desc',
  });

  const {
    data: subscribersResponse,
    isLoading: subscribersLoading,
    isFetching: subscribersFetching,
  } = useGetMySubscribersListQuery({
    search: '',
    page: subscribersPage,
    limit: 10,
    sort: 'desc',
  });

  React.useEffect(() => {
    const next = creatorsResponse?.data?.data;
    if (!next) {
      return;
    }
    if (creatorsPage === 1) {
      const seeded = next.length > 0 ? next : DUMMY_SUBSCRIBED_CREATORS;
      setCreatorsData(seeded);
      setCreatorsHasMore(
        next.length > 0 && seeded.length < (creatorsResponse.data.total || 0),
      );
      return;
    }
    setCreatorsData(prev => [...prev, ...next]);
    const total = creatorsResponse.data.total || 0;
    setCreatorsHasMore(creatorsData.length + next.length < total);
  }, [creatorsResponse?.data]);

  useEffect(() => {
    const next = subscribersResponse?.data?.data;
    if (!next) {
      return;
    }
    if (subscribersPage === 1) {
      const seeded = next.length > 0 ? next : DUMMY_SUBSCRIBERS;
      setSubscribersData(seeded);
      setSubscribersHasMore(
        next.length > 0 &&
          seeded.length < (subscribersResponse.data.total || 0),
      );
      return;
    }
    setSubscribersData(prev => [...prev, ...next]);
    const total = subscribersResponse.data.total || 0;
    setSubscribersHasMore(subscribersData.length + next.length < total);
  }, [subscribersResponse?.data]);

  // Reset pagination when tab changes
  React.useEffect(() => {
    if (activeTab === 'subscribed') {
      setCreatorsPage(1);
      setCreatorsData([]);
      setCreatorsHasMore(true);
    } else {
      setSubscribersPage(1);
      setSubscribersData([]);
      setSubscribersHasMore(true);
    }
  }, [activeTab]);

  const handleUnsubscribe = (creatorId: string) => {
    if (isDummyHomeId(creatorId)) {
      setCreatorsData(prev => prev.filter(item => item._id !== creatorId));
      return;
    }
    unsubscribe({creatorId})
      .unwrap()
      .then(() => {
        showSuccess('Unsubscribed successfully');
        // Remove the unsubscribed creator from the list
        setCreatorsData(prev => prev.filter(item => item._id !== creatorId));
      })
      .catch(error => {
        showError(error?.data?.message || 'Something went wrong');
      });
  };

  const handleLoadMoreCreators = useCallback(() => {
    if (creatorsHasMore && !creatorsLoading && !creatorsFetching) {
      setCreatorsPage(prev => prev + 1);
    }
  }, [creatorsHasMore, creatorsLoading, creatorsFetching]);

  const handleLoadMoreSubscribers = useCallback(() => {
    if (subscribersHasMore && !subscribersLoading && !subscribersFetching) {
      setSubscribersPage(prev => prev + 1);
    }
  }, [subscribersHasMore, subscribersLoading, subscribersFetching]);

  const handleRefreshCreators = useCallback(() => {
    setCreatorsPage(1);
    setCreatorsData([]);
    setCreatorsHasMore(true);
  }, []);

  const handleRefreshSubscribers = useCallback(() => {
    setSubscribersPage(1);
    setSubscribersData([]);
    setSubscribersHasMore(true);
  }, []);

  const renderTab = (tab: {id: string; title: string}) => (
    <TouchableOpacity
      key={tab.id}
      style={[styles.tab, activeTab === tab.id && styles.activeTab]}
      onPress={() => setActiveTab(tab.id as TabType)}>
      <Text
        style={[styles.tabText, activeTab === tab.id && styles.activeTabText]}>
        {tab.title}
      </Text>
    </TouchableOpacity>
  );

  const renderCreatorItem = ({item}: {item: SubscribedCreator}) => (
    <SubscriptionsListCard
      item={item}
      onUnsubscribe={() => handleUnsubscribe(item?._id)}
    />
  );

  const renderSubscriberItem = ({item}: {item: Subscriber}) => (
    <SubscriberItem item={item} />
  );

  const isLoading =
    activeTab === 'subscribed' ? creatorsLoading : subscribersLoading;
  const isFetching =
    activeTab === 'subscribed' ? creatorsFetching : subscribersFetching;
  const displayCreators =
    creatorsData.length > 0 || creatorsLoading
      ? creatorsData
      : DUMMY_SUBSCRIBED_CREATORS;
  const displaySubscribers =
    subscribersData.length > 0 || subscribersLoading
      ? subscribersData
      : DUMMY_SUBSCRIBERS;
  const totalCount =
    activeTab === 'subscribed'
      ? creatorsResponse?.data?.total || displayCreators.length
      : subscribersResponse?.data?.total || displaySubscribers.length;

  return (
    <View style={styles.container}>
      <GlowBackground />
      <StackHeader
        onBackPress={() => navigateBack()}
        title="Subscriptions"
        rightIconStyle={{backgroundColor: 'transparent', borderWidth: 0}}
        rightIcon={true}
        rightIconText={`${totalCount}`}
        icon={<UserIcon />}
        showArrowDown={false}
      />

      {/* Tab Section - Using SubscriptionTabs array */}
      <View style={styles.tabContainer}>{SubscriptionTabs.map(renderTab)}</View>

      <Loader
        visible={isLoading && (creatorsPage === 1 || subscribersPage === 1)}
      />

      {activeTab === 'subscribed' ? (
        <FlatList
          data={displayCreators}
          keyExtractor={item => item?._id}
          renderItem={renderCreatorItem}
          ListEmptyComponent={!isLoading ? <NodataFound /> : null}
          onEndReached={handleLoadMoreCreators}
          onEndReachedThreshold={0.1}
          refreshControl={
            <CustomRefreshControler
              refreshing={isFetching && creatorsPage === 1}
              onRefresh={handleRefreshCreators}
            />
          }
          contentContainerStyle={styles.subscribersListContainer}
          ListFooterComponent={
            creatorsPage > 1 && creatorsLoading ? (
              <View style={styles.loaderContainer}>
                <Loader visible={true} />
              </View>
            ) : null
          }
        />
      ) : (
        <FlatList
          data={displaySubscribers}
          keyExtractor={item => item?._id}
          renderItem={renderSubscriberItem}
          ListEmptyComponent={!isLoading ? <NodataFound /> : null}
          onEndReached={handleLoadMoreSubscribers}
          onEndReachedThreshold={0.1}
          refreshControl={
            <CustomRefreshControler
              refreshing={isFetching && subscribersPage === 1}
              onRefresh={handleRefreshSubscribers}
            />
          }
          contentContainerStyle={styles.subscribersListContainer}
          ListFooterComponent={
            subscribersPage > 1 && subscribersLoading ? (
              <View style={styles.loaderContainer}>
                <Loader visible={true} />
              </View>
            ) : null
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  // Updated tab styles to match Follow/Following design
  tabContainer: {
    flexDirection: 'row',
    marginHorizontal: 20,
    marginVertical: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 25,
    padding: 5,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 20,
  },
  activeTab: {
    backgroundColor: Colors.white,
  },
  tabText: {
    fontFamily: fonts['Poppins-Medium'],
    fontSize: fontSize.f12,
    color: Colors.white,
  },
  activeTabText: {
    color: Colors.black,
  },
  subscribersListContainer: {
    paddingHorizontal: wp('4%'),
    paddingBottom: hp('2%'),
  },
  loaderContainer: {
    paddingVertical: 20,
    alignItems: 'center',
  },
});
