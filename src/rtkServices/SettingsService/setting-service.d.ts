interface DeleteRes {}

interface DeleteResponse {
  data: {
    success: boolean;
    message: string;
    data: null;
  };
}

interface DeleteBody {
  category: string;
  reason: string;
}

interface PrivacyStatement {
  success: boolean;
  data: PrivacyData;
}
interface PrivacyData {
  title: string;
  lastUpdated: string;
  data: PrivacySection[];
}
interface PrivacySection {
  title: string;
  content: string;
}

interface TermsOfService {
  success: boolean;
  data: TermsData;
}
interface TermsData {
  title: string;
  lastUpdated: string;
  data: TermsClause[];
}
interface TermsClause {
  title: string;
  content: string;
}

interface NotificationBody {
  notifications: {
    [key: string]: boolean;
  };
}

interface NotificationRes {
  data: {
    success: boolean;
    message: string;
    data: {
      _id: string;
      username: string;
      email: string;
      phoneNumber: string;
      password: string;
      provider: string | null;
      verified: boolean;
      isDeleted: boolean;
      deletedReason: string[];
      membership: string;
      platformSubscription: any; // Use a specific type if available
      creatorSubscriptions: any[]; // Use specific type if available
      sharesCount: number;
      __v: number;
      notificationSettings: {
        comment: boolean;
        like: boolean;
        live: boolean;
        post: boolean;
      };
      postSettings: {
        postVisibility: string;
        liveVisibility: string;
        liveVideoPricing: {
          currency: string;
          price: number;
          _id: string;
        };
      };
    };
  };
}
