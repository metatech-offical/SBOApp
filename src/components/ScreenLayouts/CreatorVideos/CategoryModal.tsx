import React from 'react';
import {
  Modal,
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  FlatList,
  Pressable,
} from 'react-native';
import {BlurView} from '@react-native-community/blur';
import LinearGradient from 'react-native-linear-gradient';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {fonts} from '@constant/fontfamily';
import {VideoCategoryData} from '@utils/data';
import {CrossIconSimple} from '@assets/svg/CommonIcons';
import {fontSize} from '@constant/fontSize';
import {Colors} from '@constant/colors';

const ROW_HEIGHT = 56;

const CategoryModal: React.FC<any> = ({
  navigation,
  visible,
  onClose,
  currentTab,
}) => {
  const {top, bottom} = useSafeAreaInsets();

  return (
    <Modal
      transparent={true}
      visible={visible}
      animationType="fade"
      statusBarTranslucent
      onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <BlurView
          style={StyleSheet.absoluteFillObject}
          blurType="dark"
          blurAmount={24}
          reducedTransparencyFallbackColor="#100E12"
        />
        <View pointerEvents="none" style={styles.tintOverlay} />
        <FlatList
          nestedScrollEnabled
          data={VideoCategoryData}
          keyExtractor={item => item.name}
          renderItem={({item}) => (
            <Pressable
              style={styles.itemContainer}
              onPress={() => {
                navigation.navigate('CategoryByResults', {
                  query: item?.name,
                  currentTab: currentTab,
                });
                onClose();
              }}>
              <Text style={styles.titleStyle}>{item?.name}</Text>
            </Pressable>
          )}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[
            styles.listContent,
            {paddingTop: top + 8, paddingBottom: bottom + 140},
          ]}
        />
        <LinearGradient
          colors={[
            'rgba(16, 14, 18, 0)',
            'rgba(16, 14, 18, 0.75)',
            'rgba(16, 14, 18, 1)',
          ]}
          style={styles.gradientOverlay}
          pointerEvents="none"
        />
        <TouchableOpacity
          onPress={onClose}
          activeOpacity={0.85}
          style={[styles.closeButton, {bottom: Math.max(bottom, 16) + 16}]}>
          <CrossIconSimple color={Colors.white} />
        </TouchableOpacity>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(36, 36, 36, 0.35)',
  },
  tintOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(67, 0, 255, 0.08)',
  },
  itemContainer: {
    height: ROW_HEIGHT,
    paddingHorizontal: 40,
    justifyContent: 'center',
  },
  titleStyle: {
    fontSize: fontSize.f14,
    color: Colors.white,
    fontFamily: fonts['Poppins-Medium'],
    includeFontPadding: false,
  },
  listContent: {
    flexGrow: 1,
  },
  closeButton: {
    position: 'absolute',
    alignSelf: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 32,
    height: 64,
    width: 64,
    justifyContent: 'center',
    alignItems: 'center',
  },
  gradientOverlay: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    height: 220,
  },
});

export default CategoryModal;
