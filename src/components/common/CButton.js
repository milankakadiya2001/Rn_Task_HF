//Library Imports
import React from 'react';
import {StyleSheet, TouchableOpacity} from 'react-native';
import Ionincons from 'react-native-vector-icons/Ionicons';

//Local Imports
import {getHeight, moderateScale} from '../../common/constants';
import {colors, styles} from '../../themes';
import CText from './CText';

export default function CButton({
  title,
  type = 'B16',
  color,
  onPress,
  containerStyle,
  style,
  icon = null,
  frontIcon = null,
  children,
  bgColor = colors.primaryLight,
  disabled = false,
  arrowIcon = false,
  ...props
}) {
  return (
    <TouchableOpacity
      disabled={disabled}
      style={[
        localStyle.btnContainer,
        styles.rowCenter,
        containerStyle,
        bgColor && {backgroundColor: bgColor},
      ]}
      onPress={onPress}
      {...props}>
      {/* If Icon Added In Button Front Side */}
      {frontIcon}
      <CText type={type} style={style} color={color ? color : colors.textColor}>
        {title}
      </CText>
      {/* If Icon Added In Button Back Side */}
      {arrowIcon && (
        <Ionincons
          name={'arrow-forward-outline'}
          size={moderateScale(18)}
          style={styles.ml10}
          color={
            (color ? color : colors.backgroundColor,
            disabled && colors.textDisabled)
          }
        />
      )}
      {icon}
      {children}
    </TouchableOpacity>
  );
}

const localStyle = StyleSheet.create({
  btnContainer: {
    height: getHeight(48),
    borderRadius: getHeight(25),
    backgroundColor: colors.primaryDark,
  },
});
