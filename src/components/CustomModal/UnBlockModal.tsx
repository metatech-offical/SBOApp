import {View, Text, StyleSheet, Modal, TouchableOpacity} from 'react-native';
import CustomButton from '@components/CustomButtons/CustomButton';
import {Colors} from '@constant/colors';
import {fonts} from '@constant/fontfamily';
import {fontSize, hp} from '@constant/fontSize';

const UnblockModal = ({
  modalVisible,
  handleCancel,
  selectedUser,
  handleUnblock,
  isLoading,
}: UnblockModalProps) => {
  return (
    <View>
      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={handleCancel}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              Unblock{' '}
              {selectedUser?.username || selectedUser?.blocked?.username}?
            </Text>
            <Text style={styles.modalUsername}>
              @{selectedUser?.username || selectedUser?.blocked?.username}
            </Text>
            <Text style={styles.modalDesc}>
              {selectedUser?.username || selectedUser?.blocked?.username} will
              now be able to request follow and message you on SBO. They won't
              be notified that you unblocked them.
            </Text>
            <View style={styles.modalBtnRow}>
              <TouchableOpacity style={styles.cancelBtn} onPress={handleCancel}>
                <Text style={styles.cancelBtnText}>Cancel</Text>
              </TouchableOpacity>
              <CustomButton
                text="Unblock"
                onPress={handleUnblock}
                textStyle={styles.unblockButtonText}
                btnStyle={styles.unblockBtn}
                isLoading={isLoading}
              />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default UnblockModal;
const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#251E37',
    borderRadius: 16,
    padding: 24,
    width: '90%',
    alignItems: 'center',
    minHeight: hp('20%'),
  },
  modalTitle: {
    fontSize: fontSize.f14,
    fontFamily: fonts['Poppins-SemiBold'],
    marginBottom: 4,
    color: Colors.white,
  },
  modalUsername: {
    fontSize: fontSize.f14,
    color: '#B0AFB6',
    marginBottom: 12,
    fontFamily: fonts['Poppins-Regular'],
  },
  modalDesc: {
    fontSize: fontSize.f10,
    fontFamily: fonts['Poppins-Regular'],
    color: Colors.white,
    textAlign: 'center',
    marginBottom: 20,
  },
  modalBtnRow: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cancelBtn: {
    marginRight: 8,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#FFFFFF26',
    alignItems: 'center',
    justifyContent: 'center',
    height: 55,
    width: '45%',
  },
  cancelBtnText: {
    fontSize: fontSize.f14,
    color: Colors.white,
    fontFamily: fonts['Poppins-Medium'],
  },
  unblockBtn: {
    marginLeft: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    height: 50,
    width: '45%',
    backgroundColor: Colors.white,
  },
  unblockButtonText: {
    color: Colors.black,
    textTransform: 'capitalize',
    fontFamily: fonts['Poppins-Medium'],
    fontSize: fontSize.f14,
  },
});
