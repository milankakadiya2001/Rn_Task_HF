import React, {useState, useEffect, useRef} from 'react';
import {StyleSheet, View, TouchableOpacity, AppState} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Local Imports
import CText from '../common/CText';
import CButton from '../common/CButton';
import {colors, styles} from '../../themes';
import TimerItem from './TimerItem';
import {TIMER_STATUS} from '../../api/constants';
import strings from '../../i18n/en';
import {moderateScale} from '../../common/constants';

export default function TimerCategory({category, timers, onUpdateTimers}) {
  const [isExpanded, setIsExpanded] = useState(true);
  const [categoryTimers, setCategoryTimers] = useState(timers);
  const timerRefs = useRef(new Map());
  const timerInterval = useRef(null);
  const appState = useRef(AppState.currentState);
  const lastActiveTime = useRef(Date.now());

  useEffect(() => {
    setCategoryTimers(timers);
  }, [timers]);

  useEffect(() => {
    const subscription = AppState.addEventListener('change', nextAppState => {
      if (appState.current === 'background' && nextAppState === 'active') {
        // App has come to foreground
        const timePassed = (Date.now() - lastActiveTime.current) / 1000; // time in seconds
        updateTimersAfterBackground(timePassed);
      } else if (nextAppState === 'background') {
        // App is going to background
        lastActiveTime.current = Date.now();
        if (timerInterval.current) {
          clearInterval(timerInterval.current);
          timerInterval.current = null;
        }
      }
      appState.current = nextAppState;
    });

    if (timers.some(timer => timer.status === TIMER_STATUS.RUNNING)) {
      startProgressInterval();
    }

    return () => {
      subscription.remove();
      if (timerInterval.current) {
        clearInterval(timerInterval.current);
      }
    };
  }, [timers]);

  const updateTimersAfterBackground = async timePassed => {
    try {
      const allTimers = JSON.parse(
        (await AsyncStorage.getItem('timers')) || '[]',
      );

      const updatedTimers = allTimers.map(timer => {
        if (
          timer.category === category &&
          timer.status === TIMER_STATUS.RUNNING
        ) {
          const totalSeconds = timer.duration * 60;
          const progressPerSecond = 100 / totalSeconds;
          const newProgress = timer.progress + progressPerSecond * timePassed;

          return {
            ...timer,
            progress: Math.min(newProgress, 100),
            status:
              newProgress >= 100
                ? TIMER_STATUS.COMPLETED
                : TIMER_STATUS.RUNNING,
          };
        }
        return timer;
      });

      await AsyncStorage.setItem('timers', JSON.stringify(updatedTimers));
      onUpdateTimers();

      if (
        updatedTimers.some(
          timer =>
            timer.category === category &&
            timer.status === TIMER_STATUS.RUNNING,
        )
      ) {
        startProgressInterval();
      }
    } catch (error) {
      console.error('Error updating timers after background:', error);
    }
  };

  const startProgressInterval = () => {
    if (!timerInterval.current) {
      timerInterval.current = setInterval(async () => {
        const currentTimers = JSON.parse(
          (await AsyncStorage.getItem('timers')) || '[]',
        );

        const updatedWithProgress = currentTimers.map(timer => {
          if (
            timer.category === category &&
            timer.status === TIMER_STATUS.RUNNING
          ) {
            const newProgress = timer.progress + 100 / (timer.duration * 60);
            return {
              ...timer,
              progress: Math.min(newProgress, 100),
              status:
                newProgress >= 100
                  ? TIMER_STATUS.COMPLETED
                  : TIMER_STATUS.RUNNING,
            };
          }
          return timer;
        });

        await AsyncStorage.setItem(
          'timers',
          JSON.stringify(updatedWithProgress),
        );
        onUpdateTimers();

        if (
          !updatedWithProgress.some(
            timer =>
              timer.category === category &&
              timer.status === TIMER_STATUS.RUNNING,
          )
        ) {
          clearInterval(timerInterval.current);
          timerInterval.current = null;
        }
      }, 1000);
    }
  };

  const startAllTimers = () => {
    timerRefs.current.forEach(timerRef => {
      if (timerRef && timerRef.startTimer) {
        timerRef.startTimer();
      }
    });
  };

  const pauseAllTimers = () => {
    timerRefs.current.forEach(timerRef => {
      if (timerRef && timerRef.pauseTimer) {
        timerRef.pauseTimer();
      }
    });
  };

  const resetAllTimers = () => {
    timerRefs.current.forEach(timerRef => {
      if (timerRef && timerRef.resetTimer) {
        timerRef.resetTimer();
      }
    });
  };

  const hasRunningTimers = categoryTimers.some(
    timer => timer.status === TIMER_STATUS.RUNNING,
  );
  const hasCompletedTimers = categoryTimers.some(
    timer => timer.status === TIMER_STATUS.COMPLETED,
  );

  return (
    <View style={localStyles.container}>
      <TouchableOpacity
        style={localStyles.header}
        onPress={() => setIsExpanded(!isExpanded)}>
        <View style={styles.rowCenter}>
          <CText type="B18">{category}</CText>
          <CText type="M14" color={colors.textSecondary} style={styles.ml10}>
            ({categoryTimers.length})
          </CText>
        </View>
        <Ionicons
          name={isExpanded ? 'chevron-up' : 'chevron-down'}
          size={moderateScale(24)}
          color={colors.textColor}
        />
      </TouchableOpacity>

      {isExpanded && (
        <View>
          <View style={localStyles.actions}>
            <CButton
              title={hasRunningTimers ? strings.pauseAll : strings.startAll}
              onPress={hasRunningTimers ? pauseAllTimers : startAllTimers}
              containerStyle={[
                localStyles.actionButton,
                hasCompletedTimers && styles.opacity50,
              ]}
              disabled={hasCompletedTimers}
            />
            <CButton
              title={strings.resetAll}
              onPress={resetAllTimers}
              containerStyle={localStyles.actionButton}
              bgColor={colors.primaryDark}
              color={colors.backgroundColor}
            />
          </View>

          {categoryTimers.map(timer => (
            <TimerItem
              key={timer.id}
              timer={timer}
              onUpdate={onUpdateTimers}
              ref={ref => {
                if (ref) {
                  timerRefs.current.set(timer.id, ref);
                } else {
                  timerRefs.current.delete(timer.id);
                }
              }}
            />
          ))}
        </View>
      )}
    </View>
  );
}

const localStyles = StyleSheet.create({
  container: {
    borderRadius: moderateScale(10),
    ...styles.mb10,
  },
  header: {
    ...styles.rowSpaceBetween,
    ...styles.pv15,
  },
  actions: {
    ...styles.rowSpaceBetween,
    ...styles.mb10,
  },
  actionButton: {
    width: '47%',
  },
});
