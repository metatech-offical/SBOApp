import {
  CommonActions,
  createNavigationContainerRef,
} from '@react-navigation/native';
import {
  AppStackParamList,
  BottomTabParamList,
  CreatorBottomTabParamList,
  UserBottomTabParamList,
} from './screens';
import {MainStackParamList} from './screens';

export const navigationRef = createNavigationContainerRef();
export type AllScreenParamList = AppStackParamList &
  MainStackParamList &
  UserBottomTabParamList &
  CreatorBottomTabParamList;

export const navigate = (name: keyof AllScreenParamList, params: any) => {
  if (navigationRef.isReady()) {
    navigationRef.navigate(name, params);
  }
};

export const navigateBack = () => {
  if (navigationRef.isReady()) {
    navigationRef.goBack();
  }
};
export const navigateAndReset = (routes = [], index = 0) => {
  if (navigationRef.isReady()) {
    navigationRef.dispatch(
      CommonActions.reset({
        index,
        routes,
      }),
    );
  }
};

export const navigateAndSimpleReset = (
  name: keyof AllScreenParamList,
  params: any,
  index = 0,
) => {
  if (navigationRef.isReady()) {
    navigationRef.dispatch(
      CommonActions.reset({
        index,
        routes: [{name, params}],
      }),
    );
  }
};

export function getCurrentRoute() {
  return navigationRef.getCurrentRoute()?.name;
}
