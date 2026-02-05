import {View, StyleSheet, Platform} from 'react-native';
import React, {useState} from 'react';
import {CreatorTicketingProps} from '@navigation/screens';
import AnimatedBackground from '@components/AnimationComponent/AnimationBackground';
import StackHeader from '@components/CustomHeaders/StackHeader';
import {fonts} from '@constant/fontfamily';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import ComingSoonEvent from './TicketingTabNavigator/ComingSoonEvent';
import PastEvents from './TicketingTabNavigator/PastEvents';
import {Colors} from '@constant/colors';
import {fontSize} from '@constant/fontSize';
import LiveEvents from './TicketingTabNavigator/LiveEvent';
import SearchInput from '@components/CustomInputs/SearchInput';
const Tab = createMaterialTopTabNavigator();

const CreatorTicketing = ({navigation}: CreatorTicketingProps) => {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearchChange = (text: string) => {
    setSearchQuery(text);
  };
  return (
    <View style={styles.container}>
      <AnimatedBackground
        animationSource={require('@assets/animations/AuthAnimation4.json')}
        backgroundColor="#1a1538"
        zIndex={0}
      />

      <View style={styles.mainContainer}>
        <StackHeader
          title={'Your Events'}
          onBackPress={() => navigation.goBack()}
          rightIcon={true}
          onRightPress={() => {
            navigation.navigate('CreateEvent' as never as any, {
              eventId: undefined,
              isEdit: false,
            });
          }}
          rightIconText={'+ Create'}
          showArrowDown={false}
          rightIconStyle={styles.rightIcon}
          iconStyle={styles.iconStyle}
        />
      </View>
      <View style={styles.tabContainer}>
        <Tab.Navigator
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
              width: '33.33%',
              borderRadius: 10,
            },
            tabBarIndicatorContainerStyle: {
              justifyContent: 'center',
            },
          }}>
          <Tab.Screen
            name="Live events"
            options={{
              tabBarLabel: 'Live events',
            }}>
            {props => (
              <LiveEvents
                {...props}
                searchQuery={searchQuery}
                onSearchChange={handleSearchChange}
              />
            )}
          </Tab.Screen>
          <Tab.Screen
            name="Coming Soon"
            options={{
              tabBarLabel: 'Coming Soon',
            }}>
            {props => (
              <ComingSoonEvent
                {...props}
                searchQuery={searchQuery}
                onSearchChange={handleSearchChange}
              />
            )}
          </Tab.Screen>
          <Tab.Screen
            name="Past Events"
            options={{
              tabBarLabel: 'Past Events',
            }}>
            {props => (
              <PastEvents
                {...props}
                searchQuery={searchQuery}
                onSearchChange={handleSearchChange}
              />
            )}
          </Tab.Screen>
        </Tab.Navigator>
      </View>
    </View>
  );
};

export default CreatorTicketing;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  mainContainer: {
    paddingHorizontal: 10,
    alignItems: 'center',
  },
  rightIcon: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
    minHeight: 40,
    minWidth: 90,
    backgroundColor: '#FFFFFF1A',
    borderWidth: 1,
    borderColor: '#FFFFFF1A',
    flexDirection: 'row',
    columnGap: 5,
  },
  tabContainer: {
    marginTop: 10,
    flex: 1,
    marginBottom: 60,
  },
  tabBar: {
    backgroundColor: 'transparent',
    fontFamily: fonts['Poppins-SemiBold'],
  },
  iconStyle: {
    marginLeft: Platform.OS === 'ios' ? 0 : 10,
  },
});
