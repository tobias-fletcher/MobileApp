import React, { Component } from "react";
import { GiftedChat, Bubble, InputToolbar } from 'react-native-gifted-chat';
import "react-native-gesture-handler";
import { View, Platform, KeyboardAvoidingView, Button, Flatlist, Text } from 'react-native';

// import react Navigation
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { NetInfoCellularGeneration } from "@react-native-community/netinfo";
import NetInfo from '@react-native-community/netinfo';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CustomActions from './CustomActions';
import * as ImagePicker from 'expo-image-picker';
import * as Camera from 'expo-camera';
import MapView from 'react-native-maps';
import * as Location from 'expo-location'
import '@firebase/util';
import '@firebase/logger';
import '@firebase/webchannel-wrapper';

const Stack = createStackNavigator();

const firebase = require('firebase');
require('firebase/firestore');


export default class App extends React.Component {

    constructor() {
        super();
        this.state = {
            messages: [],
            uid: 0,
            loggedInText: 'Not Connected',
            isConnected: false,
            location: null,
            image: null
        }

        const firebaseConfig = {
            apiKey: "AIzaSyAYUbePWv5E4FuTdrVtvWqhTZXOylpV4ps",
            authDomain: "messageapp-d94fd.firebaseapp.com",
            projectId: "messageapp-d94fd",
            storageBucket: "messageapp-d94fd.appspot.com",
            messagingSenderId: "765762873262",
            appId: "1:765762873262:web:edec137415319afbb40a3f",
            measurementId: "G-9DKBT98LZ0"
        }

        if (!firebase.apps.length) {
            firebase.initializeApp(firebaseConfig);
        }
        this.referenceChatMessages = firebase.firestore().collection('messages');
        this.referenceMessageUser = null;
    }



    async addMessages() {
        const message = this.state.messages[0];
        this.referenceChatMessages.add({
            _id: message._id,
            createdAt: message.createdAt,
            image: message.image || null,
            location: message.location || null,
            text: message.text || null,
            user: message.user,

        })
    }

    async saveMessages() {
        try {
            await AsyncStorage.setItem('messages', JSON.stringify(this.state.messages));
        } catch (error) {
            console.log(error.message);
        }
    }

    async getMessages() {
        let messages = '';
        try {
            messages = (await AsyncStorage.getItem('messages')) || [];
            this.setState({
                messages: JSON.parse(messages)
            });
        } catch (error) {
            console.log(error.message);
        }
    }

    async deleteMessages() {
        try {
            await AsyncStorage.removeItem('messages');
            this.setState({
                messages: []
            })
        } catch (error) {
            console.log(error.message);
        }
    }

    onCollectionUpdate = (querySnapshot) => {
        const messages = [];
        // go through each document
        querySnapshot.forEach((doc) => {
            // get the QueryDocumentSnapshot's data
            let data = doc.data();
            messages.push({
                _id: data._id,
                createdAt: data.createdAt.toDate(),
                text: data.text || '',
                user: {
                    _id: data.user._id,
                    name: data.user.name,
                },
                image: data.image || null,
                location: data.location || null
            });
        });
        this.setState({
            messages,
        });
    }

    renderBubble(props) {
        return (<Bubble {...props}
            wrapperStyle={{
                left: {
                    backgroundColor: 'white',
                },
                right: {
                    backgroundColor: 'blue'
                }
            }} />
        )
    }

    onSend(messages = []) {
        this.setState(previousState => ({
            messages: GiftedChat.append(previousState.messages, messages),
        }),
            // Make sure to call addMessages so they get saved to the server
            () => {
                this.addMessages();
                this.saveMessages();
                // Calls function saves to local storage
            })
    }

    renderInputToolbar(props) {
        if (this.state.isConnected == false) {
        } else {
            return (
                <InputToolbar
                    {...props}
                />
            );
        }
    }

    renderCustomActions = (props) => {
        return <CustomActions {...props} />;
    };

    renderCustomView(props) {
        const { currentMessage } = props;
        if (currentMessage.location) {
            return (
                <MapView
                    style={{
                        width: 150,
                        height: 100,
                        borderRadius: 13,
                        margin: 3
                    }}
                    region={{
                        latitude: currentMessage.location.latitude,
                        longitude: currentMessage.location.longitude,
                        latitudeDelta: 0.0922,
                        longitudeDelta: 0.0421,
                    }}
                />
            );
        }
        return null;
    }
    render() {

        let name = this.props.route.params.name;
        this.props.navigation.setOptions({ title: name });

        return (
            <View style={{ flex: 1, backgroundColor: this.props.route.params.setColor }}>
                <Text>{this.state.loggedInText}</Text>
                <GiftedChat
                    renderBubble={this.renderBubble.bind(this)}
                    renderInputToolbar={this.renderInputToolbar.bind(this)}
                    renderActions={this.renderCustomActions}
                    renderCustomView={this.renderCustomView}
                    showUserAvatar={true}
                    renderAvatarOnTop={true}
                    messages={this.state.messages}
                    onSend={messages => this.onSend(messages)}
                    user={this.state.user}
                />
                {Platform.OS === 'android' ? <KeyboardAvoidingView behavior="height" /> : null}
            </View>
        );
    }

    componentDidMount() {

        NetInfo.fetch().then(connection => {
            if (connection.isConnected) {
                this.setState({ isConnected: true });
                console.log('online');

                this.authUnsubscribe = firebase.auth().onAuthStateChanged((user) => {
                    if (!user) {
                        firebase.auth().signInAnonymously();
                    }

                    this.setState({
                        uid: user.uid,
                        messages: [],
                        loggedInText: 'Connected',
                        user: {
                            _id: user.uid,
                            name: 'React',
                            avatar: 'https://placeimg.com/140/140/any'
                        },
                        image: this.state.image,
                        location: {
                            longitude: 11.5249684,
                            latitude: 48.0643933,
                        }
                    });
                    this.referenceMessagesUser = firebase.firestore().collection('messages').where('uid', '==', this.state.uid);
                    this.unsubscribe = this.referenceChatMessages.orderBy("createdAt", "desc").onSnapshot(this.onCollectionUpdate);
                });
            } else {
                console.log('offline');
                this.setState({ isConnected: false })
                // Calls messeages from offline storage
                this.getMessages();
            }
        });
    }

    componentWillUnmount() {
        this.authUnsubscribe();
    }
}
