import PropTypes from 'prop-types';
import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import * as Location from 'expo-location';
import * as ImagePicker from 'expo-image-picker';
import * as Camera from 'expo-camera';
import * as Permssions from 'expo-permissions';
import MapView from 'react-native-maps';
/*const firebase = require("firebase");
// Required for side-effects
require("firebase/firestore");*/

import firebase from 'firebase';
import firestore from 'firebase';

export default class CustomActions extends React.Component {

    constructor() {
        super();
        this.state = {
            image: null
        };
    }

    pickImage = async () => {
        const { status } = await Camera.requestPermissionsAsync();

        try {
            if (status === "granted") {
                const result = await ImagePicker.launchImageLibraryAsync({
                    mediaTypes: ImagePicker.MediaTypeOptions.Images,
                    allowsEditing: false,
                    quality: 1,
                }).catch((error) => console.log(error));
                if (!result.cancelled) {
                    const imageUrl = await this.uploadImageFetch(result.uri);
                    console.log(imageUrl);
                    this.props.onSend({ image: imageUrl });
                }
            }
        } catch (error) {
            console.log(error.message);
        }
    }

    takePhoto = async () => {
        const { status } = await Camera.requestPermissionsAsync();

        try {
            if (status === 'granted') {
                let result = await ImagePicker.launchCameraAsync().catch(error => console.log(error));

                if (!result.cancelled) {
                    const imageUrl = await this.uploadImageFetch(result.uri);
                    this.props.onSend({ image: imageUrl });
                }
            }
        } catch (error) { console.log(error.message); }
    }


    uploadImageFetch = async (uri) => {
        console.log('in upload');
        try {
            const blob = await new Promise((resolve, reject) => {
                const xhr = new XMLHttpRequest();
                xhr.onload = function () {
                    resolve(xhr.response);
                };
                xhr.onerror = function (e) {
                    console.log(e);
                    reject(new TypeError("Network request failed"));
                };
                xhr.responseType = "blob";
                xhr.open("GET", uri, true);
                xhr.send(null);
            });

            const imageNameBefore = uri.split("/");
            const imageName = imageNameBefore[imageNameBefore.length - 1];
            const ref = firebase.storage().ref().child(`images/${imageName}`);
            const snapshot = await ref.put(blob);
            blob.close();
            return await snapshot.ref.getDownloadURL();
        } catch (error) { console.log(error.message) }
    }

    getLocation = async () => {
        try {
            const { status } = await Location.requestForegroundPermissionsAsync();
            if (status === "granted") {
                const result = await Location.getCurrentPositionAsync(
                    {}
                ).catch((error) => console.log(error));
                const longitude = JSON.stringify(result.coords.longitude);
                const altitude = JSON.stringify(result.coords.latitude);
                if (result) {
                    this.props.onSend({
                        location: {
                            longitude: result.coords.longitude,
                            latitude: result.coords.latitude,
                        },
                    });
                }
            }
        } catch (error) {
            console.log(error.message);
        }
    };

    onActionPress = () => {
        const options = ['Choose From Library', 'Take Picture', 'Send Location', 'Cancel'];
        const cancelButtonIndex = options.length - 1;
        this.context.actionSheet().showActionSheetWithOptions(
            {
                options,
                cancelButtonIndex,
            },
            async (buttonIndex) => {
                switch (buttonIndex) {
                    case 0:
                        console.log('user wants to pick an image');
                        return this.pickImage();
                        return;
                    case 1:
                        console.log('user wants to take a photo');
                        return this.takePhoto();
                        return;
                    case 2:
                        return this.getLocation();
                    default:
                }
            },
        );
    };

    render() {
        return (
            <TouchableOpacity style={[styles.container]} onPress={this.onActionPress}>
                <View style={[styles.wrapper, this.props.wrapperStyle]}>
                    <Text style={[styles.iconText, this.props.iconTextStyle]}>+</Text>
                </View>
            </TouchableOpacity>
        );


    }
}

const styles = StyleSheet.create({
    container: {
        width: 26,
        height: 26,
        marginLeft: 10,
        marginBottom: 10,
    },
    wrapper: {
        borderRadius: 13,
        borderColor: '#b2b2b2',
        borderWidth: 2,
        flex: 1,
    },
    iconText: {
        color: '#b2b2b2',
        fontWeight: 'bold',
        fontSize: 16,
        backgroundColor: 'transparent',
        textAlign: 'center',
    },
});

CustomActions.contextTypes = {
    actionSheet: PropTypes.func,
};