import React, {
  useState,
  useEffect,
  useRef,
  forwardRef,
  useImperativeHandle,
} from 'react';
import {StyleSheet, View, TouchableOpacity} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Ionicons from 'react-native-vector-icons/Ionicons';

// Local Imports
import CText from '../common/CText';
import {colors, styles} from '../../themes';
import {TIMER_STATUS} from '../../api/constants';
import {moderateScale} from '../../common/constants';
import CompletionModal from './CompletionModal';

const TimerItem = forwardRef(({timer, onUpdate}, ref) => {
  const [currentTimer, setCurrentTimer] = useState(timer);
  const [showModal, setShowModal] = useState(false);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (currentTimer.status === TIMER_STATUS.RUNNING) {
      startTimer();
    }
    return () => clearInterval(intervalRef.current);
  }, [currentTimer.status]);

  useImperativeHandle(ref, () => ({
    startTimer: () => {
      if (currentTimer.status !== TIMER_STATUS.COMPLETED) {
        const updatedTimer = {
          ...currentTimer,
          status: TIMER_STATUS.RUNNING,
        };
        setCurrentTimer(updatedTimer);
        updateTimerInStorage(updatedTimer);
      }
    },
    pauseTimer: () => {
      if (currentTimer.status === TIMER_STATUS.RUNNING) {
        const updatedTimer = {
          ...currentTimer,
          status: TIMER_STATUS.PAUSED,
        };
        setCurrentTimer(updatedTimer);
        updateTimerInStorage(updatedTimer);
      }
    },
    resetTimer: () => {
      const updatedTimer = {
        ...currentTimer,
        remainingTime: currentTimer.duration,
        status: TIMER_STATUS.PAUSED,
        progress: 0,
      };
      setCurrentTimer(updatedTimer);
      updateTimerInStorage(updatedTimer);
    },
  }));

  const startTimer = () => {
    intervalRef.current = setInterval(() => {
      setCurrentTimer(prev => {
        if (prev.remainingTime <= 0) {
          clearInterval(intervalRef.current);
          handleTimerComplete();
          return {...prev, status: TIMER_STATUS.COMPLETED};
        }
        return {...prev, remainingTime: prev.remainingTime - 1};
      });
    }, 1000);
  };

  const handleTimerComplete = async () => {
    const history = (await AsyncStorage.getItem('timerHistory')) || '[]';
    const historyArray = JSON.parse(history);
    historyArray.push({
      ...currentTimer,
      completedAt: new Date().toISOString(),
    });
    await AsyncStorage.setItem('timerHistory', JSON.stringify(historyArray));

    setShowModal(true);
  };

  const updateTimerInStorage = async updatedTimer => {
    const timers = JSON.parse((await AsyncStorage.getItem('timers')) || '[]');
    const index = timers.findIndex(t => t.id === updatedTimer.id);
    if (index !== -1) {
      timers[index] = updatedTimer;
      await AsyncStorage.setItem('timers', JSON.stringify(timers));
      onUpdate();
    }
  };

  const getProgressPercentage = () => {
    return (currentTimer.remainingTime / currentTimer.duration) * 100;
  };

  return (
    <>
      <View style={localStyles.container}>
        <View style={localStyles.header}>
          <CText type="B16">{currentTimer.name}</CText>
          <CText type="M14" color={colors.textSecondary}>
            {`${Math.floor(currentTimer.remainingTime / 60)}:${String(
              currentTimer.remainingTime % 60,
            ).padStart(2, '0')}`}
          </CText>
        </View>

        <View style={localStyles.progressContainer}>
          <View
            style={[
              localStyles.progressBar,
              {width: `${getProgressPercentage()}%`},
            ]}
          />
        </View>

        <View style={localStyles.controls}>
          <TouchableOpacity
            onPress={() => {
              if (currentTimer.status === TIMER_STATUS.RUNNING) {
                ref.current.pauseTimer();
              } else {
                ref.current.startTimer();
              }
            }}
            disabled={currentTimer.status === TIMER_STATUS.COMPLETED}>
            <Ionicons
              name={
                currentTimer.status === TIMER_STATUS.RUNNING ? 'pause' : 'play'
              }
              size={moderateScale(24)}
              color={colors.primaryMain}
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => ref.current.resetTimer()}>
            <Ionicons
              name="refresh"
              size={moderateScale(24)}
              color={colors.primaryMain}
            />
          </TouchableOpacity>
        </View>
      </View>
      <CompletionModal
        visible={showModal}
        timerName={currentTimer.name}
        onClose={() => setShowModal(false)}
      />
    </>
  );
});

const localStyles = StyleSheet.create({
  container: {
    ...styles.mv10,
    backgroundColor: colors.backgroundColor,
    borderRadius: moderateScale(8),
    padding: moderateScale(15),
    borderWidth: moderateScale(1),
    borderColor: colors.bColor,
  },
  header: {
    ...styles.rowSpaceBetween,
    ...styles.mb10,
  },
  progressContainer: {
    height: moderateScale(4),
    backgroundColor: colors.bColor,
    borderRadius: moderateScale(2),
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: colors.primaryMain,
  },
  controls: {
    ...styles.rowSpaceAround,
    ...styles.mt15,
  },
});

export default TimerItem;
