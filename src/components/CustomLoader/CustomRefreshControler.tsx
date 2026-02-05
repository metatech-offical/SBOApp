import { Colors } from '@constant/colors';
import React from 'react';
import { RefreshControl, ActivityIndicator, RefreshControlProps } from 'react-native';

interface CustomRefreshControlerProps extends RefreshControlProps {
  customLoader?: React.ReactNode;
}

const CustomRefreshControler: React.FC<CustomRefreshControlerProps> = ({
  refreshing,
  onRefresh,
  customLoader,
  ...rest
}) => {
  return (
    <RefreshControl
      refreshing={refreshing}
      onRefresh={onRefresh}
      {...rest}
      tintColor={'rgba(255,255,255,0.18)'} // Hide default spinner
      colors={[Colors.white]}
      progressBackgroundColor={'rgba(255,255,255,0.18)'}
      // Render custom loader if provided, else default ActivityIndicator
      // Note: For iOS, custom loader is not natively supported, so this is for Android
      // For full custom, need to overlay loader on list
    />
  );
};

export default CustomRefreshControler;
