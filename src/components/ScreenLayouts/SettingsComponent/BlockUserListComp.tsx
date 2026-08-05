import {View, Text, StyleSheet} from 'react-native';
import {memo, useCallback, useMemo, useState} from 'react';
import FastImage from 'react-native-fast-image';
import {Colors} from '@constant/colors';
import CustomButton from '@components/CustomButtons/CustomButton';
import {fonts} from '@constant/fontfamily';
import {fontSize} from '@constant/fontSize';
import UnblockModal from '@components/CustomModal/UnBlockModal';
import {useBlockUnblockUserMutation} from '@rtkServices/ProfileService';
import {useToastMessage} from '@hooks/useToastMessage';

const BlockUserListComp = ({item}: {item: any}) => {
  const {showError, showSuccess} = useToastMessage();
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);

  const handleUnblockPress = (user: any) => {
    setSelectedUser(user);
    setModalVisible(true);
  };

  const handleCancel = () => {
    setModalVisible(false);
    setSelectedUser(null);
  };

  const [blockUseReq, blockUserRes] = useBlockUnblockUserMutation();

  const handleUnblock = useCallback(async () => {
    try {
      await blockUseReq({id: item?.blocked?._id, action: 'unblock'}).then(
        (res: any) => {
          if (res?.data) {
            showSuccess(res?.data?.message || '');
            setModalVisible(false);
            setSelectedUser(null);
          }
          if (res?.error) {
            showError(res?.error?.data?.message || res?.error?.message || '');
          }
        },
      );
    } catch (error) {
      console.error('Error unblocking user:', error);
    } finally {
    }
  }, [item?._id, blockUseReq]);

  return (
    <View style={styles.container}>
      <View style={styles.userContainer}>
        {item?.blocked?.profilePicture ? (
          <FastImage
            source={{uri: item?.blocked?.profilePicture}}
            style={styles.userImage}
            resizeMode="cover"
          />
        ) : (
          <FastImage
            source={require('@assets/images/DummyUserImage.png')}
            style={styles.userImage}
            resizeMode="cover"
          />
        )}
        <View style={styles.userDetails}>
          <Text style={styles.userNameText}>{item?.blocked?.username}</Text>
          <Text style={styles.userDetailsText}>
            They won't be able to message you or find your content on Smart App.
          </Text>
        </View>
        <CustomButton
          text="Unblock"
          onPress={() => handleUnblockPress(item)}
          textStyle={{textTransform: 'capitalize', fontSize: fontSize.f14}}
          isLoading={false}
          btnStyle={styles.mainBtnStyle}
        />
      </View>
      <UnblockModal
        modalVisible={modalVisible}
        handleCancel={handleCancel}
        selectedUser={selectedUser}
        handleUnblock={handleUnblock}
        isLoading={blockUserRes?.isLoading}
      />
    </View>
  );
};

export default memo(BlockUserListComp);

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 10,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  userContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  userImage: {
    width: 51,
    height: 51,
    borderRadius: 30,
  },
  userDetails: {
    marginLeft: 15,
    width: '60%',
  },
  userNameText: {
    fontSize: fontSize.f16,
    fontFamily: fonts['Poppins-Medium'],
    color: Colors.white,
  },
  userDetailsText: {
    fontSize: fontSize.f10,
    fontFamily: fonts['Poppins-Regular'],
    color: '#8C8A94',
    marginTop: 5,
  },
  mainBtnStyle: {
    width: '27%',
    alignSelf: 'center',
    borderRadius: 40,
  },
});
