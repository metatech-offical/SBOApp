import {View, Text, StyleSheet, TouchableOpacity, FlatList} from 'react-native';
import React, {useEffect, useState} from 'react';
import AnimatedBackground from '@components/AnimationComponent/AnimationBackground';
import {UserSettingsData} from '@utils/data';
import {fonts} from '@constant/fontfamily';
import {fontSize} from '@constant/fontSize';
import {Colors} from '@constant/colors';
import FastImage from 'react-native-fast-image';
import SettingHeader from '@components/CustomHeaders/SettingHeader';
import {RightIcon} from '@assets/svg/CommonIcons';
import {RootState, useAppDispatch, useAppSelector} from '@store/index';
import {logoutUser} from '@store/UserManager';
import {useLogoutMutation} from '@rtkServices/AuthService';
import LogoutModal from '@components/ScreenLayouts/SettingsComponent/LogoutModal';
import {useToastMessage} from '@hooks/useToastMessage';
import {getMessaging} from '@react-native-firebase/messaging';

const UserSetting = ({navigation}: any) => {
  const dispatch = useAppDispatch();
  const [logoutApi] = useLogoutMutation();
  const {user} = useAppSelector((state: RootState) => state.user);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [deviceToken, setDeviceToken] = useState('');
  const {showError, showSuccess} = useToastMessage();
  const handleLogout = () => {
    dispatch(logoutUser());
    setModalVisible(false);
    navigation.reset({
      index: 0,
      routes: [{name: 'AuthNavigator'}],
    });
  };

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    const deviceToken = await getMessaging().getToken();
    setDeviceToken(deviceToken);
  };

  const onLogoutApi = () => {
    const payload = {
      userId: user?._id,
      fcmToken: deviceToken,
    };
    handleLogout();
    logoutApi(payload).then((res: any) => {
      if (res?.data?.success) {
        handleLogout();
      }
      if (res?.error) {
        showError(res?.error?.data?.message || '');
      }
    });
  };

  const renderItem = ({item}: any) => {
    return (
      <TouchableOpacity
        style={[styles.item, item.color === Colors.red && styles.logoutItem]}
        onPress={() => {
          if (item.screen === 'Logout') {
            setModalVisible(true);
          } else if (item.screen) {
            navigation.navigate(item.screen);
          }
        }}>
        {item?.image && (
          <FastImage
            source={item.image}
            style={styles.itemImage}
            resizeMode="contain"
          />
        )}

        <Text
          style={[
            styles.itemText,
            item.color === Colors.red && styles.logoutText,
          ]}>
          {item.title}
        </Text>

        {/* Show badge if exists */}
        {item.badge && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{item.badge}</Text>
          </View>
        )}

        {item.id === 1 ? (
          <FastImage
            source={require('@assets/images/CreatorIcon.png')}
            style={styles.creatorIcon}
            resizeMode="contain"
          />
        ) : (
          <>
            {item.screen !== 'CreatorLogout' && (
              <RightIcon color={Colors.white} opacity={0.6} />
            )}
          </>
        )}
      </TouchableOpacity>
    );
  };

  const flatData = UserSettingsData?.reduce<any>((acc, section) => {
    if (section.section) {
      acc.push({type: 'section', title: section?.section});
    }
    section?.data?.forEach(item => acc.push({type: 'item', ...item}));
    return acc;
  }, []);

  return (
    <View style={styles.container}>
      <AnimatedBackground
        animationSource={require('@assets/animations/AuthAnimation4.json')}
        backgroundColor={'#1a1538'}
        zIndex={0}
      />
      <View style={styles.contentOverlay}>
        <SettingHeader
          title="Settings"
          onBackPress={() => navigation.goBack()}
        />
        <FlatList
          data={flatData}
          keyExtractor={(item, idx) =>
            item.type === 'section'
              ? `section-${item.title}`
              : `item-${item.id || idx}`
          }
          renderItem={({item}) =>
            item.type === 'section' ? (
              <Text style={styles.sectionTitle}>{item.title}</Text>
            ) : (
              renderItem({item})
            )
          }
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
        <LogoutModal
          visible={modalVisible}
          onClose={() => setModalVisible(false)}
          onLogoutPress={onLogoutApi}
        />
      </View>
    </View>
  );
};

export default UserSetting;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentOverlay: {
    zIndex: 2,
    position: 'relative',
    flex: 1,
    paddingHorizontal: 16,
  },
  listContent: {
    paddingBottom: 30,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 18,
    paddingHorizontal: 15,
    marginBottom: 1,
    borderBottomWidth: 0.5,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  itemText: {
    flex: 1,
    color: Colors.white,
    fontSize: fontSize.f14,
    fontFamily: fonts['Poppins-Regular'],
    marginLeft: 12,
  },
  itemImage: {
    height: 20,
    width: 20,
    resizeMode: 'contain',
    tintColor: Colors.white,
  },
  badge: {
    backgroundColor: '#4CAF50',
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginRight: 8,
    minWidth: 65,
    alignItems: 'center',
  },
  badgeText: {
    color: Colors.white,
    fontSize: fontSize.f12,
    fontFamily: fonts['Poppins-Medium'],
  },
  logoutItem: {
    borderBottomWidth: 0,
    marginTop: 8,
  },
  logoutText: {
    color: '#FF5252',
    fontFamily: fonts['Poppins-SemiBold'],
  },
  sectionTitle: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: fontSize.f14,
    fontFamily: fonts['Poppins-Medium'],
    marginTop: 20,
    marginBottom: 8,
    marginLeft: 5,
  },
  creatorIcon: {
    height: 40,
    width: 60,
    resizeMode: 'contain',
    tintColor: Colors.white,
  },
});
