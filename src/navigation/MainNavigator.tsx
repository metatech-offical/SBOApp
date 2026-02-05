import React, {useEffect} from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {MainStackParamList} from './screens';
import BottomTabNavigator from './BottomTabNavigator';
import notifee, {EventType} from '@notifee/react-native';
import {onMessageReceived} from '@utils/configNotification';
import messaging from '@react-native-firebase/messaging';
import CreateProduct from '@container/MainContainer/Creator/CreatorStore/AddProduct/CreateProduct';
import UserMyActivity from '@container/MainContainer/User/UserMyActivity';
import CreateCollection from '@container/MainContainer/Creator/CreatorStore/AddCollection/CreateCollection';
import UserMerchandiseDetail from '@container/MainContainer/Common/Merchandise/UserMerchandiseDetail';
import ProductDetail from '@container/MainContainer/Common/Merchandise/ProductDetail';
import CartListScreen from '@container/MainContainer/Common/Merchandise/CartListScreen';
import CreatorMyActivity from '@container/MainContainer/Creator/CreatorMyActivity';
import Subscriptions from '@container/MainContainer/User/Subscriptions';
import AddAddressScreen from '@container/MainContainer/Common/Merchandise/AddAddressScreen';
import SearchResultScreen from '@container/MainContainer/Creator/CreatorExplore/SearchResultScreen';
import UserSetting from '@container/MainContainer/User/UserSetting';
import CreatorSetting from '@container/MainContainer/Creator/CreatorSetting';
import AccountScreen from '@container/MainContainer/User/UserSetting/CommonSettingsFlow/AccountScreen';
import DeleteAccount from '@container/MainContainer/User/UserSetting/CommonSettingsFlow/DeleteAccount';
import ReportProblem from '@container/MainContainer/User/UserSetting/CommonSettingsFlow/ReportProblem';
import SboSupport from '@container/MainContainer/User/UserSetting/CommonSettingsFlow/SboSupport';
import AboutScreen from '@container/MainContainer/User/UserSetting/CommonSettingsFlow/AboutScreen';
import AboutContentScreen from '@container/MainContainer/User/UserSetting/CommonSettingsFlow/AboutContentScreen';
import UserNotificationSetting from '@container/MainContainer/User/UserSetting/CommonSettingsFlow/UserNotificationSetting';
import CreatorNotificationSetting from '@container/MainContainer/Creator/CreatorSetting/CreatorNotificationSetting';
import WishlistScreen from '@container/MainContainer/User/UserSetting/CommonSettingsFlow/WishlistScreen';
import OrderHistory from '@container/MainContainer/User/UserSetting/CommonSettingsFlow/OrderHistory';
import BookingHistory from '@container/MainContainer/User/UserSetting/CommonSettingsFlow/BookingHistory';
import EditProfileScreen from '@container/MainContainer/Creator/CreatorSetting/EditProfileScreen';
import UploadContent from '@container/MainContainer/Creator/UploadContant';
import VideoPreview from '@container/MainContainer/Creator/UploadContant/VideoPreview';
import VideoUploadScreen from '@container/MainContainer/Creator/UploadContant/VideoUploadScreen';
import OtherUserProfile from '@container/MainContainer/Common/OtherUserProfile';
import ShortsUploadScreen from '@container/MainContainer/Creator/UploadContant/ShortsUploadScreen';
import PostUploadScreen from '@container/MainContainer/Creator/UploadContant/PostUploadScreen';
import ShortsFeed from '@container/MainContainer/Creator/ShortsViewScreens/ShortsFeed';
import AddToPlaylist from '@components/ScreenLayouts/ProfileComponent/AddToPlaylist';
import SavedItem from '@container/MainContainer/Common/SavedItem/SavedItem';
import BlockedUsersList from '@container/MainContainer/Common/BlockedUsersList';
import CreateEvent from '@container/MainContainer/Creator/CreatorTicketing/Events/CreateEvent';
import CreatorEventDetailScreen from '@container/MainContainer/Creator/CreatorTicketing/CreatorEventDetailScreen';
import CollectionDetail from '@container/MainContainer/Creator/CreatorStore/OtherScreens/CollectionDetail';
import FollowAndFollowing from '@container/MainContainer/Common/SavedItem/FollowAndFollowing';
import CreatorProductDetail from '@container/MainContainer/Creator/CreatorStore/OtherScreens/CreatorProductDetail';
import CreatorTicketingScreen from '@container/MainContainer/Common/Ticketing/CreatorTicketingScreen';
import BookTIcket from '@container/MainContainer/Common/Ticketing/BookTIcket';
import OtherUserStoreScreen from '@components/ScreenLayouts/UserMerchandise/OtherUserStoreScreen';
import FavoriteCreatorList from '@container/MainContainer/User/UserHome/FavoriteCreatorList';
import GetAllAddress from '@container/MainContainer/Common/Merchandise/GetAllAddress';
import {useDispatch, useSelector} from 'react-redux';
import {RootState, useAppSelector} from '@store/index';
import {useGetCartItemsQuery} from '@rtkServices/UserMerchandiesService';
import {setCartCount} from '@store/Cart';
import SubscriptionSettings from '@container/MainContainer/Creator/SubscriptionSettings';
import SubscriptionScreen from '@container/MainContainer/Common/SubscriptionScreen';
import CreatLive from '@container/MainContainer/Creator/UploadContant/CreatLive';
import LiveScreen from '@container/MainContainer/Creator/UploadContant/LiveScreen';
import LivePlayer from '@container/MainContainer/Common/PlayersScreen/LivePlayer';
import NormalPlayer from '@container/MainContainer/Common/PlayersScreen/NormalPlayer';
import CheckoutScreen from '@container/MainContainer/Common/Merchandise/CheckoutScreen';
import OrderConfirmation from '@container/MainContainer/Common/Merchandise/OrderConfirmation';
import OrdersManagement from '@container/MainContainer/Common/Merchandise/OrdersManagement';
import OrderDetailScreen from '@container/MainContainer/Common/Merchandise/OrderDetailScreen';
import CategoryByResults from '@container/MainContainer/Common/CategoryByResults.tsx';
import LiveViewer from '@container/MainContainer/Common/LiveViewer';
import SuggestedAccounts from '@container/MainContainer/Common/SuggestedAccounts';
import CollectionPreview from '@container/MainContainer/Creator/CreatorStore/AddCollection/CollectionPreview';
import UpgradePlan from '@container/MainContainer/Common/UpgradePlan';
import {setHasNotifications} from '@store/NotificationManager';
import {useGetUserProfileByIdQuery} from '@rtkServices/ProfileService';
import {updateUser} from '@store/UserManager';
import EditCoverScreen from '@container/MainContainer/Common/EditCoverScreen';
import BookedTicket from '@container/MainContainer/Common/Ticketing/BookedTicket';
import EditEvent from '@container/MainContainer/Creator/CreatorTicketing/Events/EditEvent';
import Checkout from '@container/MainContainer/Common/Ticketing/Checkout';
import CreatorTicketDetailScreen from '@container/MainContainer/Creator/CreatorTicketing/CreatorTicketDetailScreen';

const MainStack = createNativeStackNavigator<MainStackParamList>();

export default function MainNavigator() {
  const dispatch = useDispatch();
  const cartCount = useSelector(
    (state: RootState) => state.cart?.cartItemsCount,
  );
  const {user} = useAppSelector((state: RootState) => state.user);
  const {data: cartListData} = useGetCartItemsQuery({page: 1, limit: 10});
  const {data} = useGetUserProfileByIdQuery({id: user?._id});

  useEffect(() => {
    if (data?.data) {
      dispatch(updateUser(data.data));
    }
  }, [data, user?._id]);

  useEffect(() => {
    if (cartListData) {
      if (cartCount !== cartListData?.data?.totalCartItems) {
        dispatch(setCartCount(cartListData?.data?.totalCartItems));
      }
    }
  }, [cartListData]);

  useEffect(() => {
    let lastNotificationId: any = null;
    const handleNotification = async (res: any) => {
      const notificationId = res?.messageId;
      if (notificationId && notificationId !== lastNotificationId) {
        lastNotificationId = notificationId;
        if (res && res !== undefined && res !== null) {
          onMessageReceived(res?.notification);
          dispatch(setHasNotifications(true));
        }
      }
    };
    const unsubscribeMessage = messaging().onMessage(handleNotification);
    return () => {
      unsubscribeMessage();
    };
  }, []);
  useEffect(() => {
    notifee.onBackgroundEvent(async ({type, detail}) => {
      switch (type) {
        case EventType.DISMISSED:
          break;
        case EventType.PRESS:
          dispatch(setHasNotifications(true));
          break;
      }
    });
    return notifee.onForegroundEvent(async ({type, detail}) => {
      switch (type) {
        case EventType.DISMISSED:
          break;
        case EventType.PRESS:
          dispatch(setHasNotifications(true));
          break;
      }
    });
  }, []);

  return (
    <MainStack.Navigator
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
      }}>
      <MainStack.Screen
        name={'HomeScreen'}
        options={{headerShown: false}}
        component={BottomTabNavigator}
      />
      {/* //Creator screens */}
      <MainStack.Screen
        name={'CreatorMyActivity'}
        options={{headerShown: false}}
        component={CreatorMyActivity}
      />
      <MainStack.Screen
        name={'CreateProduct'}
        options={{headerShown: false}}
        component={CreateProduct}
      />
      <MainStack.Screen
        name={'CreateCollection'}
        options={{headerShown: false}}
        component={CreateCollection}
      />
      <MainStack.Screen
        name={'CreateEvent'}
        options={{headerShown: false}}
        component={CreateEvent}
      />
      <MainStack.Screen
        name={'EditEvent'}
        options={{headerShown: false}}
        component={EditEvent}
      />
      <MainStack.Screen
        name={'CreatorEventDetailScreen'}
        options={{headerShown: false}}
        component={CreatorEventDetailScreen}
      />
      <MainStack.Screen
        name={'CreatorTicketDetailScreen'}
        options={{headerShown: false}}
        component={CreatorTicketDetailScreen}
      />
      {/* //User screens */}
      <MainStack.Screen
        name={'UserMyActivity'}
        options={{headerShown: false}}
        component={UserMyActivity}
      />
      <MainStack.Screen
        name={'UserMerchandiseDetail'}
        options={{headerShown: false}}
        component={UserMerchandiseDetail}
      />
      <MainStack.Screen
        name={'ProductDetail'}
        options={{headerShown: false}}
        component={ProductDetail}
      />
      <MainStack.Screen
        name={'CartListScreen'}
        options={{headerShown: false}}
        component={CartListScreen}
      />
      <MainStack.Screen
        name={'Subscriptions'}
        options={{headerShown: false}}
        component={Subscriptions}
      />
      <MainStack.Screen
        name={'AddAddressScreen'}
        options={{headerShown: false}}
        component={AddAddressScreen}
      />
      <MainStack.Screen
        name={'SearchResultScreen'}
        options={{headerShown: false}}
        component={SearchResultScreen}
      />
      <MainStack.Screen
        name={'UserSetting'}
        options={{headerShown: false}}
        component={UserSetting}
      />
      <MainStack.Screen
        name={'CreatorSetting'}
        options={{headerShown: false}}
        component={CreatorSetting}
      />
      <MainStack.Screen
        name={'AccountScreen'}
        options={{headerShown: false}}
        component={AccountScreen}
      />
      <MainStack.Screen
        name={'DeleteAccount'}
        options={{headerShown: false}}
        component={DeleteAccount}
      />
      <MainStack.Screen
        name={'ReportProblem'}
        options={{headerShown: false}}
        component={ReportProblem}
      />
      <MainStack.Screen
        name={'SboSupport'}
        options={{headerShown: false}}
        component={SboSupport}
      />
      <MainStack.Screen
        name={'AboutScreen'}
        options={{headerShown: false}}
        component={AboutScreen}
      />
      <MainStack.Screen
        name={'AboutContentScreen'}
        options={{headerShown: false}}
        component={AboutContentScreen}
      />
      <MainStack.Screen
        name={'UserNotificationSetting'}
        options={{headerShown: false}}
        component={UserNotificationSetting}
      />
      <MainStack.Screen
        name={'CreatorNotificationSetting'}
        options={{headerShown: false}}
        component={CreatorNotificationSetting}
      />
      <MainStack.Screen
        name={'WishlistScreen'}
        options={{headerShown: false}}
        component={WishlistScreen}
      />
      <MainStack.Screen
        name={'OrderHistory'}
        options={{headerShown: false}}
        component={OrderHistory}
      />
      <MainStack.Screen
        name={'BookingHistory'}
        options={{headerShown: false}}
        component={BookingHistory}
      />
      <MainStack.Screen
        name={'EditProfileScreen'}
        options={{headerShown: false}}
        component={EditProfileScreen}
      />
      <MainStack.Screen
        name={'UploadContent'}
        options={{headerShown: false}}
        component={UploadContent}
      />
      <MainStack.Screen
        name={'VideoPreview'}
        options={{headerShown: false}}
        component={VideoPreview}
      />
      <MainStack.Screen
        name={'VideoUploadScreen'}
        options={{headerShown: false}}
        component={VideoUploadScreen}
      />

      {/* //Common screens */}
      <MainStack.Screen
        name={'OtherUserProfile'}
        options={{headerShown: false}}
        component={OtherUserProfile}
      />
      <MainStack.Screen
        name={'ShortsUploadScreen'}
        options={{headerShown: false}}
        component={ShortsUploadScreen}
      />
      <MainStack.Screen
        name={'PostUploadScreen'}
        options={{headerShown: false}}
        component={PostUploadScreen}
      />
      <MainStack.Screen
        name={'ShortsFeed'}
        options={{headerShown: false}}
        component={ShortsFeed}
      />
      <MainStack.Screen
        name={'AddToPlaylist'}
        options={{headerShown: false}}
        component={AddToPlaylist}
      />

      {/* //Common screens */}
      <MainStack.Screen
        name={'FollowAndFollowing'}
        options={{headerShown: false}}
        component={FollowAndFollowing}
      />
      <MainStack.Screen
        name={'SavedItem'}
        options={{headerShown: false}}
        component={SavedItem}
      />
      <MainStack.Screen
        name={'BlockedUsersList'}
        options={{headerShown: false}}
        component={BlockedUsersList}
      />
      <MainStack.Screen
        name={'CollectionDetail'}
        options={{headerShown: false}}
        component={CollectionDetail}
      />
      <MainStack.Screen
        name={'OtherUserStoreScreen'}
        options={{headerShown: false}}
        component={OtherUserStoreScreen}
      />
      <MainStack.Screen
        name={'CreatorProductDetail'}
        options={{headerShown: false}}
        component={CreatorProductDetail}
      />
      <MainStack.Screen
        name={'CreatorTicketingScreen'}
        options={{headerShown: false}}
        component={CreatorTicketingScreen}
      />
      <MainStack.Screen
        name={'BookTIcket'}
        options={{headerShown: false}}
        component={BookTIcket}
      />
      <MainStack.Screen
        name={'BookedTicket'}
        options={{headerShown: false}}
        component={BookedTicket}
      />
      <MainStack.Screen
        name={'Checkout'}
        options={{headerShown: false}}
        component={Checkout}
      />

      <MainStack.Screen
        name={'FavoriteCreatorList'}
        options={{headerShown: false}}
        component={FavoriteCreatorList}
      />
      <MainStack.Screen
        name={'GetAllAddress'}
        options={{headerShown: false}}
        component={GetAllAddress}
      />
      <MainStack.Screen
        name={'SubscriptionSettings'}
        options={{headerShown: false}}
        component={SubscriptionSettings}
      />
      <MainStack.Screen
        name={'SubscriptionScreen'}
        options={{headerShown: false}}
        component={SubscriptionScreen}
      />
      <MainStack.Screen
        name={'CreatLive'}
        options={{headerShown: false}}
        component={CreatLive}
      />
      {/* <MainStack.Screen
        name={''}
        options={{headerShown: false}}
        component={LiveScreenAdvanced}
      /> */}
      <MainStack.Screen
        name={'LiveScreen'}
        options={{headerShown: false}}
        component={LiveScreen}
      />
      <MainStack.Screen
        name={'LivePlayer'}
        options={{headerShown: false}}
        component={LivePlayer}
      />
      <MainStack.Screen
        name={'NormalPlayer'}
        options={{headerShown: false}}
        component={NormalPlayer}
      />
      <MainStack.Screen
        name={'CheckoutScreen'}
        options={{headerShown: false}}
        component={CheckoutScreen}
      />
      <MainStack.Screen
        name={'OrderConfirmation'}
        options={{headerShown: false}}
        component={OrderConfirmation}
      />
      <MainStack.Screen
        name={'OrdersManagement'}
        options={{headerShown: false}}
        component={OrdersManagement}
      />
      <MainStack.Screen
        name={'OrderDetailScreen'}
        options={{headerShown: false}}
        component={OrderDetailScreen}
      />
      <MainStack.Screen
        name={'CategoryByResults'}
        options={{headerShown: false}}
        component={CategoryByResults}
      />

      <MainStack.Screen
        name={'LiveViewer'}
        options={{headerShown: false}}
        component={LiveViewer}
      />
      <MainStack.Screen
        name={'SuggestedAccounts'}
        options={{headerShown: false}}
        component={SuggestedAccounts}
      />
      <MainStack.Screen
        name={'CollectionPreview'}
        options={{headerShown: false}}
        component={CollectionPreview}
      />
      <MainStack.Screen
        name={'UpgradePlan'}
        options={{headerShown: false}}
        component={UpgradePlan}
      />
      <MainStack.Screen
        name={'EditCoverScreen'}
        options={{headerShown: false}}
        component={EditCoverScreen}
      />
    </MainStack.Navigator>
  );
}
