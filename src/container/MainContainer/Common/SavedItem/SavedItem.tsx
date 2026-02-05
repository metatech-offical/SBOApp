import AnimationBackground from '@components/AnimationComponent/AnimationBackground';
import SettingHeader from '@components/CustomHeaders/SettingHeader';
import {SavedItemProps} from '@navigation/screens';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import {View, StyleSheet} from 'react-native';
import SavePostTab from './SavePostTab';
import SaveShortTab from './SaveShortTab';
import {Colors} from '@constant/colors';
import {fonts} from '@constant/fontfamily';
import {fontSize} from '@constant/fontSize';
const Tab = createMaterialTopTabNavigator();

const SavedItem = ({navigation}: SavedItemProps) => {
  return (
    <View style={styles.container}>
      <AnimationBackground
        animationSource={require('@assets/animations/AuthAnimation4.json')}
        backgroundColor={'#1a1538'}
        zIndex={0}
      />
      <View style={styles.contentOverlay}>
        <View style={styles.headerContainer}>
          <SettingHeader
            title="Saved items"
            onBackPress={() => navigation.goBack()}
          />
        </View>
        <Tab.Navigator
          screenOptions={{
            tabBarStyle: styles.tabBar,
            tabBarInactiveTintColor: Colors.grey,
            tabBarActiveTintColor: Colors.white,
            tabBarLabelStyle: {
              textTransform: 'none',
              fontSize: fontSize.f14,
              marginTop: 4,
            },
            tabBarItemStyle: {
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
            },
            tabBarIndicatorStyle: {
              backgroundColor: '#1AD655',
              height: 3,
              width: '50%',
              borderRadius: 10,
            },
            tabBarIndicatorContainerStyle: {
              justifyContent: 'center',
            },
          }}>
          <Tab.Screen
            name="Posts"
            component={SavePostTab}
            options={{
              tabBarLabel: 'Posts',
            }}
          />
          <Tab.Screen
            name="Shorts"
            component={SaveShortTab}
            options={{
              tabBarLabel: 'Shorts',
            }}
          />
        </Tab.Navigator>
      </View>
    </View>
  );
};

export default SavedItem;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentOverlay: {
    zIndex: 2,
    position: 'relative',
    flex: 1,
  },
  tabBar: {
    backgroundColor: 'transparent',
    fontFamily: fonts['Poppins-SemiBold'],
  },
  headerContainer: {
    paddingHorizontal: 10,
  },
});
