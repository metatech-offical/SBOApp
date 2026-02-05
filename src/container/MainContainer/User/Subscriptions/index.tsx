import {FlatList, StyleSheet, View, Text, TouchableOpacity} from 'react-native';
import React, {useState, useCallback, useEffect} from 'react';
import AnimatedBackground from '@components/AnimationComponent/AnimationBackground';
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

  // Update creators data when response changes
  React.useEffect(() => {
    if (creatorsResponse?.data?.data) {
      if (creatorsPage === 1) {
        // First page - replace data
        setCreatorsData(creatorsResponse.data.data);
      } else {
        // Subsequent pages - append data
        setCreatorsData(prev => [...prev, ...creatorsResponse.data.data]);
      }

      // Check if there are more pages
      const total = creatorsResponse.data.total || 0;
      const currentTotal =
        creatorsData.length + creatorsResponse.data.data.length;
      setCreatorsHasMore(currentTotal < total);
    }
  }, [creatorsResponse?.data]);

  useEffect(() => {
    if (subscribersResponse?.data?.data) {
      if (subscribersPage === 1) {
        // First page - replace data
        setSubscribersData(subscribersResponse.data.data);
      } else {
        // Subsequent pages - append data
        setSubscribersData(prev => [...prev, ...subscribersResponse.data.data]);
      }

      // Check if there are more pages
      const total = subscribersResponse.data.total || 0;
      const currentTotal =
        subscribersData.length + subscribersResponse.data.data.length;
      setSubscribersHasMore(currentTotal < total);
    }
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
  const totalCount =
    activeTab === 'subscribed'
      ? creatorsResponse?.data?.total || 0
      : subscribersResponse?.data?.total || 0;

  return (
    <View style={styles.container}>
      <AnimatedBackground
        animationSource={require('@assets/animations/AuthAnimation4.json')}
        zIndex={0}
      />
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
          data={creatorsData}
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
          data={subscribersData}
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
