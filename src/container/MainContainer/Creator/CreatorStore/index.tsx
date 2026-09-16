import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Modal,
  Pressable,
  ScrollView,
  Platform,
} from 'react-native';
import React, {useState} from 'react';
import {CreatorStoreProps} from '@navigation/screens';
import StackHeader from '@components/CustomHeaders/StackHeader';
import {ListData} from '@utils/data';
import {fonts} from '@constant/fontfamily';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import AllItems from './CreatorTabNavigator/AllItems';
import ComingSoon from './CreatorTabNavigator/ComingSoon';
import Livecollections from './CreatorTabNavigator/Livecollections';
import {useGetStoreAnalyticsQuery} from '@rtkServices/CreatorStoreService';
import Loader from '@components/CustomLoader/Loader';
import GlowBackground from '@components/AnimationComponent/GlowBackground';
import {screenHeight} from '@utils/general';
import {Colors} from '@constant/colors';
import {fontSize} from '@constant/fontSize';

const Tab = createMaterialTopTabNavigator();
const CreatorStore = ({navigation}: CreatorStoreProps) => {
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const {data: storeAnalytics, isLoading} = useGetStoreAnalyticsQuery();

  const analyticsData = storeAnalytics?.data
    ? [
        {
          name: 'Live Products',
          value: storeAnalytics.data.liveProducts ?? 0,
        },
        {
          name: 'Out of Stock',
          value: storeAnalytics.data.outOfStockProducts ?? 0,
        },
        {
          name: 'Total Collections',
          value: storeAnalytics.data.totalCollections ?? 0,
        },
        {
          name: 'Total Products',
          value: storeAnalytics.data.totalProducts ?? 0,
        },
      ]
    : [];

  return (
    <View style={styles.container}>
      <GlowBackground />
      <View style={styles.mainContainer}>
        <StackHeader
          title={'Your Merchandise'}
          onBackPress={() => navigation.goBack()}
          rightIcon={true}
          onRightPress={() => {
            setModalVisible(true);
          }}
          rightIconText={'Add'}
          titleStyle={{width: '70%'}}
          iconStyle={styles.iconStyle}
        />
      </View>
      {isLoading ? (
        <Loader visible={isLoading} />
      ) : (
        <ScrollView
          style={styles.mainScrollView}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{paddingBottom: 60}}
          bounces={false}>
          <View style={styles.analyticsContainer}>
            <FlatList
              data={analyticsData}
              showsHorizontalScrollIndicator={false}
              numColumns={2}
              scrollEnabled={false}
              renderItem={({item}) => (
                <View style={styles.analyticsItem}>
                  <Text style={styles.analyticsItemValue}>{item.value}</Text>
                  <Text style={styles.analyticsItemText}>{item.name}</Text>
                </View>
              )}
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
                  fontSize: fontSize.f14,
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
                name="AllItems"
                component={AllItems}
                options={{
                  tabBarLabel: 'Live Products',
                }}
              />
              <Tab.Screen
                name="Livecollections"
                component={Livecollections}
                options={{
                  tabBarLabel: 'Collections',
                }}
              />
              <Tab.Screen
                name="ComingSoon"
                component={ComingSoon}
                options={{
                  tabBarLabel: 'Draft',
                }}
              />
            </Tab.Navigator>
          </View>
        </ScrollView>
      )}

      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}>
        <Pressable
          style={styles.modalOverlay}
          onPress={() => {
            setModalVisible(false);
          }}>
          <View style={styles.modalContent}>
            <FlatList
              data={ListData}
              renderItem={({item}: any) => (
                <Pressable
                  style={styles.modalItem}
                  onPress={() => {
                    setModalVisible(false);
                    navigation.navigate(item.screen);
                  }}>
                  <Text style={styles.modalText}>{item.name}</Text>
                </Pressable>
              )}
            />
          </View>
        </Pressable>
      </Modal>
    </View>
  );
};

export default CreatorStore;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    overflow: 'hidden',
  },
  mainContainer: {
    paddingHorizontal: 10,
    alignItems: 'center',
  },
  mainScrollView: {
    flex: 1,
  },
  analyticsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  analyticsItem: {
    flex: 1,
    borderRadius: 10,
    padding: 10,
    borderWidth: 2,
    borderColor: '#FFFFFF1A',
    marginBottom: 10,
    backgroundColor: '#FFFFFF1A',
    margin: 5,
  },
  analyticsItemText: {
    fontSize: fontSize.f14,
    fontFamily: fonts['Poppins-Regular'],
    color: Colors.white,
    marginTop: 7,
  },
  analyticsItemValue: {
    fontSize: fontSize.f18,
    fontFamily: fonts['Poppins-Bold'],
    color: Colors.white,
    marginTop: 5,
  },
  tabContainer: {
    marginTop: 10,
    height: screenHeight * 0.75,
    minHeight: 400,
  },
  tabBar: {
    backgroundColor: 'transparent',
    fontFamily: fonts['Poppins-SemiBold'],
  },
  iconStyle: {
    marginLeft: Platform.OS === 'ios' ? 0 : 10,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    position: 'absolute',
    top: 120,
    right: 70,
    backgroundColor: '#2B2929',
    borderRadius: 12,
    width: 200,
    overflow: 'hidden',
  },
  modalItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#FFFFFF1A',
  },
  modalText: {
    fontSize: fontSize.f14,
    fontFamily: fonts['Poppins-Regular'],
    color: Colors.white,
  },
});
