import {Users} from './users.js'
import {Meteor} from 'meteor/meteor'
import {Messages} from './messages.js'

Meteor.methods({
    'messages.getOtherUsers'(userName){
        UserList = new Array();
        usersList = Users.find([]);
        usersList.forEach(user=>{
            if(user.user_name !== userName){
                UserList.push(user.user_name);
            }
        });

        return UserList;
    },


    'messages.getChatHistory'(userName1,userName2){
        HistoryList = new Array();
        histories = Messages.find({user_name1: userName1, user_name2: userName2},{_id, from_user,content});
        histories.forEach(history=>{

        })
    },

    'messages.deleteChatHistory'(id){
        Messages.remove({_id: id});
    },

    'messages.addInformation'(userName1,userName2,content){
        Messages.insert({
            user_name1: userName1,
            user_name2: userName2,
            from_user: userName1,
            content: content
        });

        Messages.insert({
            user_name1: userName2,
            user_name2: userName1,
            from_user: userName1,
            content: content
        });
    }
})