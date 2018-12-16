import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import {Session} from 'meteor/session'
import {Users} from '/database/users'

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
	localStorage.setItem('loginError', 'No error');
});

Template.loginForm.helpers({
  getError(){
    return localStorage.getItem('loginError');
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
        localStorage.setItem('loginError',"Error: Username does not exist");
			}
		}else {
      console.log("should input name");
			localStorage.setItem('loginError',"Error: Please enter a username");
		}
	},

});

// ---------------------------------------------------------------------------------
Template.signupForm.onCreated(function() {
	localStorage.setItem('signupError', 'No error');
});

Template.loginForm.helpers({
  getError(){
    return localStorage.getItem('signupError');
  }
});

Template.loginForm.events({
  'submit #signup': function(event) {
		event.preventDefault();

		var newUsername = event.target.loginName.value;

		if(newUsername) {

			var userExists = Users.find({ user: newUsername }).count();
      
			if(userExists) {
			  localStorage.setItem('signupError', "Error: Username already exists");
			}else {
        Session.set('currentUser', newUsername);
        Users.insert({
          user:newUsername
        });
			}
		}else {
			localStorage.setItem('signupError',"Error: Please enter a username");
		}
	},

});
