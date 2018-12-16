import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import {Session} from 'meteor/session'
import {Users} from '../database/users'
import {Meteor} from 'meteor/meteor'
import {Messages} from '../database/messages'

import './main.html';
import './startup.js';

Template.main.onCreated(function () {
  Session.set('currentUser', '');
});

Template.main.helpers({
  getCurrentUser(){
    console.log("current user is ",Session.get('currentUser'));
    return Session.get('currentUser');
  }
});
// -----------------------------------------------------------
Template.loginForm.onCreated(function() {
	this.loginError = new ReactiveVar("");
});

Template.loginForm.helpers({
  getLoginError(){
    return Template.instance().loginError.get();
  }
});

Template.loginForm.events({
  'submit #login': function(event) {
		event.preventDefault();

		var newUsername = event.target.loginName.value;

		if(newUsername) {

			var userExists = Users.find({ user_name: newUsername }).count();
      console.log("user name ",userExists);
			if(userExists) {
			  Session.set('currentUser', newUsername);
			}else {
        console.log("user name does not exist");
        Template.instance().loginError.set("Error: Username does not exist");
			}
		}else {
      console.log("should input name");
			Template.instance().loginError.set("Error: Please enter a username");
		}
	},

});

// ---------------------------------------------------------------------------------
Template.signupForm.onCreated(function() {
	this.signupError = new ReactiveVar("");
});

Template.signupForm.helpers({
  getSignupError(){
    return Template.instance().signupError.get();
  }
});

Template.signupForm.events({
  'submit #signup': function(event) {
		event.preventDefault();

		var newUsername = event.target.signupName.value;

		if(newUsername) {

      var userExists = Users.find({ user_name: newUsername }).count();
      
			if(userExists) {
			  Template.instance().signupError.set("Error: Username already exists");
			}else {
        Meteor.call('users.insert',newUsername);
        Session.set('currentUser', newUsername);
			}
		}else {
			Template.instance().signupError.set("Error: Please enter a username");
		}
	},

});
// ------------------------------------------------------------------------------
Template.message.onCreated(function(){
  Session.set('currentChat','');
});

Template.message.helpers({
	getCurrentUser() {
		return Session.get('currentUser');
	},
	getNumUsers() {
		var currUser = Session.get('currentUser');
		return Users.find({ user_name: { $ne: currUser } }).count();
	},
	getUsersList() {
		var currUser = Session.get('currentUser');
		return Users.find({ user_name: { $ne: currUser } }).fetch();
	},
	getClickedUser() {
		return Session.get('currentChat');
	},
	getChatHistories() {
		var currentUser = Session.get('currentUser');
    var clickedUser = Session.get('currentChat');

		if(clickedUser) {
			// Meteor.call('messages.getChatHistory',currentUser,clickedUser,(error,result)=>{
      //     console.log("chat histories error: ",error);
      //     // returnResult = JSON.stringify(result);
      //     returnResult = result;
      //     console.log("chat histories result: ",(returnResult));
      //     return returnResult;
      return Messages.find({ $or : [ 
        { user_name1 : currentUser, user_name2 : clickedUser } , 
        { user_name2 : currentUser, user_name1 : clickedUser } 
      ] 
        },{ sort : { createTime : 1 }}).fetch();
      }

		// return [];
	},
});

Template.message.events({
  'click #logout': function(event) {
		event.preventDefault();

		Session.set('currentUser', '');
  },
  
  'click .chatUser': function(event) {
		var oldUser = Session.get('currentChat');

		if(oldUser) {
			$('#' + oldUser).removeClass('selected');
		}

    var clickedUser = $(event.target).text();
    console.log("user is ",clickedUser);
		// $('#' + clickedUser).addClass('selected');

		Session.set('currentChat', clickedUser);
  },
  
  'submit. #send-msg': function(event){
    var currentUser = Session.get('currentUser');
    var clickedUser = Session.get('currentChat');
    var msgContent = event.target.messageText.value;
    if(msgContent !== null){
        Meteor.call('messages.addInformation',currentUser,clickedUser,msgContent,(error,result)=>{
          console.log("chat submit error: ",error);
          console.log("chat submit result: ",result);
        })
    }
    
  }
});