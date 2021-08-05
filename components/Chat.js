import React from 'react';
import { View, Text } from 'react-native';

// The applications main chat component that renders the UI
export default class Chat extends React.Component {

    render() {
        {/*gives us the name received by start screen*/ }
        let name = this.props.route.params.name; // OR ...
        // let { name } = this.props.route.params;
        {/* gives us the name at the top of the page*/ }
        this.props.navigation.setOptions({ title: name });

        return (

            /* sets style for chat room - background color etc*/
            < View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: this.props.route.params.setColor }
            }>
                <Text>Hello Screen2!</Text>
            </View >
        )
    }
}