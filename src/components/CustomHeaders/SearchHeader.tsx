import React, {useMemo, useState, useEffect, useRef} from 'react';
import {Animated, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {fonts} from '@constant/fontfamily';
import {fontSize} from '@constant/fontSize';
import {Colors} from '@constant/colors';
import {BackArrow} from '@assets/svg/AuthFlowIcons';
import FastImage from 'react-native-fast-image';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

const UseTypewriterCycle = () => {
  const textArray = ['videos', 'shorts', 'users'];
  const typingSpeed = 200;
  const delay = 1000;
  const loop = true;

  const [currentText, setCurrentText] = useState('');
  const [stringIndex, setStringIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const cursorOpacity = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(cursorOpacity, {
          toValue: 0,
          duration: 5000,
          useNativeDriver: true,
        }),
        Animated.timing(cursorOpacity, {
          toValue: 1,
          duration: 5000,
          useNativeDriver: true,
        }),
      ]),
    ).start();
  }, [cursorOpacity]);

  useEffect(() => {
    const currentString = textArray[stringIndex];
    if (charIndex < currentString?.length) {
      const timeout = setTimeout(() => {
        setCurrentText(currentString?.slice(0, charIndex + 1));
        setCharIndex(charIndex + 1);
      }, typingSpeed);
      return () => clearTimeout(timeout);
    } else {
      const timeout = setTimeout(() => {
        if (stringIndex < textArray?.length - 1) {
          setStringIndex(stringIndex + 1);
        } else if (loop) {
          setStringIndex(0);
        }
        setCharIndex(0);
        setCurrentText('');
      }, delay);
      return () => clearTimeout(timeout);
    }
  }, [charIndex, stringIndex]);

  return (
    <>
      <Text>{currentText}</Text>
      <Animated.Text style={[styles.cursor, {opacity: cursorOpacity}]}>
        |
      </Animated.Text>
    </>
  );
};

const SearchHeader: React.FC<StackHeaderProps> = ({
  title,
  onBackPress,
  style,
  titleStyle,
}) => {
  const {top} = useSafeAreaInsets();
  return (
    <View style={[styles.container, {marginTop: top}, style]}>
      <View style={styles.row}>
        <TouchableOpacity onPress={onBackPress} style={styles.icon} hitSlop={20}>
          <BackArrow color={Colors.white} height={20} width={20} opacity={0.5} />
        </TouchableOpacity>
        <Text style={[styles.textStyle, titleStyle]}>
          {title}<UseTypewriterCycle />
        </Text>
      </View>
      <FastImage
        source={require('@assets/images/appLogo2.png')}
        style={styles.logo}
        resizeMode={FastImage.resizeMode.contain}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 50,
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    marginTop: 20,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  textStyle: {
    fontSize: fontSize.f18,
    fontFamily: fonts['Poppins-Bold'],
    color: Colors.white,
    alignSelf: 'center',
    marginLeft: 20,
  },
  icon: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  leftIcon: {
    height: 22,
    width: 22,
    resizeMode: 'contain',
  },
  rightIcon: {
    height: 22,
    width: 60,
    resizeMode: 'contain',
  },
  cursor: {
    color: '#1AD655',
    fontSize: fontSize.f20,
  },
  logo: {
    height: 40,
    width: 40,
  },
});

export default SearchHeader;
