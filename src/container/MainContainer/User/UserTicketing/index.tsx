import {
  FlatList,
  Image,
  ImageBackground,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useRef, useState} from 'react';
import {UserTicketingProps} from '@navigation/screens';
import MerchandiseHeader from '@components/CustomHeaders/MerchandiseHeader';
import GlowBackground from '@components/AnimationComponent/GlowBackground';
import TextInputWithLabels from '@components/CustomInputs/TextInputWithLabels';
import {LocationIcon} from '@assets/svg/TicktingIcons';
import {CalendarIcon, SearchIcon} from '@assets/svg/HomeScreenIcon';
import CustomButton from '@components/CustomButtons/CustomButton';
import {fonts} from '@constant/fontfamily';
import NodataFound from '@components/DataEmpty/NodataFound';
import {UserTicketData} from '@utils/data';
import TicketCard from '@components/ScreenLayouts/UserTicketing/TicketCard';
import LinearGradient from 'react-native-linear-gradient';
import {Colors} from '@constant/colors';
import {fontSize} from '@constant/fontSize';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import ComingSoonEvent from './UserTicketingTabNavigator/ComingSoonEvent';
import AllItemsTicketing from './UserTicketingTabNavigator/AllItemsTicketing';
import {navigate} from '@navigation/utils';
import {
  Tabs,
  MaterialTabBar,
  useCurrentTabScrollY,
} from 'react-native-collapsible-tab-view';
import DateTimePickerInput from '@components/DateTimePicker/DateTimePickerInput';
import dayjs from 'dayjs';

const Tab = createMaterialTopTabNavigator();
const HEADER_HEIGHT = 520;

const UserTicketing = ({navigation}: UserTicketingProps) => {
  const [headerHeight, setHeaderHeight] = useState(0);
  const [search, setSearch] = useState('');
  const [city, setCity] = useState('');
  const [date, setDate] = useState<any>(null);
  const creatorId = useRef<any>(null);
  const onGetCreatorId = (id: any) => {
    creatorId.current = id;
  };
  return (
    <View style={styles.container}>
      <GlowBackground />
      <View style={{flex: 1, zIndex: 2}}>
        <View style={{zIndex: 100, overflow: 'hidden'}}>
          <GlowBackground />
          <MerchandiseHeader
            onBackPress={() => navigation.goBack()}
            isCartVisible={false}
            style={{zIndex: 101}}
          />
        </View>
        <View style={{flex: 1}}>
          <Tabs.Container
            headerHeight={headerHeight}
            renderTabBar={props => (
              <MaterialTabBar
                getLabelText={v => v}
                {...props}
                indicatorStyle={{
                  backgroundColor: '#1AD655',
                  height: 1.5,
                }}
                labelStyle={{
                  fontSize: fontSize.f14,
                  fontFamily: fonts['Poppins-Medium'],
                }}
                activeColor="#FFF"
                inactiveColor="#FFFFFF8A"
              />
            )}
            revealHeaderOnScroll={false}
            allowHeaderOverscroll
            headerContainerStyle={{backgroundColor: 'transparent'}}
            renderHeader={() => (
              <View
                onLayout={e => setHeaderHeight(e.nativeEvent.layout.height)}
                style={styles.contentOverlay}>
                <View style={styles.DetailContainer}>
                  <View style={styles.TopContainer}>
                    <TextInputWithLabels
                      placeholder="City / Zipcode"
                      value={city}
                      onChangeText={val => {
                        setCity(val.trimStart());
                      }}
                      mainContainerProps={{
                        ...styles.inputStyle,
                        marginBottom: 4,
                      }}
                      icon={<LocationIcon />}
                    />
                    <DateTimePickerInput
                      containerStyle={{width: '50%', marginBottom: 0}}
                      onChange={setDate}
                      customBtn={
                        <View style={styles.calenderbtn}>
                          <CalendarIcon />
                          <Text
                            style={{
                              ...styles.placeholder,
                              color: date ? '#FFFFFF' : '#FFFFFF20',
                            }}>
                            {date
                              ? `${dayjs(date).format('DD MMM YYYY')}`
                              : 'When'}
                          </Text>
                        </View>
                      }
                    />
                  </View>
                  <TextInputWithLabels
                    placeholder="Search for a show..."
                    value={search}
                    onChangeText={val => {
                      setSearch(val.trimStart());
                    }}
                    mainContainerProps={styles.inputStyle2}
                    icon={<SearchIcon width={20} height={20} />}
                  />
                </View>
                <View style={styles.imageContainer}>
                  <ImageBackground
                    source={require('@assets/images/WimHoff.png')}
                    style={styles.image}>
                    <LinearGradient
                      colors={[
                        'rgba(139, 255, 93, 0.35)',
                        'rgba(191, 114, 250, 0.26)',
                      ]}
                      start={{x: 0, y: 0}}
                      end={{x: 1, y: 1}}
                      style={styles.gradient}>
                      <View style={styles.imageTextContainer}>
                        <Text style={styles.imageText}>Get your</Text>
                        <Text style={styles.imageText}>seat Booked</Text>

                        <CustomButton
                          text="Book now"
                          onPress={() => {
                            navigate('CreatorTicketingScreen', {
                              creatorId: creatorId.current,
                            });
                          }}
                          btnStyle={styles.buttonContainer}
                          textStyle={styles.buttonText}
                        />
                      </View>
                    </LinearGradient>
                  </ImageBackground>
                </View>
              </View>
            )}>
            <Tabs.Tab name="Live events">
              <AllItemsTicketing
                navigation={navigation}
                city={city}
                search={search}
                date={date}
                onGetCreatorId={onGetCreatorId}
              />
            </Tabs.Tab>
            <Tabs.Tab name="Coming Soon">
              <ComingSoonEvent
                navigation={navigation}
                city={city}
                search={search}
                date={date}
                onGetCreatorId={onGetCreatorId}
              />
            </Tabs.Tab>
          </Tabs.Container>
        </View>
      </View>
    </View>
  );
};

export default UserTicketing;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    overflow: 'hidden',
  },
  contentOverlay: {
    // zIndex: 2,
    position: 'relative',
  },
  DetailContainer: {
    paddingHorizontal: 16,
  },
  TopContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    columnGap: 10,
  },
  inputStyle: {
    width: '48%',
  },
  inputStyle2: {
    width: '100%',
  },
  imageContainer: {
    width: '100%',
    height: 230,
  },
  image: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  imageTextContainer: {
    width: '56%',
    height: '100%',
    justifyContent: 'flex-end',
    paddingBottom: 10,
  },
  imageText: {
    fontSize: fontSize.f26,
    color: Colors.white,
    marginLeft: 30,
    fontFamily: fonts['Poppins-Regular'],
    lineHeight: 30,
  },
  buttonContainer: {
    width: '60%',
    height: 40,
    backgroundColor: Colors.white,
    marginLeft: 30,
    borderRadius: 30,
  },
  buttonText: {
    fontSize: fontSize.f14,
    fontFamily: fonts['Poppins-Medium'],
    color: Colors.black,
  },
  mainContainer: {
    width: '100%',
    height: '100%',
  },
  gradient: {
    width: '100%',
    height: '100%',
  },
  tabContainer: {
    marginTop: 10,
    flex: 1,
    marginBottom: 60,
    // zIndex: 2,
  },
  tabBar: {
    backgroundColor: 'transparent',
    fontFamily: fonts['Poppins-SemiBold'],
  },
  eventBannerImage: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
  },
  calenderbtn: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  placeholder: {
    fontSize: fontSize.f14,
    fontFamily: fonts['Poppins-Medium'],
    color: '#FFFFFF20',
    marginLeft: 6,
  },
});
