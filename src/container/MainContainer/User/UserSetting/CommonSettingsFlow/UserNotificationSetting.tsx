import AnimationBackground from '@components/AnimationComponent/AnimationBackground';
import SettingHeader from '@components/CustomHeaders/SettingHeader';
import {Colors} from '@constant/colors';
import {fonts} from '@constant/fontfamily';
import {fontSize} from '@constant/fontSize';
import {useToastMessage} from '@hooks/useToastMessage';
import {UserNotificationSettingProps} from '@navigation/screens';
import {useNotificationSettingsMutation} from '@rtkServices/SettingsService';
import {RootState, useAppDispatch, useAppSelector} from '@store/index';
import {updateUser} from '@store/UserManager';
import {NotificationSettingData} from '@utils/data';
import {useCallback, useEffect, useState} from 'react';
import {View, Text, StyleSheet, FlatList, Switch} from 'react-native';

const UserNotificationSetting = ({
  navigation,
}: UserNotificationSettingProps) => {
  const dispatch = useAppDispatch();
  const {user} = useAppSelector((state: RootState) => state.user);
  const [notifications, setNotifications] = useState(NotificationSettingData);
  const [notificationReq] = useNotificationSettingsMutation();
  const {showError, showSuccess} = useToastMessage();
  const initialNotification = () => {
    const userNotifications = user?.notificationSettings || {};
    const updated = NotificationSettingData?.map(item => ({
      ...item,
      enabled: !!userNotifications[item.type], // fallback to false
    }));
    setNotifications(updated);
  };

  useEffect(() => {
    initialNotification();
  }, [user]);

  const toggleSwitch = useCallback((id: string) => {
    setNotifications(prev =>
      prev.map(item =>
        item.id == id ? {...item, enabled: !item.enabled} : item,
      ),
    );
  }, []);

  const onSave = useCallback(() => {
    const payload = {
      notifications: notifications?.reduce((acc, item) => {
        acc[item?.type] = item?.enabled ?? false;
        return acc;
      }, {} as {[key: string]: boolean}),
    };
    notificationReq(payload).then(res => {
      if (res?.data) {
        navigation.goBack();
        dispatch(updateUser(res?.data?.data));
        showSuccess(
          res.data?.data?.message ||
            'User notification settings updated successfully',
        );
      }
      if (res?.error) {
        showError(res?.error?.data?.message ?? 'Something went wrong');
      }
    });
  }, [notifications]);

  const renderItem = useCallback(
    ({item}: {item: any}) => (
      <View style={styles.itemContainer}>
        <View style={{width: '80%'}}>
          <Text style={styles.typeText}>{item.title}</Text>
          <Text style={styles.descriptionText}>{item.description}</Text>
        </View>
        <Switch
          trackColor={{true: Colors.green}}
          value={item.enabled}
          onValueChange={() => toggleSwitch(item.id)}
        />
      </View>
    ),
    [styles],
  );
  return (
    <View style={styles.container}>
      <AnimationBackground
        animationSource={require('@assets/animations/AuthAnimation4.json')}
        backgroundColor={'#1a1538'}
        zIndex={0}
      />
      <View style={styles.contentOverlay}>
        <SettingHeader
          title="Notification Settings"
          onBackPress={() => navigation.goBack()}
          showSave={true}
          onSavePress={onSave}
        />
        <View style={{padding: 5}}>
          <Text style={styles.header}>PUSH NOTIFICATIONS</Text>
          <FlatList
            data={notifications}
            renderItem={renderItem}
            keyExtractor={item => item?.id?.toString()}
          />
        </View>
      </View>
    </View>
  );
};

export default UserNotificationSetting;
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentOverlay: {
    zIndex: 2,
    position: 'relative',
    flex: 1,
    paddingHorizontal: 12,
  },
  header: {
    color: Colors.grey,
    fontSize: fontSize.f12,
    marginBottom: 10,
    fontFamily: fonts['Poppins-Medium'],
    marginTop: 10,
  },
  itemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
  },
  typeText: {
    color: Colors.white,
    fontSize: fontSize.f14,
    fontFamily: fonts['Poppins-Medium'],
  },
  descriptionText: {
    color: Colors.grey,
    fontSize: fontSize.f12,
    fontFamily: fonts['Poppins-Regular'],
    marginTop: 5,
  },
});
