import React, { Component } from 'react';
import AuthService from './AuthService';
import moment from 'moment';
import PushPayload from './PushPayload';
import {
  StyleSheet,
  Text,
  View,
  ListView,
  Image,
  ActivityIndicator,
  TouchableHighlight
} from 'react-native';

class Feed extends Component{

    constructor(props){
        super(props);

        var ds = new ListView.DataSource({
            rowHasChanged: (r1, r2) => r1 != r2
        });

        this.state = {
            dataSource: ds,
            showProgress: true
        }
    }

    componentDidMount(){
        this.fetchFeed();
    }

    fetchFeed(){
        AuthService.getAuthInfo((err, authInfo)=>{
            // 'robbyoconnor'
            var url = 'https://api.github.com/users/'
                    //+ authInfo.user.login
                    + 'robbyoconnor'
                    + '/received_events';

            fetch(url, {
                headers: authInfo.header
            })
            .then((res)=> res.json())
            .then((resData)=> {
                var feedItems = resData.filter((e) => e.type == 'PushEvent');
                this.setState({
                    dataSource: this.state.dataSource.cloneWithRows(feedItems),
                    showProgress: false
                });
            })
        })
    }

    pressRow(rowData){
        this.props.navigator.push({
            title: 'Push Event',
            component: PushPayload,
            passProps: {
                pushEvent: rowData
            }
        })
    }

    renderRow(rowData){
        return(
            <TouchableHighlight
                onPress={()=> this.pressRow(rowData)}
                underlayColor='#ddd'
            >
                <View style={styles.renderBlock}>
                    <Image source={{ uri: rowData.actor.avatar_url }}
                           style={ styles.renderRowImage }
                    />
                    <View style={styles.renderRowContainer}>
                        <Text style={{backgroundColor: '#fff'}}>
                            {moment(rowData.created_at).fromNow()}
                        </Text>
                        <Text style={{backgroundColor: '#fff'}}>
                            <Text style={{
                                    fontWeight: "600"
                            }}> {rowData.actor.login} </Text> pushed to
                        </Text>
                        <Text style={{backgroundColor: '#fff'}}>
                          {rowData.payload.ref.replace('refs/heads/', '')}
                        </Text>
                        <Text style={{backgroundColor: '#fff'}}>
                            at <Text style={{
                                    fontWeight: "600"
                                }}> {rowData.repo.name} </Text>
                        </Text>
                    </View>
                </View>
            </TouchableHighlight>
        )
    }


    render(){
        if (this.state.showProgress) {
            return(
                <View style={styles.showProgress}>
                    <ActivityIndicator
                        size={'large'}
                        animating={this.state.showProgress}
                        color="#48BBEC"
                    >
                    </ActivityIndicator>
                </View>
            )
        }
        return (
            <View style={styles.container}>
                <ListView
                  enableEmptySections={true}
                  dataSource={this.state.dataSource}
                  renderRow={this.renderRow.bind(this)}
                />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container:{
        marginTop: 60,
        marginBottom: 50,
        flex: 1,
        justifyContent: 'flex-start'
    },
    renderBlock:{
        flex: 1,
        flexDirection: 'row',
        padding: 20,
        alignItems: 'center',
        borderColor: '#D7D7D7',
        borderBottomWidth: 1
    },
    renderRowImage:{
        height: 36,
        width: 36,
        borderRadius: 18
    },
    renderRowContainer:{
        paddingLeft: 20
    },
    showProgress:{
        flex: 1,
        justifyContent: 'center'
    }
});

module.exports = Feed;
