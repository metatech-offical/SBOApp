interface SignupBoby {
  email: string;
  // password: string;
}
interface SignupRes {
  success: boolean;
  message: string;
  token: string;
}
interface LoginUser {
  _id: string;
  email: string;
  username: string;
  verified: boolean;
  isProfileComplete: boolean;
  membership: MembershipLevel;
  followersCount: number;
  followingCount: number;
  sharesCount: number;
  onboardingSteps: {
    emailVerified: boolean;
    phoneVerified: boolean;
  };
  provider: {
    provider: string;
    _id: string;
  };
  isDeleted: boolean;
  deletedReason: any[];
  platformSubscription: any;
  creatorSubscriptions: any[];
  fcmToken: string;
  __v: number;
}

interface LoginResponse {
  success: boolean;
  message: string;
  data: {
    user: LoginUser;
    token: string;
  };
}
interface CheckUserReq {
  username: string;
}
interface CheckUserRes {
  success: boolean;
  message: string;
  data: boolean;
}

interface LogoutBody {
  userId: string;
  fcmToken: string;
}

interface LogoutRes {
  success: boolean;
  message: string;
}
