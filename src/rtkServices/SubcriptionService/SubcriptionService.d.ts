// Subscription Plan Types
interface SubscriptionPlan {
  _id: string;
  creatorId: string;
  interval: 'monthly' | 'quarterly' | 'six_months' | 'yearly';
  currency: string;
  price: number;
  description: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

// Request Types
interface AddPlanRequest {
  interval: 'monthly' | 'quarterly' | 'six_months' | 'yearly';
  currency: string;
  price: number;
  description?: string;
}

interface SubscribeRequest {
  planId: string;
}

interface UnsubscribeRequest {
  creatorId: string;
}

// Response Types
interface SubscriptionResponse {
  success: boolean;
  message: string;
  data: any;
}

interface GetPlansResponse extends SubscriptionResponse {
  data: SubscriptionPlan[];
}

interface AddPlanResponse extends SubscriptionResponse {
  data: SubscriptionPlan;
}

interface SubscribeResponse extends SubscriptionResponse {
  data: {
    subscription: {
      _id: string;
      subscriber: string;
      creator: string;
      plan: SubscriptionPlan;
      startDate: string;
      endDate: string;
      status: 'active' | 'cancelled' | 'expired';
      createdAt: string;
      updatedAt: string;
    };
  };
}

interface UnsubscribeResponse extends SubscriptionResponse {
  data: {
    message: string;
  };
}

interface UpdatePlanRequest {
  payload: {
    planId: string;
    interval?: 'monthly' | 'quarterly' | 'six_months' | 'yearly';
    currency?: string;
    price?: number;
    description?: string;
  };
  planId: string;
}

interface UpdatePlanResponse extends SubscriptionResponse {
  data: SubscriptionPlan;
}

interface SubscribedCreator {
  _id: string;
  username: string;
  subscriptionStart: string;
  subscriptionEnd: string;
  profilePicture: string;
}

interface Subscriber {
  _id: string;
  displayName: string;
  username: string;
  profilePicture: string;
  subscriptionStart: string;
  subscriptionEnd: string;
}

interface GetMySubscribedCreatorsResponse extends SubscriptionResponse {
  data: {
    total: number;
    page: number;
    limit: number;
    data: SubscribedCreator[];
  };
}
