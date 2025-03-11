import React, {useState, useEffect} from 'react';
import {StyleSheet, View, FlatList} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import moment from 'moment';

// Local Imports
import CSafeAreaView from '../../components/common/CSafeAreaView';
import CHeader from '../../components/common/CHeader';
import CText from '../../components/common/CText';
import CButton from '../../components/common/CButton';
import {colors, styles} from '../../themes';
import strings from '../../i18n/en';

export default function HistoryScreen() {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    try {
      const historyData = await AsyncStorage.getItem('timerHistory');
      if (historyData) {
        setHistory(JSON.parse(historyData).reverse());
      }
    } catch (error) {
      console.error('Error loading history:', error);
    }
  };

  const clearHistory = async () => {
    try {
      await AsyncStorage.setItem('timerHistory', JSON.stringify([]));
      setHistory([]);
    } catch (error) {
      console.error('Error clearing history:', error);
    }
  };

  const renderHistoryItem = ({item}) => (
    <View style={localStyles.historyItem}>
      <View style={styles.rowSpaceBetween}>
        <CText type="B16">{item.name}</CText>
        <CText type="M14" color={colors.textSecondary}>
          {item.duration} {strings.minutes}
        </CText>
      </View>
      <View style={styles.rowSpaceBetween}>
        <CText type="M14" color={colors.textSecondary}>
          {item.category}
        </CText>
        <CText type="M14" color={colors.textSecondary}>
          {moment(item.completedAt).format('MMM DD, YYYY HH:mm')}
        </CText>
      </View>
      {item.halfwayAlertTriggered && (
        <CText type="M12" color={colors.success} style={styles.mt5}>
          {strings.halfwayAlertTriggered}
        </CText>
      )}
    </View>
  );

  const EmptyHistory = () => (
    <View style={localStyles.emptyContainer}>
      <CText type="B18" align="center" color={colors.textSecondary}>
        {strings.noHistoryYet}
        {'\n'}
        {strings.completeTimersMessage}
      </CText>
    </View>
  );

  return (
    <CSafeAreaView>
      <CHeader title={strings.timerHistory} />
      <View style={localStyles.container}>
        {history.length > 0 && (
          <View style={localStyles.headerActions}>
            <CButton
              title={strings.clearHistory}
              onPress={clearHistory}
              bgColor={colors.textSecondary}
            />
          </View>
        )}
        {history.length === 0 ? (
          <EmptyHistory />
        ) : (
          <FlatList
            data={history}
            renderItem={renderHistoryItem}
            keyExtractor={item => `${item.id}-${item.completedAt}`}
            contentContainerStyle={styles.p20}
          />
        )}
      </View>
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
  headerActions: {
    ...styles.rowEnd,
    ...styles.ph20,
    ...styles.mt10,
  },
  historyItem: {
    ...styles.p15,
    ...styles.mb10,
    backgroundColor: colors.backgroundColor,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.bColor,
  },
});
