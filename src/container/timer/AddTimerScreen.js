import React, {useState} from 'react';
import {
  StyleSheet,
  View,
  TextInput,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Local Imports
import CSafeAreaView from '../../components/common/CSafeAreaView';
import CHeader from '../../components/common/CHeader';
import CText from '../../components/common/CText';
import CButton from '../../components/common/CButton';
import {colors, styles} from '../../themes';
import {DEFAULT_CATEGORIES} from '../../api/constants';
import {Timer} from '../../api/models/Timer';
import {moderateScale} from '../../common/constants';
import typography from '../../themes/typography';
import strings from '../../i18n/en';

export default function AddTimerScreen({navigation}) {
  const [name, setName] = useState('');
  const [duration, setDuration] = useState('');
  const [category, setCategory] = useState(DEFAULT_CATEGORIES[0]);

  const saveTimer = async () => {
    try {
      const newTimer = new Timer(name, parseInt(duration), category);

      const existingTimers = await AsyncStorage.getItem('timers');
      const timers = existingTimers ? JSON.parse(existingTimers) : [];

      timers.push(newTimer);

      await AsyncStorage.setItem('timers', JSON.stringify(timers));

      navigation.goBack();
    } catch (error) {
      console.error('Error saving timer:', error);
    }
  };

  const renderItem = ({item}) => {
    return (
      <TouchableOpacity
        onPress={() => setCategory(item)}
        style={[
          localStyles.categoryButton,
          {
            backgroundColor:
              category === item ? colors.primaryMain : colors.primaryLight,
          },
        ]}>
        <CText
          type="S14"
          color={category === item ? colors.backgroundColor : colors.textColor}>
          {item}
        </CText>
      </TouchableOpacity>
    );
  };

  return (
    <CSafeAreaView>
      <CHeader title={strings.addTimer} />
      <View style={localStyles.container}>
        <CText type="B18" style={styles.mb10}>
          {strings.timerName}
        </CText>
        <TextInput
          style={localStyles.input}
          value={name}
          onChangeText={setName}
          placeholder={strings.enterTimerName}
        />

        <CText type="B18" style={[styles.mb10, styles.mt20]}>
          Duration (seconds)
        </CText>
        <TextInput
          style={localStyles.input}
          value={duration}
          onChangeText={setDuration}
          keyboardType="numeric"
          placeholder="Enter duration in seconds"
        />

        <CText type="B18" style={[styles.mb10, styles.mt20]}>
          Category
        </CText>
        <FlatList
          data={DEFAULT_CATEGORIES}
          renderItem={renderItem}
          keyExtractor={(item, index) => index.toString()}
          contentContainerStyle={localStyles.categoryContainer}
        />
        <CButton
          title="Save Timer"
          onPress={saveTimer}
          containerStyle={styles.mv20}
          disabled={!name || !duration}
        />
      </View>
    </CSafeAreaView>
  );
}

const localStyles = StyleSheet.create({
  container: {
    ...styles.ph20,
    ...styles.flex,
  },
  input: {
    borderWidth: moderateScale(1),
    borderColor: colors.bColor,
    borderRadius: moderateScale(8),
    ...styles.p10,
    ...typography.fontSizes.f16,
    ...typography.fontWeights.Medium,
  },
  categoryContainer: {
    ...styles.wrap,
    ...styles.rowStart,
    ...styles.mt10,
    gap: moderateScale(10),
  },
  categoryButton: {
    ...styles.pv10,
    ...styles.ph15,
    ...styles.rowStart,
    ...styles.selfStart,
    borderRadius: moderateScale(20),
  },
});
