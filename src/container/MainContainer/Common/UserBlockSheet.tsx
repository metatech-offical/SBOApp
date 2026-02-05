import {View, Text, StyleSheet} from 'react-native';
import FastImage from 'react-native-fast-image';
import {useMemo} from 'react';
import CustomButton from '@components/CustomButtons/CustomButton';
import {fonts} from '@constant/fontfamily';
import {fontSize} from '@constant/fontSize';
import {Colors} from '@constant/colors';

const UserBlockSheet = ({
  userDetail,
  onBlockPress,
  isLoading,
}: {
  userDetail: any;
  onBlockPress: () => void;
  isLoading: boolean;
}) => {
  const data = useMemo(() => {
    return {
      username: userDetail?.username,
      dp: userDetail?.dp || userDetail?.profileImage,
    };
  }, [userDetail]);

  return (
    <View style={styles.blockUserDetailsContainer}>
      {data?.dp ? (
        <FastImage
          source={{uri: data?.dp}}
          style={styles.blockUserImage}
          resizeMode="cover"
        />
      ) : (
        <FastImage
          source={require('@assets/images/DummyUserImage.png')}
          style={styles.blockUserImage}
          resizeMode="cover"
        />
      )}
      <Text style={styles.blockUserNameText}>{`Block @${data?.username}`}</Text>
      <Text style={styles.blockUserDetailsText}>
        {'They won’t be able to message you or find your content on SBO.'}
      </Text>
      <CustomButton
        text="Block"
        onPress={onBlockPress}
        textStyle={{textTransform: 'capitalize', color: '#000000'}}
        isLoading={isLoading}
        btnStyle={styles.blockButtonStyle}
      />
    </View>
  );
};

export default UserBlockSheet;

const styles = StyleSheet.create({
  blockUserSheetContainer: {
    padding: 16,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    columnGap: 10,
    marginTop: 25,
  },
  blockUserSheetIcon: {
    width: 20,
    height: 20,
    marginRight: 10,
  },
  blockUserSheetText: {
    fontSize: fontSize.f16,
    color: Colors.white,
  },
  blockUserImage: {
    width: 61,
    height: 61,
    borderRadius: 19,
    alignSelf: 'center',
  },
  blockUserDetailsContainer: {
    marginTop: 40,
  },
  blockUserNameText: {
    fontSize: fontSize.f18,
    fontFamily: fonts['Poppins-SemiBold'],
    textAlign: 'center',
    marginTop: 15,
    color: Colors.white,
  },
  blockUserDetailsText: {
    fontSize: fontSize.f16,
    fontFamily: fonts['Poppins-Regular'],
    textAlign: 'center',
    marginTop: 10,
    width: '80%',
    alignSelf: 'center',
    marginBottom: 25,
    color: '#EEEEEF',
  },
  blockButtonStyle: {
    backgroundColor: Colors.white,
    width: '95%',
    alignSelf: 'center',
  },
});
