import React from 'react';
import AppNavigator from './src/AppNavigator';
import { LogBox, StatusBar, View } from 'react-native';

const App = () => {
    // LogBox.ignoreAllLogs();
    return (
        <View style={{ flex: 1 }}>
            <StatusBar backgroundColor="#000" barStyle="light-content" />
            <AppNavigator />
        </View>
    )
}

export default App;