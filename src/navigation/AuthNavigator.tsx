import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import LoginScreen from '@container/AuthContainer/LoginAuthFlow/LoginScreen';
import {AuthStackParamList} from './screens';
import SignUpWithEmail from '@container/AuthContainer/EmailAuthFlow/SignUpWithEmail';
import EmailOtp from '@container/AuthContainer/EmailAuthFlow/EmailOtp';
import SignUpMobileInput from '@container/AuthContainer/EmailAuthFlow/SignUpMobileInput';
import TakeUserName from '@container/AuthContainer/TakeUserName';
import TakePassword from '@container/AuthContainer/TakePassword';
import LoginPassword from '@container/AuthContainer/LoginAuthFlow/LoginPassword';
import MobileFlowMobileInput from '@container/AuthContainer/MobileAuthFlow.tsx/MobileFlowMobileInput';
import MobileOtp from '@container/AuthContainer/MobileAuthFlow.tsx/MobileOtp';
import MobileFlowEmailInput from '@container/AuthContainer/MobileAuthFlow.tsx/MobileFlowEmailInput';
import ForgotPassword from '@container/AuthContainer/ForgotPasswordFlow/ForgotPassword';
import ForgotOpt from '@container/AuthContainer/ForgotPasswordFlow/ForgotOpt';
import ResetPassword from '@container/AuthContainer/ForgotPasswordFlow/ResetPassword';
import LoginMobile from '@container/AuthContainer/LoginAuthFlow/LoginMobile';
import CheckCreator from '@container/AuthContainer/LoginAuthFlow/CheckCreator';
import ChooseYourPlan from '@container/AuthContainer/LoginAuthFlow/ChooseYourPlan';
const Stack = createNativeStackNavigator<AuthStackParamList>();

export default function AuthNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="LoginScreen"
        component={LoginScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="SignUpWithEmail"
        component={SignUpWithEmail}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="EmailOtp"
        component={EmailOtp}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="SignUpMobileInput"
        component={SignUpMobileInput}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="TakeUserName"
        component={TakeUserName}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="TakePassword"
        component={TakePassword}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="LoginPassword"
        component={LoginPassword}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="MobileFlowMobileInput"
        component={MobileFlowMobileInput}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="MobileOtp"
        component={MobileOtp}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="MobileFlowEmailInput"
        component={MobileFlowEmailInput}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="ForgotPassword"
        component={ForgotPassword}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="ForgotOpt"
        component={ForgotOpt}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="ResetPassword"
        component={ResetPassword}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="LoginMobile"
        component={LoginMobile}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="CheckCreator"
        component={CheckCreator}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="ChooseYourPlan"
        component={ChooseYourPlan}
        options={{headerShown: false}}
      />
    </Stack.Navigator>
  );
}
