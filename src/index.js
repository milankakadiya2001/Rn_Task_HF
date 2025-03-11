import {View} from 'react-native';
import React from 'react';

// Local Imports
import {styles} from './themes';
import AppNavigator from './navigation';

export default function index() {
  return (
    <View style={styles.flex}>
      <AppNavigator />
    </View>
  );
}
