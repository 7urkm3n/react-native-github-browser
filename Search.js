import React, { Component } from 'react';
import AuthService from './AuthService';
import SearchResult from './SearchResult'
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  TouchableHighlight,
} from 'react-native';

class Search extends Component{

    constructor(props){
        super(props);
        this.state = {}
    }

    onSearchPressed(){
        this.props.navigator.push({
            component: SearchResult,
            title: 'Results',
            passProps:{
                searchQuery: this.state.searchQuery
            }
        })
    }

    render(){
        return(
            <View style={styles.container}>
                <TextInput
                    onChangeText={(text)=> this.setState({searchQuery: text})}
                    style={styles.input}
                    autoFocus={true}
                    placeholder="Search Query" />
                <TouchableHighlight onPress={this.onSearchPressed.bind(this)} style={styles.button}>
                        <Text style={styles.buttonText}> Search </Text>
                </TouchableHighlight>
             </View>
        )
    }
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: "#F5FCFF",
        flex: 1,
        paddingTop: 100,
        padding: 10,
        alignItems: 'center'
    },
    logo:{
        width: 65,
        height: 55
    },
    heading:{
        fontSize: 30,
        marginTop: 10
    },
    input:{
        height: 50,
        alignSelf: 'stretch',
        marginTop: 10,
        padding: 10,
        paddingLeft: 20,
        fontSize: 18,
        borderWidth: 1,
        color: '#48BBEC',
        borderColor: '#48BBEC'
    },
    button: {
        height: 60,
        backgroundColor: '#48BBEC',
        alignSelf: 'stretch',
        marginTop: 10,
        justifyContent: 'center',

        borderRadius:10,
        borderWidth: 1,
        borderColor: '#fff'
    },
    buttonText:{
        fontSize: 25,
        color: '#fff',
        alignSelf: 'center'
    }
})

module.exports = Search;
