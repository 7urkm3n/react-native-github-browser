import buffer, {Buffer} from 'buffer/';
import asyncStorage, {AsyncStorage} from 'react-native';
import _ from 'lodash'

const authKey = 'auth',
      userKey = 'user';

class AuthService{

    getAuthInfo(callback){
        AsyncStorage.multiGet([authKey, userKey], (err, val)=>{

            if (err) {
                return callback(err)
            }

            if (!val) {
                return callback()
            }

            var zippedObj = _.zipObject([val[0][0], val[1][0]], [val[0][1], val[1][1]]);
            if(!zippedObj[authKey]){
                return callback()
            }

            var authInfo = {
                header: {
                    Authorization: 'Basic ' + zippedObj[authKey]
                },
                user: JSON.parse(zippedObj[userKey])
            }
            return callback(null, authInfo);
        })
    }

    login(creds, callback){
        var bf = new Buffer(creds.username + ':' + creds.password);
        var encodedAuth = bf.toString('base64');

        fetch('https://api.github.com/user',{
            headers:{
                'Authorization' : 'Basic ' + encodedAuth
            }
        })
        .then((res)=>{
            if (res.status >= 200 && res.status <= 300) {
                return res
            }
            throw {
                badCredentials: res.status == 401,
                unknownError: res.status != 401
            }
        })
        .then((res)=>{
            return res.json();
        })
        .then((res)=>{
            AsyncStorage.multiSet([
                [authKey, encodedAuth],
                [userKey, JSON.stringify(res)]
            ], (err)=>{
                if (err) {
                    throw err
                }
                return callback({success: true})
            })
        })
        .catch((err)=>{
            return callback(err)
        })
    }
}

module.exports = new AuthService();
