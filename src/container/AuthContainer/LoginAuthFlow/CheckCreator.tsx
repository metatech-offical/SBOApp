import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
  Pressable,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import LinearGradient from 'react-native-linear-gradient';
import AnimatedBackground from '@components/AnimationComponent/AnimationBackground';
import {CheckCreatorProps} from '@navigation/screens';
import {fonts} from '@constant/fontfamily';
import CustomButton from '@components/CustomButtons/CustomButton';
import {useCompleteProfileMutation} from '@rtkServices/AuthService';
import {useToastMessage} from '@hooks/useToastMessage';
import { Colors } from '@constant/colors';
import { fontSize } from '@constant/fontSize';

const CheckCreator = ({navigation, route}: CheckCreatorProps) => {
  const {uuid} = route?.params || {};
  const [selected, setSelected] = useState<'yes' | 'no' | null>(null);
  const {showError, showSuccess} = useToastMessage();
  const [completeProfile] = useCompleteProfileMutation();

  const goToChooseYourPlan = async () => {
    if (selected === 'yes') {
      navigation.navigate('ChooseYourPlan', {uuid: uuid});
    } else if (selected === 'no') {
      const payload = {
        membership: 'standard',
        uuid: uuid,
      };
      const res = await completeProfile(payload);
      if (res?.data?.success) {
        showSuccess(res?.data?.message || '');
        navigation.reset({
          index: 0,
          routes: [{name: 'MainNavigator'}],
        });
      } else {
        const message =
          res?.error?.data?.message ||
          'Unable to complete signup. Please log in.';
        showError(message);
        if (
          res?.error?.status === 404 ||
          String(message).toLowerCase().includes('log in') ||
          String(message).toLowerCase().includes('expired')
        ) {
          navigation.reset({
            index: 0,
            routes: [{name: 'LoginScreen'}],
          });
        }
      }
    }
  };

  return (
    <View style={styles.container}>
      <AnimatedBackground
        animationSource={require('@assets/animations/AuthAnimation4.json')}
        backgroundColor="#1a1538"
        zIndex={0}
      />
      <StatusBar translucent backgroundColor="transparent" />

      <View style={styles.logoContainer}>
        <FastImage
          source={require('@assets/images/appLogo2.png')}
          style={styles.logo}
          resizeMode="contain"
        />
      </View>

      <View style={styles.questionContainer}>
        <Text style={styles.questionText}>Are you a creator?</Text>
        <View style={styles.buttonRow}>
          {['no', 'yes'].map(option => {
            const isSelected = selected === option;
            const label = option === 'yes' ? 'Yes!' : 'No';

            return (
              <Pressable
                key={option}
                onPress={() => setSelected(option as 'yes' | 'no')}
                style={styles.buttonWrapper}>
                {isSelected ? (
                  <LinearGradient
                    colors={['#00FFA3', '#DC1FFF']}
                    start={{x: 0, y: 0}}
                    end={{x: 1, y: 1}}
                    style={styles.gradientBorder}>
                    <View style={styles.innerButton}>
                      <Text style={styles.buttonTextSelected}>{label}</Text>
                    </View>
                  </LinearGradient>
                ) : (
                  <View style={styles.unselectedButton}>
                    <Text style={styles.buttonTextUnselected}>{label}</Text>
                  </View>
                )}
              </Pressable>
            );
          })}
        </View>
      </View>
      <View style={styles.bottomContainer}>
        <CustomButton
          text="Continue"
          onPress={goToChooseYourPlan}
          disabled={selected === null}
          btnStyle={{
            opacity: selected === null ? 0.5 : 1,
            backgroundColor: selected !== null ? Colors.white : Colors.grey,
            width: '75%',
          }}
          textStyle={{
            color: selected !== null ? Colors.black : undefined,
            fontSize: fontSize.f14,
          }}
        />
      </View>
    </View>
  );
};

export default CheckCreator;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.black,
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: 100,
  },
  logo: {
    width: 120,
    height: 120,
  },
  questionContainer: {
    alignItems: 'center',
    marginTop: 60,
  },
  questionText: {
    fontSize: 35,
    color: Colors.white,
    fontFamily: fonts['Poppins-SemiBold'],
    marginBottom: 40,
    paddingHorizontal: 50,
    textAlign: 'center',
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 20,
  },
  buttonWrapper: {
    borderRadius: 10,
    width: 120,
    height: 80,
  },
  gradientBorder: {
    // padding: 2,
    borderRadius: 10,
    width: '100%',
    height: '100%',
  },
  innerButton: {
    backgroundColor: 'rgba(58, 58, 58, 0.94)',
    borderRadius: 10,
    // paddingHorizontal: 20,
    margin: 2,
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  unselectedButton: {
    backgroundColor: 'rgba(58, 58, 58, 0.34)',
    borderRadius: 12,
    paddingHorizontal: 20,
    borderWidth: 2,
    borderColor: '#838587',
    width: 120,
    height: 80,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonTextSelected: {
    color: Colors.white,
    fontFamily: fonts['Poppins-SemiBold'],
    fontSize: fontSize.f14,
  },
  buttonTextUnselected: {
    color: '#7A7A7C',
    fontFamily: 'YourFont-Regular',
    fontSize: fontSize.f14,
  },
  bottomContainer: {
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: 20,
    marginTop: 170,
  },
});
