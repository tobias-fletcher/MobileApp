import React, { Component } from "react";
import { GiftedChat, Bubble } from 'react-native-gifted-chat';
import "react-native-gesture-handler";
import { View, Platform, KeyboardAvoidingView, Button, Flatlist, Text } from 'react-native';

// import react Navigation
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

const Stack = createStackNavigator();

const firebase = require('firebase');
require('firebase/firestore');


export default class App extends React.Component {

    constructor() {
        super();
        this.state = {
            messages: [],
            uid: 0,
            loggedInText: 'Please wait...logging in',
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



    addMessages() {
        const message = this.state.messages[0];
        // add a new messages to the collection
        this.referenceChatMessages.add({
            uid: this.state.uid,
            _id: message._id,
            createdAt: message.createdAt,
            text: message.text || null,
            user: message.user,
        });
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

            })
    }

    render() {

        let name = this.props.route.params.name;
        this.props.navigation.setOptions({ title: name });

        return (
            <View style={{ flex: 1, backgroundColor: this.props.route.params.setColor }}>
                <Text>{this.state.loggedInText}</Text>
                <GiftedChat
                    renderBubble={this.renderBubble.bind(this)}
                    messages={this.state.messages}
                    onSend={messages => this.onSend(messages)}
                    user={{
                        _id: 1,
                    }}
                />
                {Platform.OS === 'android' ? <KeyboardAvoidingView behavior="height" /> : null}
            </View>
        );
    }

    componentDidMount() {
        this.authUnsubscribe = firebase.auth().onAuthStateChanged((user) => {
            if (!user) {
                firebase.auth().signInAnonymously();
            }
            this.setState({
                uid: user.uid,
                messages: [],
                loggedInText: 'Hello There',
            });
            this.unsubscribe = this.referenceChatMessages
                .orderBy("createdAt", "desc")
                .onSnapshot(this.onCollectionUpdate);
        });

        // Create reference to the active users messages
        this.referenceMessagesUser = firebase.firestore().collection('messages').where('uid', '==', this.state.uid);
        // Listen for collection changes
        this.unsubscribe = this.referenceChatMessages.orderBy("createdAt", "desc").onSnapshot(this.onCollectionUpdate);
    }

    componentWillUnmount() {
        this.authUnsubscribe();
    }
}
