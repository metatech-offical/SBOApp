enum MembershipLevel {
  STANDARD = 'standard',
  CREATOR = 'creator',
}

interface User {
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

interface UserState {
  user: User | null;
}
 interface IOnboardingUser {
  uuid: string;
  email?: string;
  phoneNumber?: string;
  onboardingSteps: {
    emailVerified: boolean;
    phoneVerified: boolean;
  };
  username?: string;
  password?: string;
}
