export const data = [];
export const ProductTabData = [
  {
    id: 1,
    title: 'Product Info',
  },
  {
    id: 2,
    title: 'Product Media',
  },
];
export const SEARCH_RESULT_DATA = [
  {
    id: 1,
    title: 'Videos',
  },
  {
    id: 2,
    title: 'Shorts',
  },
  {
    id: 3,
    title: 'Users',
  },
];
export const ListData = [
  {
    id: 1,
    name: 'Add a product',
    screen: 'CreateProduct',
  },
  {
    id: 2,
    name: 'Start a collection',
    screen: 'CreateCollection',
  },
];
export const planData = {
  features: [
    'Live Streaming',
    'Verification',
    'Upload Content',
    'Monetize Content',
    'Offer Subscriptions',
    'Video Quality',
  ],
  plans: [
    {
      name: 'User',
      price: '$0/M',
      features: ['PPV', false, false, false, false, '1080p'],
      backgroundColor: '#E24C4B',
    },
    {
      name: 'Creator',
      price: '$0/M',
      features: [true, true, true, true, true, 'Upto 8K'],
      backgroundColor: '#1C1C1E',
    },
  ],
};
export const tabs = [
  {id: 1, title: 'All'},
  {id: 2, title: 'Orders'},
  {id: 3, title: 'Tickets'},
];
export const creatorTabs = [
  {id: 1, title: 'All'},
  {id: 2, title: 'Orders'},
  {id: 3, title: 'Tickets'},
  {id: 4, title: 'Videos'},
];
export const creatorActionData = [
  {
    id: 1,
    title: 'Create new event',
    screen: 'CreateEvent',
  },
  {
    id: 2,
    title: 'Add merch',
    screen: 'CreateProduct',
  },
  {
    id: 3,
    title: 'Create a new post',
    screen: 'PostUploadScreen',
  },
  // {
  //   id: 4,
  //   title: 'My earnings',
  //   screen: 'MyEarnings',
  // },
  {
    id: 5,
    title: 'Manage Orders',
    screen: 'OrdersManagement',
  },
];
export const ProductQuantityData = [
  {
    id: 1,
    name: '1',
  },
  {
    id: 2,
    name: '2',
  },
  {
    id: 3,
    name: '3',
  },
  {
    id: 4,
    name: '4',
  },
  {
    id: 5,
    name: '5',
  },
];
export const ActivityFilterData = [
  {
    id: 1,
    name: 'Today',
    value: 'today',
  },
  {
    id: 2,
    name: 'This Week',
    value: 'thisWeek',
  },
  {
    id: 3,
    name: 'This Month',
    value: 'thisMonth',
  },
];
export const TABS = ['For you', 'Shorts', 'Live'];
export const DeeteOptionData = [
  {
    id: 1,
    label: 'Privacy concerns',
    value: 'Privacy concerns',
  },
  {
    id: 2,
    label: 'Trouble getting started',
    value: 'Trouble getting started',
  },
  {
    id: 3,
    label: 'Have a new account',
    value: 'Have a new account',
  },
  {
    id: 4,
    label: 'Something else',
    value: 'Something else',
  },
];
export const ReportProblemData = [
  {
    id: 1,
    label: 'Spam or abuse',
    value: 'Spam or abuse',
  },
  {
    id: 2,
    label: 'Something isn`t working',
    value: 'Something isn`t working',
  },
  {
    id: 3,
    label: 'Inappropriate content',
    value: 'Inappropriate content',
  },
  {
    id: 4,
    label: 'Something else',
    value: 'Something else',
  },
];
export const UserSettingsData = [
  {
    section: 'Account',
    data: [
      {
        id: 1,
        title: 'Edit Profile',
        icon: 'UserIcon',
        screen: 'EditProfile',
        badge: null,
        image: require('@assets/images/EditProfile.png'),
      },
      {
        id: 2,
        title: 'Saved items',
        icon: 'SavedIcon',
        screen: 'SavedItem',
        badge: null,
        image: require('@assets/images/SavedIcon.png'),
      },
      {
        id: 3,
        title: 'Blocked',
        icon: 'blockIcon',
        screen: 'BlockedUsersList',
        badge: null,
        image: require('@assets/images/blockIcon.png'),
      },
      {
        id: 4,
        title: 'Account settings',
        icon: 'InputCalendarIcon',
        screen: 'AccountScreen',
        badge: null,
        image: require('@assets/images/AccountSettings.png'),
      },
    ],
  },
  {
    section: 'Merchandise',
    data: [
      {
        id: 3,
        title: 'Wishlist',
        icon: 'HeartIcon',
        screen: 'WishlistScreen',
        badge: null,
        image: require('@assets/images/WishlistIcon.png'),
      },
      {
        id: 4,
        title: 'View Cart',
        icon: 'OrderIcon',
        screen: 'CartListScreen',
        badge: null,
        image: require('@assets/images/ViewCart.png'),
      },
      {
        id: 5,
        title: 'Order history',
        icon: 'OrderIcon',
        screen: 'OrderHistory',
        badge: null,
        image: require('@assets/images/HistoryIcon.png'),
      },
    ],
  },
  {
    section: 'Tickets',
    data: [
      {
        id: 6,
        title: 'Booking history',
        icon: 'TicketIcon',
        screen: 'BookingHistory',
        badge: null,
        image: require('@assets/images/HistoryIcon.png'),
      },
    ],
  },
  {
    section: 'General',
    data: [
      {
        id: 7,
        title: 'Notifications',
        icon: 'StarIcon',
        screen: 'UserNotificationSetting',
        badge: null,
        image: require('@assets/images/NotificationBellIcon.png'),
      },
      {
        id: 8,
        title: 'About',
        icon: 'InfoIcon',
        screen: 'AboutScreen',
        badge: null,
        image: require('@assets/images/InfoIcon.png'),
      },
      {
        id: 9,
        title: 'Customer Support',
        icon: 'SupportIcon',
        screen: 'SboSupport',
        badge: null,
        image: require('@assets/images/CustomerSupport.png'),
      },
      {
        id: 10,
        title: 'Report a problem',
        icon: 'ReportIcon',
        screen: 'ReportProblem',
        badge: null,
        image: require('@assets/images/ReportProblem.png'),
      },
    ],
  },
  {
    section: '',
    data: [
      {
        id: 11,
        title: 'Logout',
        icon: 'CrossIcon',
        screen: 'Logout',
        badge: null,
        color: 'red',
        image: require('@assets/images/LogoutIcon.png'),
      },
    ],
  },
];
export const CreatorSettingsData = [
  {
    section: 'Account',
    data: [
      {
        id: 1,
        title: 'Edit Profile',
        icon: 'UserIcon',
        screen: 'EditProfileScreen',
        badge: null,
        image: require('@assets/images/EditProfile.png'),
      },
      {
        id: 2,
        title: 'Saved items',
        icon: 'SavedIcon',
        screen: 'SavedItem',
        badge: null,
        image: require('@assets/images/SavedIcon.png'),
      },
      {
        id: 3,
        title: 'Blocked',
        icon: 'blockIcon',
        screen: 'BlockedUsersList',
        badge: null,
        image: require('@assets/images/blockIcon.png'),
      },
      {
        id: 4,
        title: 'Account settings',
        icon: 'InputCalendarIcon',
        screen: 'AccountScreen',
        badge: null,
        image: require('@assets/images/AccountSettings.png'),
      },
      {
        id: 5,
        title: 'Subscription Settings',
        icon: 'OrderIcon',
        screen: 'SubscriptionSettings',
        badge: null,
        image: require('@assets/images/SubscriptionIcon.png'),
      },
    ],
  },
  {
    section: 'Merchandise & Tickets',
    data: [
      {
        id: 6,
        title: 'Wishlist',
        icon: 'HeartIcon',
        screen: 'WishlistScreen',
        badge: null,
        image: require('@assets/images/WishlistIcon.png'),
      },
      {
        id: 7,
        title: 'View Cart',
        icon: 'OrderIcon',
        screen: 'CartListScreen',
        badge: null,
        image: require('@assets/images/ViewCart.png'),
      },
      {
        id: 8,
        title: 'Order history',
        icon: 'OrderIcon',
        screen: 'OrderHistory',
        badge: null,
        image: require('@assets/images/HistoryIcon.png'),
      },
      {
        id: 9,
        title: 'Booking history',
        icon: 'TicketIcon',
        screen: 'BookingHistory',
        badge: null,
        image: require('@assets/images/HistoryIcon.png'),
      },
    ],
  },

  {
    section: 'Smart App Earnings',
    data: [
      {
        id: 4,
        title: 'Live Streams',
        icon: 'LiveStreamIcon',
        screen: 'CreatorLiveStreams',
        badge: null,
        image: require('@assets/images/LiveStreamIcon.png'),
      },
      {
        id: 5,
        title: 'Events',
        icon: 'EventIcon',
        screen: 'CreatorEvents',
        badge: null,
        image: require('@assets/images/TicketManage.png'),
      },
      {
        id: 6,
        title: 'Merchandise',
        icon: 'OrderIcon',
        screen: 'CreatorStore',
        badge: null,
        image: require('@assets/images/merchandiseIcon.png'),
      },
      {
        id: 7,
        title: 'Subscriptions',
        icon: 'SubscriptionIcon',
        screen: 'CreatorSubscriptions',
        badge: null,
        image: require('@assets/images/SubscriptionIcon.png'),
      },
    ],
  },
  {
    section: 'General',
    data: [
      {
        id: 7,
        title: 'Notifications',
        icon: 'StarIcon',
        screen: 'CreatorNotificationSetting',
        badge: null,
        image: require('@assets/images/NotificationBellIcon.png'),
      },
      {
        id: 9,
        title: 'About',
        icon: 'InfoIcon',
        screen: 'AboutScreen',
        badge: null,
        image: require('@assets/images/InfoIcon.png'),
      },
      {
        id: 10,
        title: 'Customer Support',
        icon: 'SupportIcon',
        screen: 'SboSupport',
        badge: null,
        image: require('@assets/images/CustomerSupport.png'),
      },
      {
        id: 11,
        title: 'Report a problem',
        icon: 'ReportIcon',
        screen: 'ReportProblem',
        badge: null,
        image: require('@assets/images/ReportProblem.png'),
      },
    ],
  },
  {
    section: '',
    data: [
      {
        id: 12,
        title: 'Logout',
        icon: 'CrossIcon',
        screen: 'CreatorLogout',
        badge: null,
        color: 'red',
        image: require('@assets/images/LogoutIcon.png'),
      },
    ],
  },
];
export const AboutData = [
  {
    id: 1,
    label: 'Privacy Policy',
    value: 'Smart App Privacy Policy',
  },
  {
    id: 2,
    label: 'Teams of service',
    value: 'Smart App Teams of service',
  },
];
export const NotificationSettingData = [
  {
    id: '1',
    type: 'post',
    title: 'Post',
    description: 'Notifications from profiles I follow',
    enabled: false,
  },
  {
    id: '2',
    type: 'live',
    title: 'Live',
    description: 'Notifications from profiles I follow goes live',
    enabled: false,
  },
];
export const CreatorNotificationSettingData = [
  {
    id: '1',
    type: 'post',
    title: 'Post',
    description: 'Notifications from profiles I follow',
    enabled: false,
  },
  {
    id: '2',
    type: 'live',
    title: 'Live',
    description: 'Notifications from profiles I follow goes live',
    enabled: false,
  },
  {
    id: '3',
    type: 'comment',
    title: 'Comments',
    description: 'Notify me about the comments I get on my videos',
    enabled: false,
  },
  {
    id: '4',
    type: 'like',
    title: 'Likes',
    description: 'Notify me about the likes I get on my videos',
    enabled: false,
  },
];
export const uploadTab = [
  {id: 'Shorts', label: 'Shorts', icon: 'ShortsIcon'},
  {id: 'Video', label: 'Video', icon: 'VideoIcon'},
  {id: 'Live', label: 'Live', icon: 'LiveIcon'},
  {id: 'Post', label: 'Post', icon: 'PostIcon'},
];
export const VideoPreviewScreenSheetData = [
  {
    id: 1,
    name: 'Continue uploading',
    image: require('../assets/images/edit.png'),
  },
  {
    id: 2,
    name: 'Exit editing',
    image: require('../assets/images/arrow-left.png'),
    color: '#D13C50',
  },
];
export const REPORT_DATA = [
  {
    id: 1,
    label: 'Spam or misleading',
    value: 'spam_or_misleading',
  },
  {
    id: 2,
    label: 'Sexual content',
    value: 'sexual_content',
  },
  {
    id: 3,
    label: 'Inappropriate hateful or abusive content',
    value: 'inappropriate_hateful_abusive_content',
  },
  {
    id: 4,
    label: 'Harmful or dangerous acts',
    value: 'harmful_dangerous_acts',
  },
  {
    id: 5,
    label: 'Violent or repulsive content',
    value: 'violent_repulsive_content',
  },
];
export const PLAYLIST_TABS = ['Videos', 'Shorts'];
export const PROFILE_TAB_DATA = [
  {
    id: 1,
    title: 'Home',
  },
  {
    id: 2,
    title: 'Videos',
  },
  {
    id: 3,
    title: 'Shorts',
  },
  {
    id: 4,
    title: 'Posts',
  },
  {
    id: 5,
    title: 'Live',
  },
  {
    id: 6,
    title: 'Playlist',
  },
];
export const blockUserSheetContent = [
  {
    id: 1,
    title: 'Block Account',
    icon: require('../assets/images/blockIcon.png'),
  },
];
export const unblockUserSheetContent = [
  {
    id: 1,
    title: 'Unblock Account',
    icon: require('../assets/images/blockIcon.png'),
  },
];
export const TICKET_TYPES = [
  {
    id: 0,
    key: 'diamond',
    label: 'Diamond Experience',
    fields: [
      {name: 'name', label: 'Ticket Name', placeholder: 'Diamond Experience'},
      {name: 'price', label: 'Ticket Price', placeholder: 'Enter price'},
      {
        name: 'count',
        label: 'No. of Tickets',
        placeholder: 'Enter number of tickets',
      },
    ],
  },
  {
    id: 1,
    key: 'platinum',
    label: 'Platinum Experience',
    fields: [
      {
        name: 'name',
        label: 'Ticket Name',
        placeholder: 'Platinum Experience',
      },
      {name: 'price', label: 'Ticket Price', placeholder: 'Enter price'},
      {
        name: 'count',
        label: 'No. of Tickets',
        placeholder: 'Enter number of tickets',
      },
    ],
  },
  {
    id: 2,
    key: 'custom',
    label: 'Ticket Name',
    fields: [
      {name: 'name', label: 'Ticket Name', placeholder: 'Enter ticket name'},
      {name: 'price', label: 'Ticket Price', placeholder: 'Enter price'},
      {
        name: 'count',
        label: 'No. of Tickets',
        placeholder: 'Enter number of tickets',
      },
    ],
  },
];
export const merchandiseFilterOptions = [
  // { label: 'Relevance', value: 'relevance' },
  {label: 'New arrivals', value: 'new_arrivals'},
  // { label: 'Rating: High to Low', value: 'rating_high_low' },
  {label: 'Cost: Low to High', value: 'price_low_to_high'},
];
export const UserTicketData = [
  {
    id: '1',
    event_Name: 'Ed Sheeran Live in Concert',
    event_Cover_Image: require('@assets/images/profile_images/home_profile_image1.png'),
    event_Date: '2024-03-15',
    showStartTime: '10:00 AM',
    ShowEndTime: '22:00 PM',
    address: '123 Main St, Anytown, USA',
    onPress: () => {},
  },
  {
    id: '2',
    event_Name: 'Taylor Swift - The Eras Tour',
    event_Cover_Image: require('@assets/images/profile_images/home_profile_image2.png'),
    event_Date: '2024-04-20',
    showStartTime: '10:00 AM',
    ShowEndTime: '23:30 PM',
    address: '123 Main St, Anytown, USA',
    onPress: () => {},
  },
  {
    id: '3',
    event_Name: 'Beyoncé - Renaissance World Tour',
    event_Cover_Image: require('@assets/images/profile_images/home_profile_image3.png'),
    event_Date: '2024-05-10',
    showStartTime: '10:00 AM',
    ShowEndTime: '21:45 PM',
    address: '123 Main St, Anytown, USA',
    onPress: () => {},
  },
  {
    id: '4',
    event_Name: 'Coldplay - Music of the Spheres',
    event_Cover_Image: require('@assets/images/profile_images/home_profile_image1.png'),
    event_Date: '2024-06-05',
    showStartTime: '10:00 AM',
    ShowEndTime: '22:15 PM',
    address: '123 Main St, Anytown, USA',
    onPress: () => {},
  },
  {
    id: '5',
    event_Name: "Drake - It's All a Blur Tour",
    event_Cover_Image: require('@assets/images/profile_images/home_profile_image2.png'),
    event_Date: '2024-07-12',
    showStartTime: '10:00 AM',
    ShowEndTime: '23:00 PM',
    address: '123 Main St, Anytown, USA',
    onPress: () => {},
  },
];
export const AddressTypeData = [
  {
    id: 1,
    addressType: 'Home',
    image: require('@assets/images/HomeIconNew.png'),
  },
  {
    id: 2,
    addressType: 'Office',
    image: require('@assets/images/OfficeIcon.png'),
  },
  {
    id: 3,
    addressType: 'Other',
    image: require('@assets/images/locationIcon.png'),
  },
];
export const subscriptionTypes = [
  {id: 1, name: 'Monthly', value: 'monthly'},
  {id: 2, name: 'Quarterly', value: 'quarterly'},
  {id: 3, name: '6 Months', value: 'six_months'},
  {id: 4, name: 'Yearly', value: 'yearly'},
];
export const currencies = [
  {id: 1, name: 'USD ($)', value: 'USD'},
  {id: 2, name: 'EUR (€)', value: 'EUR'},
  {id: 3, name: 'GBP (£)', value: 'GBP'},
  {id: 4, name: 'INR (₹)', value: 'INR'},
];
export const OrderTabs = [
  {id: 'all', title: 'All'},
  {id: 'pending', title: 'Pending'},
  {id: 'accepted', title: 'Accepted'},
  {id: 'rejected', title: 'Rejected'},
  {id: 'completed', title: 'Completed'},
  // {id: 'cancelled', title: 'Cancelled'},
  // {id: 'returned', title: 'Returned'},
];
export const SubscriptionTabs = [
  {id: 'subscribed', title: 'Subscribed'},
  {id: 'subscribers', title: 'Subscribers'},
];
export const SubscriptionTabs1 = [
  {id: 1, label: 'Everyone', value: 'everyone'},
  {id: 2, label: 'Subscribers', value: 'subscribers'},
];
export const UploadCategoryData = [
  {name: 'Fashion'},
  {name: 'Travel'},
  {name: 'Music'},
  {name: 'Fitness'},
  {name: 'Tech'},
  {name: 'Sports'},
  {name: 'Food'},
  {name: 'Lifestyle'},
  {name: 'Educational'},
  {name: 'Art'},
  {name: 'Literature'},
  {name: 'Current Affairs'},
  {name: 'Healthcare'},
  {name: 'Podcasts'},
  {name: 'Entertainment'},
];
export const ProductCategoryData = [
  {name: 'Electronics'},
  {name: 'Fashion'},
  {name: 'Beauty'},
  {name: 'Home'},
  {name: 'Wellness'},
  {name: 'Baby Products'},
  {name: 'Stationery'},
  {name: 'Sports'},
  {name: 'Automotive'},
];
export const ItemCategoryData2 = [
  {id: 1, name: 'All Items'},
  {id: 2, name: 'Electronics'},
  {id: 3, name: 'Fashion'},
  {id: 4, name: 'Beauty'},
  {id: 5, name: 'Home'},
  {id: 6, name: 'Wellness'},
  {id: 7, name: 'Baby Products'},
  {id: 8, name: 'Stationery'},
  {id: 9, name: 'Sports'},
  {id: 10, name: 'Automotive'},
];
export const ShowUserNameArray = [
  'newFollower',
  'comment',
  'like',
  'subscribe',
  'post',
];
export const UserCreatorHomeTabData = [
  {
    id: 1,
    name: 'Orders',
    value: 'orders',
  },
  {
    id: 2,
    name: 'Tickets',
    value: 'tickets',
  },
];
export const LiveSheetData = [
  {
    id: 1,
    name: 'Report user',
    image: require('@assets/images/danger.png'),
  },
  {
    id: 2,
    name: 'Not interested',
    image: require('@assets/images/slash.png'),
  },
];
export const SelfNormalPlayerOption = [
  {
    id: 1,
    name: 'Playback speed',
    image: require('@assets/images/backward.png'),
  },
  {
    id: 4,
    name: 'Delete',
    image: require('@assets/images/deleteIcon.png'),
  },
];
export const OtherNormalPlayerOption = [
  {
    id: 1,
    name: 'Playback speed',
    image: require('@assets/images/backward.png'),
  },
  {
    id: 2,
    name: 'Report user',
    image: require('@assets/images/danger.png'),
  },
  {
    id: 3,
    name: 'Not interested',
    image: require('@assets/images/slash.png'),
  },
];
export const PlaybackSpeedOptions = [
  {
    id: 1,
    label: '0.25',
    value: 0.25,
  },
  {
    id: 2,
    label: '0.5x',
    value: 0.5,
  },
  {
    id: 3,
    label: '1x (Default)',
    value: 1,
  },
  {
    id: 4,
    label: '1.5x',
    value: 1.5,
  },
  {
    id: 5,
    label: '2x',
    value: 2,
  },
];
