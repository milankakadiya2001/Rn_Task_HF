import React, {useState, useEffect} from 'react';
import {StyleSheet, View, FlatList, TouchableOpacity} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useIsFocused} from '@react-navigation/native';

// Local Imports
import CSafeAreaView from '../../components/common/CSafeAreaView';
import CHeader from '../../components/common/CHeader';
import CButton from '../../components/common/CButton';
import CText from '../../components/common/CText';
import TimerCategory from '../../components/timerComponent/TimerCategory';
import {colors, styles} from '../../themes';
import {moderateScale} from '../../common/constants';
import {StackNav} from '../../navigation/NavigationKeys';
import strings from '../../i18n/en';

export default function HomeScreen({navigation}) {
  const isFocused = useIsFocused();
  const [groupedTimers, setGroupedTimers] = useState({});

  useEffect(() => {
    loadTimers();
  }, [isFocused]);

  const loadTimers = async () => {
    try {
      const savedTimers = await AsyncStorage.getItem('timers');
      if (savedTimers) {
        const parsedTimers = JSON.parse(savedTimers);
        groupTimersByCategory(parsedTimers);
      }
    } catch (error) {
      console.error('Error loading timers:', error);
    }
  };

  const groupTimersByCategory = timerList => {
    const grouped = timerList.reduce((acc, timer) => {
      if (!acc[timer.category]) {
        acc[timer.category] = [];
      }
      acc[timer.category].push(timer);
      return acc;
    }, {});
    setGroupedTimers(grouped);
  };

  const onPressAdd = () => navigation.navigate(StackNav.AddTimer);
  const onPressHistory = () => navigation.navigate(StackNav.History);

  const RightIcon = () => {
    return (
      <View style={localStyles.rowContainer}>
        <TouchableOpacity
          style={localStyles.buttonStyle}
          onPress={onPressHistory}>
          <Ionicons
            name="time-outline"
            size={moderateScale(24)}
            color={colors.textColor}
          />
        </TouchableOpacity>
        <TouchableOpacity style={localStyles.buttonStyle} onPress={onPressAdd}>
          <Ionicons
            name="add"
            size={moderateScale(24)}
            color={colors.textColor}
          />
        </TouchableOpacity>
      </View>
    );
  };

  const renderCategory = ({item: category}) => (
    <TimerCategory
      category={category}
      timers={groupedTimers[category]}
      onUpdateTimers={loadTimers}
    />
  );

  const EmptyState = () => (
    <View style={localStyles.emptyContainer}>
      <CText type="B18" align="center" color={colors.textSecondary}>
        {strings.noTimers}
        {'\n'}
        {strings.addFirstTimer}
      </CText>
      <CButton
        title="Add Timer"
        onPress={onPressAdd}
        containerStyle={styles.mt20}
      />
    </View>
  );

  return (
    <CSafeAreaView>
      <CHeader
        title={strings.myTimers}
        leftIcon={true}
        rightIcon={<RightIcon />}
      />
      {Object.keys(groupedTimers).length === 0 ? (
        <EmptyState />
      ) : (
        <FlatList
          data={Object.keys(groupedTimers)}
          renderItem={renderCategory}
          keyExtractor={item => item}
          contentContainerStyle={styles.p20}
        />
      )}
    </CSafeAreaView>
  );
}

const localStyles = StyleSheet.create({
  container: {
    ...styles.flex,
  },
  emptyContainer: {
    ...styles.flex,
    ...styles.center,
  },
  buttonStyle: {
    height: moderateScale(36),
    width: moderateScale(36),
    borderRadius: moderateScale(36 / 2),
    backgroundColor: colors.primaryLight,
    ...styles.center,
  },
  rowContainer: {
    ...styles.rowCenter,
    gap: moderateScale(10),
  },
});
