import {View, Text, StyleSheet, Pressable} from 'react-native';
import SettingHeader from '@components/CustomHeaders/SettingHeader';
import AnimatedBackground from '@components/AnimationComponent/AnimationBackground';
import {AccountScreenProps} from '@navigation/screens';
import {RightIcon} from '@assets/svg/CommonIcons';
import {Colors} from '@constant/colors';
import {fontSize} from '@constant/fontSize';
import {fonts} from '@constant/fontfamily';

const AccountScreen = ({navigation}: AccountScreenProps) => {
  const handleDeleteAccount = () => {
    navigation.navigate('DeleteAccount');
  };
  return (
    <View style={styles.container}>
      <AnimatedBackground
        animationSource={require('@assets/animations/AuthAnimation4.json')}
        backgroundColor={'#1a1538'}
        zIndex={0}
      />
      <View style={styles.contentOverlay}>
        <SettingHeader
          title="Account"
          onBackPress={() => navigation.goBack()}
        />
        <Pressable
          style={styles.deleteAccountContainer}
          onPress={handleDeleteAccount}>
          <Pressable onPress={handleDeleteAccount}>
            <Text style={styles.deleteAccount}>Delete account</Text>
            <Text style={styles.deleteAccountText}>
              This will permanently delete your and all it’s data
            </Text>
          </Pressable>
          <RightIcon color={Colors.white} />
        </Pressable>
      </View>
    </View>
  );
};

export default AccountScreen;

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
  deleteAccountContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    marginRight: 15,
    width: '100%',
  },
  deleteAccount: {
    fontSize: fontSize.f14,
    fontFamily: fonts['Poppins-Medium'],
    color: '#EB576B',
  },
  deleteAccountText: {
    fontSize: fontSize.f12,
    fontFamily: fonts['Poppins-Regular'],
    color: Colors.white,
    marginTop: 5,
  },
});
