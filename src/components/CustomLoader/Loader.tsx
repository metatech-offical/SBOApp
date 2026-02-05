import {Colors} from '@constant/colors';
import {fonts} from '@constant/fontfamily';
import {fontSize} from '@constant/fontSize';
import React, {useEffect, useRef} from 'react';
import {
  View,
  ActivityIndicator,
  Text,
  StyleSheet,
  Modal,
  Animated,
} from 'react-native';

const Loader: React.FC<LoaderProps> = ({
  visible,
  message,
  size = 'large',
  color = '#007AFF',
  overlay = true,
}) => {
  const scaleAnim = useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    if (visible) {
      Animated.spring(scaleAnim, {
        toValue: 1,
        useNativeDriver: true,
        friction: 5,
      }).start();
    } else {
      scaleAnim.setValue(0.8);
    }
  }, [visible, scaleAnim]);

  if (!visible) return null;

  const LoaderContent = (
    <View style={styles.centeredView}>
      <Animated.View
        style={[styles.loaderBox, {transform: [{scale: scaleAnim}]}]}>
        <ActivityIndicator size={size} color={color} />
        {message ? <Text style={styles.message}>{message}</Text> : null}
      </Animated.View>
    </View>
  );

  return overlay ? (
    <Modal transparent visible animationType="fade">
      {LoaderContent}
    </Modal>
  ) : (
    LoaderContent
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    // backgroundColor: 'rgba(0,0,0,0.18)',
    // Optionally add a blur effect here with BlurView if desired
  },
  loaderBox: {
    backgroundColor: 'rgba(255,255,255,0.18)',
    borderRadius: 18,
    paddingVertical: 32,
    paddingHorizontal: 32,
    alignItems: 'center',
    minWidth: 140,
    // shadowColor: '#000',
    // shadowOffset: { width: 0, height: 6 },
    // shadowOpacity: 0.18,
    // shadowRadius: 16,
    // elevation: 12,
  },
  message: {
    marginTop: 16,
    textAlign: 'center',
    letterSpacing: 0.2,
    fontSize: fontSize.f14,
    fontFamily: fonts['Poppins-SemiBold'],
    color: Colors.white,
  },
});

export default Loader;
