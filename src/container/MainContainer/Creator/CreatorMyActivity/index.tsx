import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  FlatList,
  RefreshControl,
} from 'react-native';
import React, {useState, useCallback, useEffect} from 'react';
import StackHeader from '@components/CustomHeaders/StackHeader';
import {
  CalendarIcon,
  NotificationIcon1,
  OrderIcon,
  TicketIcon,
} from '@assets/svg/HomeScreenIcon';
import {navigate, navigateBack} from '@navigation/utils';
import SearchInput from '@components/CustomInputs/SearchInput';
import {Colors} from '@constant/colors';
import {fontSize, hp, wp} from '@constant/fontSize';
import {fonts} from '@constant/fontfamily';
import {ShowUserNameArray, tabs} from '@utils/data';
import AnimatedBackground from '@components/AnimationComponent/AnimationBackground';
import FilterSheet from '@components/CustomBottomSheet/FilterSheet';
import MyActivityFilter from '@components/ScreenLayouts/MyActivity/MyActivityFilter';
import {
  useGetAllNotificationQuery,
  useNotificationReadMutation,
} from '@rtkServices/HomeService';
import Loader from '@components/CustomLoader/Loader';
import NodataFound from '@components/DataEmpty/NodataFound';
import moment from 'moment';
import ActivityItemCard from '@components/ScreenLayouts/Home/ActivityItemCard';
import {RootState, useAppDispatch, useAppSelector} from '@store/index';
import {setHasNotifications} from '@store/NotificationManager';

interface ActivityFilter {
  fromDate: string | null;
  toDate: string | null;
  filter: string | null;
}

interface ActivityItem {
  id: string;
  type: 'ticket' | 'order' | 'other';
  timeAgo: string;
  description: string;
  senderId?: string;
  senderUsername?: string;
  contentType?: string;
  contentId?: string;
  content?: any;
  userId?: string;
}

const CreatorMyActivity = () => {
  const dispatch = useAppDispatch();
  const [activeTab, setActiveTab] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [refreshing, setRefreshing] = useState(false);
  const [readNotification] = useNotificationReadMutation();
  const user = useAppSelector((state: RootState) => state.user);

  const [ActivityFilter, setActivityFilter] = useState<ActivityFilter>({
    fromDate: null,
    toDate: null,
    filter: null,
  });

  const {
    data: notificationData,
    isLoading,
    refetch,
  } = useGetAllNotificationQuery({
    page: (currentPage - 1) * 20,
    limit: 20,
    fromDate: ActivityFilter.fromDate,
    toDate: ActivityFilter.toDate,
    search: searchQuery,
  });

  React.useEffect(() => {
    dispatch(setHasNotifications(false));
  }, []);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    setCurrentPage(1);
    await refetch();
    dispatch(setHasNotifications(false));
    setRefreshing(false);
  }, [refetch]);

  const handleLoadMore = () => {
    if (
      notificationData?.data?.pagination?.currentPage <
      notificationData?.data?.pagination?.totalPages
    ) {
      setCurrentPage(prev => prev + 1);
    }
  };

  const mapNotificationToActivityItem = (item: any): ActivityItem => {
    const isTicket = item?.contentType?.toLowerCase()?.includes('ticket');
    const isOrder = item?.contentType?.toLowerCase()?.includes('order');
    const showUsername = ShowUserNameArray?.some(s => s === item?.type);
    return {
      id: item._id,
      type: isTicket ? 'ticket' : isOrder ? 'order' : 'other',
      timeAgo: moment(item.createdAt).fromNow(),
      description: showUsername
        ? `${item?.sender?.username} ${item?.notificationText}`
        : item?.notificationText,

      senderId: item?.sender?._id ?? item?.senderId,
      senderUsername: item?.sender?.username,
      contentType: item?.contentType,
      contentId: item?.contentId,
      content: item?.content,
      userId: item?.userId,
    };
  };

  const serverActivities: ActivityItem[] =
    notificationData?.data?.data?.map(mapNotificationToActivityItem) || [];

  const filteredActivities = serverActivities?.filter(item => {
    if (activeTab === 1) return true;
    if (activeTab === 2) return item.type === 'order';
    if (activeTab === 3) return item.type === 'ticket';
    return false;
  });

  const handleNavigate = (item: any) => {
    if (
      item?.contentType === 'usercreatorsubscriptions' ||
      item?.contentType === 'posts'
    ) {
      navigate('OtherUserProfile', {
        userId: item?.senderId,
      });
    } else if (item?.contentType === 'streams') {
      if (item?.content?.type === 'video-live') {
      } else {
        navigate(
          'NormalPlayer' as never,
          {
            streamId: item?.contentId,
          } as never,
        );
      }
    } else if (item?.contentType === 'shorts') {
      navigate('ShortsFeed', {
        shortsId: item?.contentId,
      });
    } else if (item?.contentType === 'orders') {
      if (item?.content?.userId === item?.userId) {
        navigate('OrderDetailScreen', {
          orderId: item?.contentId,
          screenType: 'OrderHistory',
        });
      } else {
        navigate('OrderDetailScreen', {
          orderId: item?.contentId,
          screenType: 'OrderManagement',
        });
      }
    } else if (item?.contentType === null) {
      navigate('OtherUserProfile', {
        userId: item?.senderId,
      });
    }
  };

  const renderActivityItem = ({item}: {item: ActivityItem}) => {
    return (
      <ActivityItemCard
        title={item.description}
        date={item.timeAgo}
        icon={
          item.type === 'order' ? (
            <OrderIcon />
          ) : item.type === 'ticket' ? (
            <TicketIcon fill={Colors.white} />
          ) : (
            <NotificationIcon1 />
          )
        }
        onPress={() => handleNavigate(item)}
      />
    );
  };

  const handleSearchChange = (text: string) => {
    setSearchQuery(text);
    setCurrentPage(1); // Reset to first page when searching
  };

  const handleFilterApply = (filters: ActivityFilter) => {
    setActivityFilter(filters);
    setCurrentPage(1);
  };

  useEffect(() => {
    readNotificationApi();
  }, []);

  const readNotificationApi = async () => {
    await readNotification({}).then(res => {});
  };

  return (
    <View style={{flex: 1}}>
      <AnimatedBackground
        animationSource={require('@assets/animations/AuthAnimation4.json')}
        zIndex={0}
      />
      <StackHeader
        onBackPress={() => navigateBack()}
        title="My Activity"
        rightIconStyle={{backgroundColor: 'transparent', borderWidth: 0}}
        icon={<CalendarIcon />}
        rightIcon={true}
        onRightPress={() => setIsBottomSheetOpen(true)}
        showArrowDown={false}
      />
      <SearchInput
        value={searchQuery}
        onChangeText={handleSearchChange}
        placeholder="Search"
      />
      {isLoading && currentPage === 1 ? (
        <Loader visible={isLoading} />
      ) : (
        <>
          <View style={styles.tabsContainer}>
            {tabs.map(tab => (
              <TouchableOpacity
                key={tab.id}
                style={[styles.tab, activeTab === tab.id && styles.activeTab]}
                onPress={() => setActiveTab(tab.id)}>
                <Text
                  style={[
                    styles.tabText,
                    activeTab === tab.id && styles.activeTabText,
                  ]}>
                  {tab.title}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <FlatList
            data={filteredActivities}
            renderItem={renderActivityItem}
            keyExtractor={item => item.id.toString()}
            contentContainerStyle={styles.listContainer}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={<NodataFound />}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                tintColor={Colors.white}
                colors={[Colors.white]}
              />
            }
            onEndReached={handleLoadMore}
            onEndReachedThreshold={0.1}
            ListFooterComponent={
              currentPage <
              (notificationData?.data?.pagination?.totalPages || 1) ? (
                <View style={styles.loadingMore}>
                  <Loader visible={true} />
                </View>
              ) : null
            }
          />
        </>
      )}

      {isBottomSheetOpen && (
        <FilterSheet
          index={0}
          cuttomSnapPoints={['55%']}
          onClose={() => {
            console.log('close');
            setIsBottomSheetOpen(false);
          }}
          renderView={() => (
            <MyActivityFilter
              ActivityFilter={ActivityFilter}
              closeBottomSheet={() => setIsBottomSheetOpen(false)}
              onApplyFilter={handleFilterApply}
            />
          )}
          onSubmit={() => setIsBottomSheetOpen(false)}
        />
      )}
    </View>
  );
};
export default CreatorMyActivity;
const styles = StyleSheet.create({
  container: {
    marginVertical: hp('2%'),
    borderRadius: 10,
    overflow: 'hidden',
  },
  tabsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomWidth: 0,
    paddingHorizontal: wp('4%'),
    marginTop: hp('4%'),
  },
  tab: {
    alignItems: 'center',
    width: '30%',
    paddingHorizontal: wp('4%'),
    paddingBottom: hp('1%'),
  },
  activeTab: {
    borderBottomWidth: 1,
    borderColor: Colors.white,
  },
  tabText: {
    fontSize: fontSize.f18,
    color: Colors.white,
    fontFamily: fonts['Poppins-SemiBold'],
    opacity: 0.5,
  },
  activeTabText: {
    color: Colors.white,
    opacity: 1,
    fontFamily: fonts['Poppins-SemiBold'],
  },
  listContainer: {
    paddingHorizontal: wp('1%'),
    paddingTop: hp('2%'),
    paddingBottom: hp('10%'),
  },
  loadingMore: {
    paddingVertical: hp('2%'),
    alignItems: 'center',
  },
});
