import React from 'react';
import { View, Text, Button, TextInput, StyleSheet, TouchableOpacity } from 'react-native';

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
            <View style={styles.homeScreen}>
                <Text style={styles.title}>Chat App</Text>
                <View style={styles.userBox}>
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
                    {/* styles buttons to change color of background on chat screen */}
                    <View style={styles.colors}>
                        <TouchableOpacity
                            style={styles.color1}
                            onPress={() => this.setState({ setColor: 'yellow' })}
                        />
                        <TouchableOpacity
                            style={styles.color2}
                            onPress={() => this.setState({ setColor: 'blue' })}
                        />
                        <TouchableOpacity
                            style={styles.color3}
                            onPress={() => this.setState({ setColor: 'black' })}
                        />
                        <TouchableOpacity
                            style={styles.color4}
                            onPress={() => this.setState({ setColor: 'orange' })}
                        />
                    </View>
                    {/*brings us to chat room*/}
                    <Button
                        title='Go to Chat'
                        style={styles.buttonTheme, { backgroundColor: this.state.setColor }}
                        onPress={() => this.props.navigation.navigate('Chat', { name: this.state.name, setColor: this.state.setColor })}
                    />
                </View>
            </View>
        )
    }
}


const styles = StyleSheet.create({
    homeScreen: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        color: 'black',
        fontWeight: 'bold',
        backgroundColor: 'indigo',
    },
    textInput: {
        height: 80,
        borderColor: 'black',
        borderWidth: 1,
        margin: '10%',
        padding: '10%',
        fontSize: 16,
        fontWeight: '300',
        opacity: .5
    },
    userBox: {
        borderStyle: 'solid',
        color: 'black',
        backgroundColor: 'white',
        height: '50%',
        width: '80%'

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
    },
    color1: {
        backgroundColor: 'yellow',
        width: 50,
        height: 50,
        borderRadius: 25,
    },

    color2: {
        backgroundColor: 'blue',
        width: 50,
        height: 50,
        borderRadius: 25
    },
    color3: {
        backgroundColor: 'black',
        width: 50,
        height: 50,
        borderRadius: 25
    },

    color4: {
        backgroundColor: 'orange',
        width: 50,
        height: 50,
        borderRadius: 25
    }

})