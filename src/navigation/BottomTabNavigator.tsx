import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {useAppSelector} from '@store/index';
import {RootState} from '@store/index';
import {Image, ImageStyle} from 'react-native';

// Import Tab Icons
import homeIcon from '@assets/images/homeIcon.png';
import searchIcon from '@assets/images/searchIcon.png';
import videos from '@assets/images/videos.png';
import ticketsIcon from '@assets/images/ticketsIcon.png';
import merchandiseIcon from '@assets/images/merchandiseIconNew.png';
import profileIcon from '@assets/images/profileIcon.png';

// Creator Screens
import CreatorHome from '@container/MainContainer/Creator/CreatorHome';
import CreatorTicketing from '@container/MainContainer/Creator/CreatorTicketing';
import CreatorVideos from '@container/MainContainer/Creator/CreatorVideos';
import CreatorStore from '@container/MainContainer/Creator/CreatorStore';
import CreatorExplore from '@container/MainContainer/Creator/CreatorExplore';
import CreatorProfile from '@container/MainContainer/Creator/CreatorProfile';

// User Screens
import UserHome from '@container/MainContainer/User/UserHome';
import UserTicketing from '@container/MainContainer/User/UserTicketing';
import UserVideos from '@container/MainContainer/User/UserVideos';
import UserMerchandise from '@container/MainContainer/User/UserMerchandise';
import UserExplore from '@container/MainContainer/User/UserExplore';
import UserProfile from '@container/MainContainer/User/UserProfile';

import {CreatorBottomTabParamList, UserBottomTabParamList} from './screens';
import {fonts} from '@constant/fontfamily';
import {Colors} from '@constant/colors';
import {fontSize} from '@constant/fontSize';

const CreatorTab = createBottomTabNavigator<CreatorBottomTabParamList>();
const UserTab = createBottomTabNavigator<UserBottomTabParamList>();

const getTabIcon =
  (source: any, style: ImageStyle) =>
  ({color}: {color: string}) =>
    <Image source={source} style={{...style, tintColor: color}} />;

const defaultIconStyle = {width: 24, height: 24};
const ticketIconStyle = {width: 20, height: 20, resizeMode: 'contain' as const};

// Creator Bottom Tab Navigator
function CreatorBottomTabNavigator() {
  return (
    <CreatorTab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          position: 'absolute',
          backgroundColor: 'rgba(9, 4, 46, 0.9)',
          height: 85,
          paddingTop: 7,
          paddingBottom: 10,
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
          borderWidth: 0,
          borderTopWidth: 0,
        },
        tabBarActiveTintColor: Colors.white,
        tabBarInactiveTintColor: '#666',
        tabBarLabelStyle: {
          fontSize: fontSize.f8,
          fontFamily: fonts['Poppins-Regular'],
        },
      }}>
      <CreatorTab.Screen
        name="CreatorHome"
        component={CreatorHome}
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: getTabIcon(homeIcon, defaultIconStyle),
        }}
      />
      <CreatorTab.Screen
        name="CreatorTicketing"
        component={CreatorTicketing}
        options={{
          tabBarLabel: 'Ticketing',
          tabBarIcon: getTabIcon(ticketsIcon, ticketIconStyle),
        }}
      />
      <CreatorTab.Screen
        name="CreatorVideos"
        component={CreatorVideos}
        options={{
          tabBarLabel: 'Videos',
          tabBarIcon: getTabIcon(videos, defaultIconStyle),
        }}
      />
      <CreatorTab.Screen
        name="CreatorStore"
        component={CreatorStore}
        options={{
          tabBarLabel: 'Store',
          tabBarIcon: getTabIcon(merchandiseIcon, defaultIconStyle),
        }}
      />
      <CreatorTab.Screen
        name="CreatorExplore"
        component={CreatorExplore}
        options={{
          tabBarLabel: 'Explore',
          tabBarIcon: getTabIcon(searchIcon, defaultIconStyle),
        }}
      />
      <CreatorTab.Screen
        name="CreatorProfile"
        component={CreatorProfile}
        options={{
          tabBarLabel: 'Profile',
          tabBarIcon: getTabIcon(profileIcon, defaultIconStyle),
        }}
      />
    </CreatorTab.Navigator>
  );
}

// User Bottom Tab Navigator
function UserBottomTabNavigator() {
  return (
    <UserTab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          position: 'absolute',
          backgroundColor: 'rgba(9, 4, 46, 0.9)',
          height: 85,
          paddingTop: 7,
          paddingBottom: 10,
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
          borderWidth: 0,
          borderTopWidth: 0,
        },
        tabBarActiveTintColor: Colors.white,
        tabBarInactiveTintColor: '#666',
        tabBarLabelStyle: {
          fontSize: fontSize.f8,
          fontFamily: fonts['Poppins-Regular'],
        },
      }}>
      <UserTab.Screen
        name="UserHome"
        component={UserHome}
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: getTabIcon(homeIcon, defaultIconStyle),
        }}
      />
      <UserTab.Screen
        name="UserTicketing"
        component={UserTicketing}
        options={{
          tabBarLabel: 'Ticketing',
          tabBarIcon: getTabIcon(ticketsIcon, ticketIconStyle),
        }}
      />
      <UserTab.Screen
        name="UserVideos"
        component={UserVideos}
        options={{
          tabBarLabel: 'Videos',
          tabBarIcon: getTabIcon(videos, defaultIconStyle),
        }}
      />
      <UserTab.Screen
        name="UserMerchandise"
        component={UserMerchandise}
        options={{
          tabBarLabel: 'Store', //Merchandise
          tabBarIcon: getTabIcon(merchandiseIcon, defaultIconStyle),
        }}
      />
      <UserTab.Screen
        name="UserExplore"
        component={UserExplore}
        options={{
          tabBarLabel: 'Explore',
          tabBarIcon: getTabIcon(searchIcon, defaultIconStyle),
        }}
      />
      <UserTab.Screen
        name="UserProfile"
        component={UserProfile}
        options={{
          tabBarLabel: 'Profile',
          tabBarIcon: getTabIcon(profileIcon, defaultIconStyle),
        }}
      />
    </UserTab.Navigator>
  );
}

// Main Bottom Tab Navigator that switches based on user type
export default function BottomTabNavigator() {
  const user = useAppSelector((state: RootState) => state.user.user);
  const isCreator = user?.membership === 'creator';

  return isCreator ? <CreatorBottomTabNavigator /> : <UserBottomTabNavigator />;
}
