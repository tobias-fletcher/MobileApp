import React, { Component } from 'react';
import { StyleSheet, View, Text, TextInput, Button, Alert, ScrollView } from 'react-native';
import Start from './components/Start';
import Chat from './components/Chat';
import 'react-native-gesture-handler';

// import react Navigation
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { LogBox } from 'react-native';


// Ignore all log notifications:
LogBox.ignoreAllLogs();

const Stack = createStackNavigator();

export default class HelloWorld extends Component {
  constructor(props) {
    super(props);
    this.state = { name: '' };
  }
  alertMyText(input = []) {
    Alert.alert(input.name);
  }


  render() {
    return (
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Start"
        >
          <Stack.Screen
            name="Start"
            component={Start}
          />
          <Stack.Screen
            name="Chat"
            component={Chat}
          />
        </Stack.Navigator>
      </NavigationContainer>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center'
  },
  box1: {
    flex: 100,
    backgroundColor: 'blue'
  },
  box2: {
    flex: 100,
    backgroundColor: 'red'
  },
  box3: {
    flex: 100,
    backgroundColor: 'green'
  }
});