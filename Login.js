import React, { Component } from 'react';
import AuthService from './AuthService';
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  Image,
  TouchableHighlight,
  ActivityIndicator
} from 'react-native';

class Login extends Component{

    constructor(props){
        super(props);
        this.state = {
            showProgress: false
        }
    }

    onLoginPressed(){
        this.setState({showProgress: true});
        AuthService.login({
            username: this.state.username,
            password: this.state.password
        }, (res) => {
            this.setState(Object.assign({
                showProgress: false
            }, res))

            if (res.success && this.props.onLogin) {
                this.props.onLogin();
            }
        });
    }

    render(){
        var errCtrl = <View />;
        if (!this.state.success && this.state.badCredentials) {
            errCtrl = <Text style={styles.error}>
                        That username and password combination did not work
                      </Text>;
        }

        if (!this.state.success && this.state.unknownError) {
            errCtrl = <Text style={styles.error}>
                        We experienced an unexpected issue
                      </Text>;
        }

        return(
            <View style={styles.container}>
                <Image style={styles.logo} source={{uri: "Octocat"}} />
                <Text style={styles.heading}> Github Browser </Text>

                <TextInput
                    onChangeText={(text)=> this.setState({username: text})}
                    style={styles.input}
                    autoFocus={true}
                    placeholder="Github Username" />
                <TextInput onChangeText={(pass)=> this.setState({password: pass})} style={styles.input} placeholder="Github Password" secureTextEntry={true} />
                <TouchableHighlight onPress={this.onLoginPressed.bind(this)} style={styles.button}>
                        <Text style={styles.buttonText}> Login </Text>
                </TouchableHighlight>
                {errCtrl}

                <ActivityIndicator animating={this.state.showProgress} size="large" color="#48BBEC" style={styles.loader}/>
             </View>
        )
    }
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: "#F5FCFF",
        flex: 1,
        paddingTop: 40,
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
        color: '#48BBEC'
    },
    button: {
        height: 50,
        backgroundColor: '#48BBEC',
        alignSelf: 'stretch',
        marginTop: 10,
        justifyContent: 'center'
    },
    buttonText:{
        fontSize: 25,
        color: '#fff',
        alignSelf: 'center'
    },
    loader: {
        marginTop: 20,
    },
    error: {
        fontSize: 15,
        color: 'red',
        paddingTop: 10
    }
})

module.exports = Login;
