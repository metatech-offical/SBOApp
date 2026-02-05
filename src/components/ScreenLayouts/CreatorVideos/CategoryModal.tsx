import React from 'react';
import {
  Modal,
  View,
  StyleSheet,
  Dimensions,
  Text,
  TouchableOpacity,
  FlatList,
  Pressable,
} from 'react-native';
import {BlurView} from '@react-native-community/blur';
import LinearGradient from 'react-native-linear-gradient';
import {fonts} from '@constant/fontfamily';
import {UploadCategoryData} from '@utils/data';
import {CrossIconSimple} from '@assets/svg/CommonIcons';
import {screenHeight, screenWidth} from '@utils/general';
import {fontSize} from '@constant/fontSize';
import {Colors} from '@constant/colors';

const CategoryModal: React.FC<any> = ({
  navigation,
  visible,
  onClose,
  currentTab,
}) => {
  return (
    <Modal
      transparent={true}
      visible={visible}
      animationType="fade"
      onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <View style={styles.modelView}>
          <View>
            <BlurView
              style={StyleSheet.absoluteFillObject}
              blurType={'dark'}
              blurAmount={15}
              reducedTransparencyFallbackColor="white"
            />
            <FlatList
              nestedScrollEnabled={true}
              data={UploadCategoryData}
              renderItem={({item, index}) => {
                return (
                  <Pressable
                    style={styles.itemContainer}
                    onPress={() => {
                      navigation.navigate('CategoryByResults', {
                        query: item?.name,
                        currentTab: currentTab,
                      });
                      onClose();
                    }}>
                    <Text style={[styles.titleStyle]}>{item?.name}</Text>
                  </Pressable>
                );
              }}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.listContent}
              ListFooterComponent={<View style={{height: 200}} />}
            />
            <LinearGradient
              // useAngle={true}
              angle={180.11}
              colors={[
                'rgba(19, 18, 18, 0)',
                'rgba(18, 17, 17,1)',
                'rgba(17, 17, 17, 1)',
              ]}
              style={styles.gradientOverlay}
            />
          </View>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <CrossIconSimple color={Colors.white} />
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 99,
  },
  modelView: {
    width: screenWidth,
    height: screenHeight,
    borderRadius: 0,
  },
  itemContainer: {
    paddingVertical: 13,
    paddingHorizontal: 40,
  },
  titleStyle: {
    letterSpacing: -1,
    fontSize: fontSize.f20,
    color: Colors.white,
    fontFamily: fonts['Poppins-Medium'],
  },
  listContent: {
    paddingBottom: 40,
    marginTop: 60,
  },
  closeButton: {
    position: 'absolute',
    bottom: 41,
    alignSelf: 'center',
    backgroundColor: '#FFFFFF1A',
    borderRadius: 30,
    height: 60,
    width: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
  gradientOverlay: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    height: '29%', // Adjust based on how much fade effect you want
  },
});

export default CategoryModal;
