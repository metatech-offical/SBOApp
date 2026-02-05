import {Colors} from '@constant/colors';
import {fonts} from '@constant/fontfamily';
import {fontSize} from '@constant/fontSize';
import React, {useMemo} from 'react';
import {
  Modal,
  View,
  StyleSheet,
  Dimensions,
  Text,
  TouchableOpacity,
} from 'react-native';
const {width} = Dimensions.get('window');

interface LogoutModalProps {
  visible: boolean;
  onClose: () => void;
  onLogoutPress: () => void;
}

const LogoutModal: React.FC<LogoutModalProps> = ({
  visible,
  onClose,
  onLogoutPress,
}) => {
  return (
    <Modal
      transparent={true}
      visible={visible}
      animationType="fade"
      onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <View style={styles.modelView}>
          <Text style={styles.modalTitle}>Logout</Text>
          <Text style={styles.modalMessage}>
            Do you want to logout from your account?
          </Text>
          <View style={styles.buttonContainer}>
            <TouchableOpacity onPress={onClose} style={styles.cancelButton}>
              <Text style={styles.cancelText}>No, Stay</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={onLogoutPress}
              style={styles.logoutButtonContainer}>
              <Text style={styles.logoutText}>Yes, Logout</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modelView: {
    width: width - 40,
    backgroundColor: '#242323',
    borderRadius: 10,
    padding: 20,
  },
  modalTitle: {
    fontSize: fontSize.f16,
    marginBottom: 10,
    color: Colors.white,
    fontFamily: fonts['Poppins-SemiBold'],
  },
  modalMessage: {
    fontSize: fontSize.f14,
    marginBottom: 20,
    color: '#B1B0B0',
    fontFamily: fonts['Poppins-Regular'],
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    width: '100%',
  },
  cancelButton: {
    padding: 10,
  },
  cancelText: {
    color: Colors.white,
    fontSize: fontSize.f14,
    fontFamily: fonts['Poppins-Medium'],
  },
  logoutButtonContainer: {
    padding: 10,
  },
  logoutText: {
    color: Colors.red,
    fontSize: fontSize.f14,
    fontFamily: fonts['Poppins-Medium'],
  },
});

export default LogoutModal;
