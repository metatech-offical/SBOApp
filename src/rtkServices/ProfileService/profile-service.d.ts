interface NotificationSettings {
  comment: boolean;
  like: boolean;
  live: boolean;
  post: boolean;
}

interface LiveVideoPricing {
  currency: string;
  price: number;
  _id: string;
}

interface PostSettings {
  postVisibility: 'everyone' | string;
  liveVisibility: 'everyone' | string;
  liveVideoPricing: LiveVideoPricing;
}

interface UserProfile {
  _id: string;
  username: string;
  email: string;
  phoneNumber: string;
  provider: null | any;
  verified: boolean;
  isDeleted: boolean;
  membership: string;
  notificationSettings: NotificationSettings;
  postSettings: PostSettings;
  platformSubscription: null | any;
  creatorSubscriptions: any[];
  sharesCount: number;
  deletedReason: any[];
  displayName: string;
  profilePicture: string;
  isFollowing: boolean;
  followersCount: number;
  followingCount: number;
  isLive: boolean;
  isViewed: boolean;
  isSubscribed: boolean;
  blockInfo: any[];
  isBlocked: boolean;
  storeId: string;
  bio?: string; // Optional as it's not present in the given data
}

interface UserProfileResponse {
  data: UserProfile;
  message: string;
  success: boolean;
}

interface UserContentResponse {
  data: {
    content: any[];
    pagination: {
      limit: number;
      currentPage: number;
      totalRecords: number;
      totalPages: number;
    };
  };
  message: string;
  success: boolean;
}

interface FollowerUser {
  _id: string;
  username: string;
  displayName: string;
  profilePicture: string;
  verified: boolean;
  isFollowing: boolean;
  followersCount: number;
  followingCount: number;
  membership: string;
  isLive: boolean;
}

interface FollowersResponse {
  data: {
    followers: FollowerUser[];
    pagination: {
      limit: number;
      currentPage: number;
      totalRecords: number;
      totalPages: number;
    };
  };
  message: string;
  success: boolean;
}

interface FollowingResponse {
  data: {
    following: FollowerUser[];
    pagination: {
      limit: number;
      currentPage: number;
      totalRecords: number;
      totalPages: number;
    };
  };
  message: string;
  success: boolean;
}

interface ReportProblemBody {
  category: string;
  message: string;
  files?: Array<{
    uri: string;
    type: string;
    name: string;
  }>;
}

interface ReportProblemResponse {
  success: boolean;
  message: string;
  data: any;
}

interface UpdateProfileBody {
  displayName?: string;
  bio?: string;
  file?: {
    uri: string;
    type: string;
    name: string;
  };
}

interface UpdateProfileResponse {
  data: UserProfile;
  message: string;
  success: boolean;
}