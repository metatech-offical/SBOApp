import {ENDPOINTS} from '@rtkServices/endpoints';
import {api} from '../index';
import {setToken} from '@utils/general';

export const authApi = api.injectEndpoints({
  endpoints: builder => ({
    signup: builder.mutation<SignupRes | null, SignupBoby>({
      query: body => ({
        url: ENDPOINTS.auth.signup,
        method: 'POST',
        body,
      }),
    }),
    verifyEmailOtp: builder.mutation<any | null, any>({
      query: body => ({
        url: ENDPOINTS.auth.verifyOtp,
        method: 'POST',
        body,
      }),
    }),
    login: builder.mutation<LoginResponse | null, any>({
      query: body => ({
        url: ENDPOINTS.auth.login,
        method: 'POST',
        body,
      }),
      transformResponse: (payload: LoginResponse, meta, arg) => {
        if (payload.success) {
          setToken(payload.data.token, '');
          return payload;
        } else {
          return null;
        }
      },
    }),
    saveUsernamePassword: builder.mutation<any | null, any>({
      query: body => ({
        url: ENDPOINTS.auth.saveUserPass,
        method: 'POST',
        body,
      }),
    }),
    forgotPassword: builder.mutation<any | null, any>({
      query: body => ({
        url: ENDPOINTS.auth.forgotPassword,
        method: 'POST',
        body,
      }),
    }),
    verifyOtp: builder.mutation<any | null, any>({
      query: body => ({
        url: ENDPOINTS.auth.verifyForgotOtp,
        method: 'POST',
        body,
      }),
    }),
    resetPassword: builder.mutation<any | null, any>({
      query: body => ({
        url: ENDPOINTS.auth.resetPassword,
        method: 'POST',
        body,
      }),
    }),
    checkMembership: builder.mutation<any | null, any>({
      query: body => ({
        url: ENDPOINTS.auth.checkMemberShip,
        method: 'PATCH',
        body,
      }),
    }),
    mobileSignup: builder.mutation<any | null, any>({
      query: body => ({
        url: ENDPOINTS.auth.mobileSignup,
        method: 'POST',
        body,
      }),
    }),
    completeProfile: builder.mutation<any | null, any>({
      query: body => ({
        url: ENDPOINTS.auth.completeProfile,
        method: 'POST',
        body,
      }),
      transformResponse: (payload: any, meta, arg) => {
        if (payload.success) {
          setToken(payload.data.token, '');
          return payload;
        } else {
          return null;
        }
      },
    }),
    checkUserValidOrNot: builder.mutation<CheckUserRes | null, CheckUserReq>({
      query: body => ({
        url: ENDPOINTS.auth.checkUserValid,
        method: 'POST',
        body,
      }),
    }),
    logout: builder.mutation<LogoutRes | null, LogoutBody>({
      query: body => ({
        url: ENDPOINTS.auth.logout,
        method: 'POST',
        body,
      }),
    }),
    resendOtp: builder.mutation<any | null, any>({
      query: body => ({
        url: ENDPOINTS.auth.resendOtp,
        method: 'POST',
        body,
      }),
    }),
  }),
});
export const {
  useSignupMutation,
  useVerifyEmailOtpMutation,
  useLoginMutation,
  useSaveUsernamePasswordMutation,
  useForgotPasswordMutation,
  useVerifyOtpMutation,
  useResetPasswordMutation,
  useCheckMembershipMutation,
  useMobileSignupMutation,
  useCompleteProfileMutation,
  useCheckUserValidOrNotMutation,
  useLogoutMutation,
  useResendOtpMutation,
} = authApi;
