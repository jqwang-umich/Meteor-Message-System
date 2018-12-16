import {Users} from './users.js'
import {Meteor} from 'meteor/meteor'

Meteor.methods({
    'users.insert'(userName){
        Users.insert({'user_name': userName})
    },

    'users.getUserCount'(userName){
        return Users.find({user_name:userName}).count();
    }
})
