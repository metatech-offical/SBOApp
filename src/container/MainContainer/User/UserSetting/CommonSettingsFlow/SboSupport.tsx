import AnimationBackground from '@components/AnimationComponent/AnimationBackground';
import CustomButton from '@components/CustomButtons/CustomButton';
import SettingHeader from '@components/CustomHeaders/SettingHeader';
import {Colors} from '@constant/colors';
import {fonts} from '@constant/fontfamily';
import {fontSize} from '@constant/fontSize';
import {SboSupportProps} from '@navigation/screens';
import {View, StyleSheet, Text} from 'react-native';

const SboSupport = ({navigation}: SboSupportProps) => {
  return (
    <View style={styles.container}>
      <AnimationBackground
        animationSource={require('@assets/animations/AuthAnimation4.json')}
        backgroundColor={'#1a1538'}
        zIndex={0}
      />
      <View style={styles.contentOverlay}>
        <SettingHeader
          title="Smart App Support"
          onBackPress={() => navigation.goBack()}
        />
        <View>
          <Text style={styles.title}>Need help? Talk to us!</Text>
          <Text style={styles.subTitle}>
            Either call us on (021) 888888888 or email us at support@vyoo.com on
            for further assistance
          </Text>
          <CustomButton
            text="Start Chat"
            onPress={() => {}}
            textStyle={styles.buttonText}
            btnStyle={styles.btnStyle}
          />
        </View>
      </View>
    </View>
  );
};

export default SboSupport;

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
  title: {
    fontSize: fontSize.f16,
    color: Colors.white,
    fontFamily: fonts['Poppins-SemiBold'],
    marginTop: 10,
  },
  subTitle: {
    fontSize: fontSize.f14,
    color: Colors.grey,
    fontFamily: fonts['Poppins-Medium'],
    marginTop: 10,
    lineHeight: 25,
  },
  buttonText: {
    textTransform: 'capitalize',
    fontSize: fontSize.f14,
    color: Colors.black,
    fontFamily: fonts['Poppins-SemiBold'],
  },
  btnStyle: {
    width: '33%',
    backgroundColor: Colors.white,
  },
});
