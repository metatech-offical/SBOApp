import {BottomTabScreenProps} from '@react-navigation/bottom-tabs';
import {NativeStackScreenProps} from '@react-navigation/native-stack';

export type AppStackParamList = {
  SplashScreen: undefined;
  AuthNavigator: undefined;
  MainNavigator: undefined;
};

export type SplashScreenProps = NativeStackScreenProps<
  AppStackParamList,
  'SplashScreen'
>;
export type AuthNavigatorProps = NativeStackScreenProps<
  AppStackParamList,
  'AuthNavigator'
>;
export type MainNavigatorProps = NativeStackScreenProps<
  AppStackParamList,
  'MainNavigator'
>;

// export type AuthStackParamList = {
//   LoginScreen: undefined;
//   SignUpWithEmail: undefined;
//   EmailOtp: {
//     type: 'email' | 'mobile';
//     email: string;
//     phoneNumber?: string;
//     uuid: string;
//   };
//   SignUpMobileInput: {uuid: string};
//   TakeUserName: {uuid: string};
//   TakePassword: {username: string; uuid: string};
//   LoginPassword: {email: string};
//   MobileFlowMobileInput: undefined;
//   MobileOtp: {
//     type?: 'email' | 'mobile';
//     email?: string;
//     uuid?: string;
//     phoneNumber?: string;
//   };
//   MobileFlowEmailInput: {uuid: string};
//   ForgotPassword: undefined;
//   ForgotOpt: {email: string};
//   ResetPassword: {email: string; otp: string};
//   LoginMobile: undefined;
//   CheckCreator: {uuid: string};
//   ChooseYourPlan: {uuid: string};
// };
export type AuthStackParamList = {
  LoginScreen: undefined;
  SignUpWithEmail: undefined;
  EmailOtp: {
    type: 'email' | 'mobile';
    confirmationResult: any;
    email: string;
    uuid: string;
    mobile?: string;
  };
  SignUpMobileInput: {uuid: string};
  TakeUserName: {uuid: string};
  TakePassword: {username: string; uuid: string};
  LoginPassword: {email: string};
  MobileFlowMobileInput: undefined;
  MobileOtp: {
    type: 'email' | 'mobile';
    confirmationResult: any;
    email: string;
    mobile?: string;
  };
  MobileFlowEmailInput: {uuid: string};
  ForgotPassword: undefined;
  ForgotOpt: {email: string};
  ResetPassword: {email: string; otp: string};
  LoginMobile: undefined;
  CheckCreator: {uuid: string};
  ChooseYourPlan: {uuid: string};
};

export type LoginScreenProps = NativeStackScreenProps<
  AuthStackParamList,
  'LoginScreen'
>;
export type SignUpWithEmailProps = NativeStackScreenProps<
  AuthStackParamList,
  'SignUpWithEmail'
>;
export type EmailOtpProps = NativeStackScreenProps<
  AuthStackParamList,
  'EmailOtp'
>;
export type SignUpMobileInputProps = NativeStackScreenProps<
  AuthStackParamList,
  'SignUpMobileInput'
>;
export type TakeUserNameProps = NativeStackScreenProps<
  AuthStackParamList,
  'TakeUserName'
>;
export type TakePasswordProps = NativeStackScreenProps<
  AuthStackParamList,
  'TakePassword'
>;

export type LoginPasswordProps = NativeStackScreenProps<
  AuthStackParamList,
  'LoginPassword'
>;

export type MobileFlowMobileInputProps = NativeStackScreenProps<
  AuthStackParamList,
  'MobileFlowMobileInput'
>;

export type MobileOtpProps = NativeStackScreenProps<
  AuthStackParamList,
  'MobileOtp'
>;

export type MobileFlowEmailInputProps = NativeStackScreenProps<
  AuthStackParamList,
  'MobileFlowEmailInput'
>;

export type ForgotPasswordProps = NativeStackScreenProps<
  AuthStackParamList,
  'ForgotPassword'
>;

export type ForgotOptProps = NativeStackScreenProps<
  AuthStackParamList,
  'ForgotOpt'
>;

export type ResetPasswordProps = NativeStackScreenProps<
  AuthStackParamList,
  'ResetPassword'
>;

export type LoginMobileProps = NativeStackScreenProps<
  AuthStackParamList,
  'LoginMobile'
>;

export type CheckCreatorProps = NativeStackScreenProps<
  AuthStackParamList,
  'CheckCreator'
>;

export type ChooseYourPlanProps = NativeStackScreenProps<
  AuthStackParamList,
  'ChooseYourPlan'
>;

export type MainStackParamList = {
  HomeScreen: undefined;
  UserMyActivity: undefined;
  CreatorMyActivity: undefined;
  CreateProduct: {
    itemId?: string | null;
    isEdit?: boolean | false;
    newCollectionId?: string;
  };
  CreateCollection: {collectionId?: string; fromProduct?: boolean};
  UserMerchandiseDetail: {
    collectionId: string;
    name: string;
    profilePicture: string;
    collectionImage: string;
  };
  ProductDetail: {_id: string};
  CartListScreen: undefined;
  Subscriptions: undefined;
  AddAddressScreen: {addressId?: string};
  SearchResultScreen: {searchQuery: string};
  UserSetting: undefined;
  CreatorSetting: undefined;
  AccountScreen: undefined;
  DeleteAccount: undefined;
  ReportProblem: undefined;
  SboSupport: undefined;
  AboutScreen: undefined;
  AboutContentScreen: {data: any};
  UserNotificationSetting: undefined;
  CreatorNotificationSetting: undefined;
  WishlistScreen: undefined;
  OrderHistory: undefined;
  BookingHistory: undefined;
  EditProfileScreen: undefined;
  UploadContent: undefined;
  VideoPreview: {video: any; type: string};
  VideoUploadScreen: {
    data: any;
    selectedCover?: string;
    timestamp?: number | null;
    formData?: {
      title?: string;
      description?: string;
      category?: any;
      streamTo?: string;
      tags?: string[];
    };
  };
  OtherUserProfile: {userId: string};
  ShortsUploadScreen: {
    data: any;
    selectedCover?: string;
    timestamp?: number | null;
    formData?: {
      title?: string;
      category?: any;
      streamTo?: string;
      tags?: string[];
    };
  };
  PostUploadScreen: undefined;
  ShortsFeed: {
    shortsId: string;
    type?: string;
    creatorId?: string;
    feedItems?: any[];
  };
  AddToPlaylist: {
    playlistName: string;
    playlistId: string;
    existingItems: any[];
  };
  SavedItem: undefined;
  BlockedUsersList: undefined;
  CreateEvent: {eventId?: string; isEdit?: boolean};
  EditEvent: {eventId: string};
  CreatorEventDetailScreen: {eventId: string};
  CollectionDetail: {collectionId: string};
  FollowAndFollowing: {userId: string; type: 'followers' | 'following'};
  CreatorProductDetail: {_id: string};
  OtherUserStoreScreen: {storeId: string; name: string; profilePicture: string};
  CreatorTicketingScreen: {userId: string};
  BookTIcket: undefined;
  BookedTicket: undefined;
  Checkout: undefined;
  FavoriteCreatorList: undefined;
  CreatLive: undefined;
  GetAllAddress: undefined;
  SubscriptionSettings: undefined;
  SubscriptionScreen: {profileData: UserProfile};
  LiveScreen: {formData: any};
  LivePlayer: undefined;
  NormalPlayer: undefined;
  LiveViewer: {liveID: string};
  CheckoutScreen: {cartData: CartItem[]; screenType: 'from_cart' | 'buy_now'};
  OrderConfirmation: undefined;
  OrdersManagement: undefined;
  OrderDetailScreen: {orderId: string; screenType: string};
  CategoryByResults: undefined;
  SuggestedAccounts: undefined;
  CollectionPreview: {collectionId: string; collectionName?: string};
  UpgradePlan: {currentPlan?: string};
  EditCoverScreen: {
    videoUrl: string;
    data: any;
    currentCover?: string;
    currentTimestamp?: number | null;
    screenType?: 'shorts' | 'video';
    formData?: {
      title?: string;
      description?: string;
      category?: any;
      streamTo?: string;
      tags?: string[];
    };
  };
  CreatorTicketDetailScreen: {eventId: string};
};

export type CreatorTicketDetailScreenProps = NativeStackScreenProps<
  MainStackParamList,
  'CreatorTicketDetailScreen'
>;

export type HomeScreenProps = NativeStackScreenProps<
  MainStackParamList,
  'HomeScreen'
>;
export type UserMyActivityProps = NativeStackScreenProps<
  MainStackParamList,
  'UserMyActivity'
>;
export type CreatorMyActivityProps = NativeStackScreenProps<
  MainStackParamList,
  'CreatorMyActivity'
>;

export type CreateProductProps = NativeStackScreenProps<
  MainStackParamList,
  'CreateProduct'
>;
export type CreateCollectionProps = NativeStackScreenProps<
  MainStackParamList,
  'CreateCollection'
>;
export type UserMerchandiseDetailProps = NativeStackScreenProps<
  MainStackParamList,
  'UserMerchandiseDetail'
>;
export type ProductDetailProps = NativeStackScreenProps<
  MainStackParamList,
  'ProductDetail'
>;
export type CartListScreenProps = NativeStackScreenProps<
  MainStackParamList,
  'CartListScreen'
>;
export type SubscriptionsProps = NativeStackScreenProps<
  MainStackParamList,
  'Subscriptions'
>;
export type AddAddressScreenProps = NativeStackScreenProps<
  MainStackParamList,
  'AddAddressScreen'
>;
export type SearchResultScreenProps = NativeStackScreenProps<
  MainStackParamList,
  'SearchResultScreen'
>;
export type UserSettingProps = NativeStackScreenProps<
  MainStackParamList,
  'UserSetting'
>;
export type CreatorSettingProps = NativeStackScreenProps<
  MainStackParamList,
  'CreatorSetting'
>;
export type AccountScreenProps = NativeStackScreenProps<
  MainStackParamList,
  'AccountScreen'
>;
export type DeleteAccountProps = NativeStackScreenProps<
  MainStackParamList,
  'DeleteAccount'
>;
export type ReportProblemProps = NativeStackScreenProps<
  MainStackParamList,
  'ReportProblem'
>;
export type SboSupportProps = NativeStackScreenProps<
  MainStackParamList,
  'SboSupport'
>;
export type AboutScreenProps = NativeStackScreenProps<
  MainStackParamList,
  'AboutScreen'
>;
export type AboutContentScreenProps = NativeStackScreenProps<
  MainStackParamList,
  'AboutContentScreen'
>;
export type UserNotificationSettingProps = NativeStackScreenProps<
  MainStackParamList,
  'UserNotificationSetting'
>;
export type CreatorNotificationSettingProps = NativeStackScreenProps<
  MainStackParamList,
  'CreatorNotificationSetting'
>;
export type WishlistScreenProps = NativeStackScreenProps<
  MainStackParamList,
  'WishlistScreen'
>;
export type OrderHistoryProps = NativeStackScreenProps<
  MainStackParamList,
  'OrderHistory'
>;
export type BookingHistoryProps = NativeStackScreenProps<
  MainStackParamList,
  'BookingHistory'
>;
export type EditProfileScreenProps = NativeStackScreenProps<
  MainStackParamList,
  'EditProfileScreen'
>;
export type UploadContentProps = NativeStackScreenProps<
  MainStackParamList,
  'UploadContent'
>;
export type VideoPreviewProps = NativeStackScreenProps<
  MainStackParamList,
  'VideoPreview'
>;
export type VideoUploadScreenProps = NativeStackScreenProps<
  MainStackParamList,
  'VideoUploadScreen'
>;
export type ShortsUploadScreenProps = NativeStackScreenProps<
  MainStackParamList,
  'ShortsUploadScreen'
>;
export type PostUploadScreenProps = NativeStackScreenProps<
  MainStackParamList,
  'PostUploadScreen'
>;
export type ShortsFeedProps = NativeStackScreenProps<
  MainStackParamList,
  'ShortsFeed'
>;
export type AddToPlaylistProps = NativeStackScreenProps<
  MainStackParamList,
  'AddToPlaylist'
>;
export type SavedItemProps = NativeStackScreenProps<
  MainStackParamList,
  'SavedItem'
>;
export type BlockedUsersListProps = NativeStackScreenProps<
  MainStackParamList,
  'BlockedUsersList'
>;
export type CreateEventProps = NativeStackScreenProps<
  MainStackParamList,
  'CreateEvent'
>;
export type EditEventProps = NativeStackScreenProps<
  MainStackParamList,
  'EditEvent'
>;
export type CreatorEventDetailScreenProps = NativeStackScreenProps<
  MainStackParamList,
  'CreatorEventDetailScreen'
>;
export type CollectionDetailProps = NativeStackScreenProps<
  MainStackParamList,
  'CollectionDetail'
>;
export type FollowAndFollowingProps = NativeStackScreenProps<
  MainStackParamList,
  'FollowAndFollowing'
>;

export type CreatorProductDetailProps = NativeStackScreenProps<
  MainStackParamList,
  'CreatorProductDetail'
>;
export type OtherUserStoreScreenProps = NativeStackScreenProps<
  MainStackParamList,
  'OtherUserStoreScreen'
>;
export type CreatorTicketingScreenProps = NativeStackScreenProps<
  MainStackParamList,
  'CreatorTicketingScreen'
>;
export type BookTIcketProps = NativeStackScreenProps<
  MainStackParamList,
  'BookTIcket'
>;

export type BookedTicketProps = NativeStackScreenProps<
  MainStackParamList,
  'BookedTicket'
>;

export type CheckoutProps = NativeStackScreenProps<
  MainStackParamList,
  'Checkout'
>;

export type FavoriteCreatorListProps = NativeStackScreenProps<
  MainStackParamList,
  'FavoriteCreatorList'
>;
export type CreatLiveProps = NativeStackScreenProps<
  MainStackParamList,
  'CreatLive'
>;
export type LiveScreenProps = NativeStackScreenProps<
  MainStackParamList,
  'LiveScreen'
>;
export type LivePlayerProps = NativeStackScreenProps<
  MainStackParamList,
  'LivePlayer'
>;
export type NormalPlayerProps = NativeStackScreenProps<
  MainStackParamList,
  'NormalPlayer'
>;
export type SubscriptionSettingsProps = NativeStackScreenProps<
  MainStackParamList,
  'SubscriptionSettings'
>;
export type SubscriptionScreenProps = NativeStackScreenProps<
  MainStackParamList,
  'SubscriptionScreen'
>;
export type CheckoutScreenProps = NativeStackScreenProps<
  MainStackParamList,
  'CheckoutScreen'
>;
export type OrderConfirmationProps = NativeStackScreenProps<
  MainStackParamList,
  'OrderConfirmation'
>;
export type GetAllAddressProps = NativeStackScreenProps<
  MainStackParamList,
  'GetAllAddress'
>;
export type OrdersManagementProps = NativeStackScreenProps<
  MainStackParamList,
  'OrdersManagement'
>;
export type OrderDetailScreenProps = NativeStackScreenProps<
  MainStackParamList,
  'OrderDetailScreen'
>;
export type CategoryByResultsProps = NativeStackScreenProps<
  MainStackParamList,
  'CategoryByResults'
>;
export type CollectionPreviewProps = NativeStackScreenProps<
  MainStackParamList,
  'CollectionPreview'
>;

export type UpgradePlanProps = NativeStackScreenProps<
  MainStackParamList,
  'UpgradePlan'
>;

export type EditCoverScreenProps = NativeStackScreenProps<
  MainStackParamList,
  'EditCoverScreen'
>;

// Creator Bottom Tab Screens
export type CreatorBottomTabParamList = {
  CreatorHome: undefined;
  CreatorExplore: undefined;
  CreatorVideos: undefined;
  CreatorTicketing: undefined;
  CreatorStore: undefined;
  CreatorProfile: undefined;
};

export type CreatorHomeProps = BottomTabScreenProps<
  CreatorBottomTabParamList,
  'CreatorHome'
>;
export type CreatorExploreProps = BottomTabScreenProps<
  CreatorBottomTabParamList,
  'CreatorExplore'
>;
export type CreatorVideosProps = BottomTabScreenProps<
  CreatorBottomTabParamList,
  'CreatorVideos'
>;
export type CreatorTicketingProps = BottomTabScreenProps<
  CreatorBottomTabParamList,
  'CreatorTicketing'
>;
export type CreatorStoreProps = BottomTabScreenProps<
  CreatorBottomTabParamList,
  'CreatorStore'
>;
export type CreatorProfileProps = BottomTabScreenProps<
  CreatorBottomTabParamList,
  'CreatorProfile'
>;
export type OtherUserProfileProps = NativeStackScreenProps<
  MainStackParamList,
  'OtherUserProfile'
>;
export type OtherUserProfileProps = NativeStackScreenProps<
  MainStackParamList,
  'OtherUserProfile'
>;

// User Bottom Tab Screens
export type UserBottomTabParamList = {
  UserHome: undefined;
  UserExplore: undefined;
  UserVideos: undefined;
  UserTicketing: undefined;
  UserMerchandise: undefined;
  UserProfile: undefined;
};

export type UserHomeProps = BottomTabScreenProps<
  UserBottomTabParamList,
  'UserHome'
>;
export type UserExploreProps = BottomTabScreenProps<
  UserBottomTabParamList,
  'UserExplore'
>;
export type UserVideosProps = BottomTabScreenProps<
  UserBottomTabParamList,
  'UserVideos'
>;
export type UserTicketingProps = BottomTabScreenProps<
  UserBottomTabParamList,
  'UserTicketing'
>;
export type UserMerchandiseProps = BottomTabScreenProps<
  UserBottomTabParamList,
  'UserMerchandise'
>;
export type UserProfileProps = BottomTabScreenProps<
  UserBottomTabParamList,
  'UserProfile'
>;

// Legacy types for backward compatibility
export type BottomTabParamList = {
  HomeTab: undefined;
};

export type HomeTabProps = BottomTabScreenProps<BottomTabParamList, 'HomeTab'>;
