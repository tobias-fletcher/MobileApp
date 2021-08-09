import React, { Component } from "react";
import { GiftedChat, Bubble } from 'react-native-gifted-chat';
import "react-native-gesture-handler";
import { View, Platform, KeyboardAvoidingView } from 'react-native';

// import react Navigation
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

const Stack = createStackNavigator();
export default class App extends React.Component {

    constructor() {
        super();
        this.state = {
            messages: [],
        }
    }

    componentDidMount() {
        this.setState({
            messages: [
                {
                    _id: 1,
                    text: 'Hello developer',
                    createdAt: new Date(),
                    user: {
                        _id: 2,
                        name: 'React Native',
                        avatar: 'https://placeimg.com/140/140/any',
                    },
                },
                {
                    _id: 2,
                    text: 'This is a system message',
                    createdAt: new Date(),
                    system: true,
                },
            ],
        })
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
        }))
    }

    render() {

        let name = this.props.route.params.name;
        this.props.navigation.setOptions({ title: name });

        return (
            <View style={{ flex: 1, backgroundColor: this.props.route.params.setColor }}>
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
}
