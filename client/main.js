import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import {Session} from 'meteor/session'
import {Users} from '/database/users'
import {Meteor} from 'meteor/meteor'

import './main.html';

Template.main.onCreated(function () {
  Session.set('currentUser', '');
});

Template.main.helpers({
  getCurrentUser(){
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

			var userExists = Users.find({ user: newUsername }).count();
      console.log("user name ",userExists);
			if(userExists) {
			  localStorage.setItem('currentUser', newUsername);
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

			var userExists = Users.find({ user: newUsername }).count();
      
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
