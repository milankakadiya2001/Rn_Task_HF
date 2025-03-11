import {StyleSheet, TouchableOpacity, View} from 'react-native';
import React from 'react';
import {useNavigation} from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import CText from './CText';

// Local Imports
import {moderateScale} from '../../common/constants';
import {colors, styles} from '../../themes';

export default function CHeader(props) {
  const {title, rightIcon = false, leftIcon = false} = props;
  const navigation = useNavigation();

  const goBack = () => navigation.goBack();

  return (
    <View style={localStyles.container}>
      {leftIcon ? (
        <View style={localStyles.rightContainer}></View>
      ) : (
        <TouchableOpacity onPress={goBack} style={localStyles.backIconStyle}>
          <Ionicons
            name="arrow-back-outline"
            size={moderateScale(24)}
            color={colors.textColor}
          />
        </TouchableOpacity>
      )}
      {!!title && (
        <CText
          numberOfLines={1}
          align={'center'}
          style={localStyles.titleText}
          type={'B18'}>
          {title}
        </CText>
      )}
      {!!rightIcon ? (
        rightIcon
      ) : (
        <View style={localStyles.rightContainer}></View>
      )}
    </View>
  );
}

const localStyles = StyleSheet.create({
  container: {
    ...styles.rowSpaceBetween,
    ...styles.ph20,
    ...styles.pv15,
  },
  titleText: {
    ...styles.ph20,
  },
  rightContainer: {
    height: moderateScale(36),
    width: moderateScale(82),
  },
  backIconStyle: {
    height: moderateScale(36),
    width: moderateScale(36),
    ...styles.center,
  },
});
