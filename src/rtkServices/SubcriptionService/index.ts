import {api} from '../index';
import {ENDPOINTS} from '@rtkServices/endpoints';

export const subscriptionApi = api.injectEndpoints({
  endpoints: builder => ({
    // Add a subscription plan (for creators)
    addPlan: builder.mutation<AddPlanResponse, AddPlanRequest>({
      query: body => ({
        url: ENDPOINTS.subscription.addSubscription,
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Subscription'],
    }),

    // Get all subscription plans for a specific creator
    getCreatorPlans: builder.query<GetPlansResponse, string>({
      query: creatorId => ({
        url: ENDPOINTS.subscription.getCreatorPlans(creatorId),
        method: 'GET',
      }),
      providesTags: (result, error, creatorId) => [
        {type: 'Subscription', id: creatorId},
      ],
    }),

    // Subscribe to a plan
    subscribeToPlan: builder.mutation<SubscribeResponse, SubscribeRequest>({
      query: body => ({
        url: ENDPOINTS.subscription.subscribePlan,
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Subscription'],
    }),

    // Unsubscribe from a creator
    unsubscribeFromCreator: builder.mutation<
      UnsubscribeResponse,
      UnsubscribeRequest
    >({
      query: body => ({
        url: ENDPOINTS.subscription.unSubscribePlan,
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Subscription'],
    }),

    // Update a plan
    updatePlan: builder.mutation<UpdatePlanResponse, UpdatePlanRequest>({
      query: ({payload, planId}) => ({
        url: ENDPOINTS.subscription.updatePlan(planId),
        method: 'PUT',
        body: payload,
      }),
      invalidatesTags: ['Subscription'],
    }),

    // Delete a plan
    deletePlan: builder.mutation<any, {planId: string}>({
      query: ({planId}) => ({
        url: ENDPOINTS.subscription.deletePlan(planId),
        method: 'DELETE',
      }),
      invalidatesTags: ['Subscription'],
    }),

    getMySubscribedCreators: builder.query<
      GetMySubscribedCreatorsResponse,
      {search?: string; page?: number; limit?: number; sort?: 'asc' | 'desc'}
    >({
      query: ({search, page = 1, limit = 10, sort = 'desc'} = {}) => ({
        url: ENDPOINTS.subscription.getMySubscriberCreators,
        method: 'GET',
        params: {page, limit, sort},
      }),
      providesTags: ['Subscription'],
    }),
    getMySubscribersList: builder.query<
      GetMySubscribedCreatorsResponse,
      {search?: string; page?: number; limit?: number; sort?: 'asc' | 'desc'}
    >({
      query: ({search, page = 1, limit = 10, sort = 'desc'} = {}) => ({
        url: ENDPOINTS.subscription.subscribedList,
        method: 'GET',
        params: {page, limit, sort},
      }),
      providesTags: ['Subscription'],
    }),
  }),
});

export const {
  useAddPlanMutation,
  useGetCreatorPlansQuery,
  useSubscribeToPlanMutation,
  useUnsubscribeFromCreatorMutation,
  useUpdatePlanMutation,
  useDeletePlanMutation,
  useGetMySubscribedCreatorsQuery,
  useGetMySubscribersListQuery,
} = subscriptionApi;
