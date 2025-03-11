import React from 'react';
import {StyleSheet, View, Modal} from 'react-native';

// Local Imports
import CText from '../common/CText';
import CButton from '../common/CButton';
import {colors, styles} from '../../themes';

export default function CompletionModal({visible, timerName, onClose}) {
  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={localStyles.modalContainer}>
        <View style={localStyles.modalContent}>
          <CText type="B24" align="center">
            Congratulations! 🎉
          </CText>
          <CText type="M16" align="center" style={styles.mt10}>
            {`Your timer "${timerName}" has completed!`}
          </CText>
          <CButton title="OK" onPress={onClose} containerStyle={styles.mt20} />
        </View>
      </View>
    </Modal>
  );
}

const localStyles = StyleSheet.create({
  modalContainer: {
    ...styles.flex,
    ...styles.center,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: colors.backgroundColor,
    borderRadius: 16,
    padding: 20,
    width: '80%',
  },
});
