import React from 'react';
import { View, Text, Button, TextInput, StyleSheet, TouchableOpacity, ImageBackground } from 'react-native';


/*const appBackground = require('../assets/pic.png');*/

export default class Start extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            name: '',
            colors: '',
            setColor: 'white'

        }

    }

    render() {
        return (
            <View
                style={styles.appBackground}
            >

                <View style={styles.homeScreen}>
                    <Text style={styles.title}>Chat App</Text>
                    <View style={styles.userBox}>

                        <View>
                            <Text
                                style={styles.text}>Choose background color</Text>
                        </View>
                        {/* styles buttons to change color of background on chat screen */}
                        <View style={styles.colors}>
                            <TouchableOpacity
                                style={styles.color1}
                                onPress={() => this.setState({ setColor: '#716C7C' })}
                            />
                            <TouchableOpacity
                                style={styles.color2}
                                onPress={() => this.setState({ setColor: '#8771B6' })}
                            />
                            <TouchableOpacity
                                style={styles.color3}
                                onPress={() => this.setState({ setColor: '#5A2AC0' })}
                            />
                            <TouchableOpacity
                                style={styles.color4}
                                onPress={() => this.setState({ setColor: '#2F1566' })}
                            />
                        </View>
                        <View>
                            {/* styles text input */}
                            <TextInput
                                style={styles.textInput}
                                onChangeText={(name) => this.setState({ name })}
                                value={this.state.name}
                                placeholder='Type your name'
                                placeholderTextColor='purple'
                            />
                        </View>
                        {/*brings us to chat room*/}

                    </View>
                    <Button
                        title='Enter Chat Room'
                        color="white"
                        style={(styles.buttonTheme, { backgroundColor: this.state.setColor })}
                        onPress={() => this.props.navigation.navigate('Chat', { name: this.state.name, setColor: this.state.setColor })}
                    />
                </View>
            </View>
        );
    }
}


const styles = StyleSheet.create({
    homeScreen: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        color: 'black',
        fontWeight: 'bold',
        textAlign: 'center'
    },
    text: {
        textAlign: 'center',
        color: 'black',
        fontWeight: '300',
    },
    textInput: {
        height: 40,
        borderColor: 'black',
        borderWidth: 1,
        margin: '10%',
        textAlign: 'center',
        fontSize: 16,
        fontWeight: '300',
        opacity: .5,
        color: 'black',
    },
    userBox: {
        borderStyle: 'solid',
        color: 'black',
        backgroundColor: '#9C8DBE',
        height: '40%',
        width: '80%',
        opacity: 1,
        borderRadius: 65,
        padding: '10%',
        justifyContent: 'center',
        marginBottom: '20%'


    },
    title: {
        fontSize: 45,
        justifyContent: 'center',
        textAlign: 'center',
        alignItems: 'center',
        marginBottom: '20%',
        fontWeight: '600',
        color: 'white'
    },
    buttonTheme: {
        fontSize: 16,
        fontWeight: '600',
        color: 'black',
        backgroundColor: '#757083'
    },
    colors: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        margin: '10%',
        justifyContent: 'center'
    },
    color1: {
        backgroundColor: '#716C7C',
        width: 50,
        height: 50,
        margin: '2%',
        borderRadius: 25,
        opacity: 1
    },

    color2: {
        backgroundColor: '#8771B6',
        width: 50,
        height: 50,
        borderRadius: 25,
        opacity: 1,
        margin: '2%',
    },
    color3: {
        backgroundColor: '#5A2AC0',
        width: 50,
        height: 50,
        borderRadius: 25,
        opacity: 1,
        margin: '2%',
    },

    color4: {
        backgroundColor: '#2F1566',
        width: 50,
        height: 50,
        borderRadius: 25,
        opacity: 1,
        margin: '2%',
    },

    appBackground: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: '#0C051B',
    }

})