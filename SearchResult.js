import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ListView,
  Image,
  ActivityIndicator,
  TouchableHighlight
} from 'react-native';

class SearchResult extends Component{

    constructor(props){
        super(props);

        var ds = new ListView.DataSource({
            rowHasChanged: (r1, r2) => r1 != r2
        });

        this.state = {
            dataSource: ds,
            showProgress: true,
            searchQuery: props.searchQuery
        }
    }

    componentDidMount(){
        this.doSearch();
    }

    doSearch(){
        var url = 'https://api.github.com/search/repositories?q='
                + encodeURIComponent(this.state.searchQuery)

        fetch(url)
            .then((res)=>res.json())
            .then((res)=>{
                this.setState({
                    respositories: res.repositories,
                    dataSource: this.state.dataSource.cloneWithRows(res.items)
                })
            })
            .finally(()=>{
                this.setState({
                    showProgress: false
                })
            })
    }


    renderRow(rowData){
        return(
            <View style={{
                    padding: 20,
                    borderColor: '#D7D7D7',
                    borderBottomWidth: 1,
                    backgroundColor: '#fff'
                }}>
                <Text style={{
                        fontSize: 20,
                        fontWeight: '600'
                    }}>
                    {rowData.full_name}
                </Text>
                <View style={{
                        flex: 1,
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        marginTop: 20,
                        marginBottom: 20
                    }}>
                    <View style={styles.repoCell}>
                        <Image source={{uri: 'star'}} style={styles.repoCellIcon}></Image>
                        <Text style={styles.repoCellLabel}>
                          {rowData.stargazers_count}
                        </Text>
                    </View>
                    <View style={styles.repoCell}>
                        <Image source={{uri: 'fork'}} style={styles.repoCellIcon}></Image>
                        <Text style={styles.repoCellLabel}>
                          {rowData.forks}
                        </Text>
                    </View>
                    <View style={styles.repoCell}>
                        <Image source={{uri: 'issues2'}} style={styles.repoCellIcon}></Image>
                        <Text style={styles.repoCellLabel}>
                          {rowData.open_issues}
                        </Text>
                    </View>
                </View>
            </View>
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
    repoCell:{
        width: 50,
        alignItems: 'center',
    },
    repoCellIcon:{
        width: 20,
        height: 20
    },
    repoCellLabel:{
        textAlign: 'center'
    },
    showProgress:{
        flex: 1,
        justifyContent: 'center'
    }
});

module.exports = SearchResult;
