import {StyleSheet, View} from 'react-native';
import React from 'react';
import {CategoryByResultsProps} from '@navigation/screens';
import StackHeader from '@components/CustomHeaders/StackHeader';
import AnimationBackground from '@components/AnimationComponent/AnimationBackground';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import StraemCategory from './StramCategory';
import ShortsCategory from './ShortsCategory';
import {fonts} from '@constant/fontfamily';
import {Colors} from '@constant/colors';
import {fontSize} from '@constant/fontSize';
const Tab = createMaterialTopTabNavigator();

const CategoryByResults = ({navigation, route}: CategoryByResultsProps) => {
  const {query, currentTab}: any = route?.params || {};

  return (
    <View style={styles.container}>
      <AnimationBackground
        animationSource={require('@assets/animations/AuthAnimation4.json')}
        backgroundColor={'#1a1538'}
        zIndex={0}
      />
      <StackHeader title={query} onBackPress={() => navigation.goBack()} />

      <View style={styles.tabContainer}>
        <Tab.Navigator
          initialRouteName={currentTab}
          screenOptions={{
            tabBarStyle: styles.tabBar,
            tabBarInactiveTintColor: Colors.grey,
            tabBarActiveTintColor: Colors.white,
            tabBarLabelStyle: {
              textTransform: 'none',
              fontSize: fontSize.f12,
              marginTop: 4,
            },
            tabBarItemStyle: {
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
            },
            tabBarIndicatorStyle: {
              backgroundColor: '#38A3C4',
              height: 3,
              width: '50%',
              borderRadius: 10,
            },
            tabBarIndicatorContainerStyle: {
              justifyContent: 'center',
            },
          }}>
          <Tab.Screen
            name="Stream"
            component={StraemCategory}
            initialParams={{query: query}}
          />
          <Tab.Screen
            name="Shorts"
            component={ShortsCategory}
            initialParams={{query: query}}
          />
        </Tab.Navigator>
      </View>
    </View>
  );
};

export default CategoryByResults;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  tabContainer: {
    flex: 1,
  },
  tabBar: {
    backgroundColor: 'transparent',
    fontFamily: fonts['Poppins-SemiBold'],
  },
});
