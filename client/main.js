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

Template.loginForm.onCreated(function() {
	localStorage.setItem('loginError', 'No error');
});

Template.loginForm.helpers({
  getError(){
    return localStorage.getItem('loginError');
  }
});

Template.loginForm.events({
  'submit #loginForm': function(event) {
		// event.preventDefault();

		var newUsername = event.target.loginName.value;

		if(newUsername) {

			var userExists = Users.find({ user: newUsername }).count();
      console.log("user name ",userExists);
			if(userExists) {
			  localStorage.setItem('currentUser', newUsername);
			}else {
        localStorage.setItem('loginError',"Error: Username does not exist");
			}
		}else {
			localStorage.setItem('loginError',"Error: Please enter a username");
		}
	},

});

// ---------------------------------------------------------------------------------
Template.signupForm.onCreated(function() {
	this.signupFormError = new ReactiveVar("No error");
});

Template.signupForm.helpers({
  getError(){
    console.log("error message ",Template.instance().loginFormError.get());
    return Template.instance().loginFormError.get();

  }
});

Template.signupForm.events({
  'submit #loginForm': function(event) {
		event.preventDefault();

		var newUsername = event.target.loginName.value;

		if(newUsername) {

			var userExists = Users.find({ user: newUsername }).count();
      console.log("user name ",userExists);
			if(userExists) {
				Session.set('currentUser', newUsername);
			}else {
        Template.instance().loginFormError.set("Error: Username does not exist");
        $('#login-error').css('display', 'block');
			}
		}else {
			Template.instance().loginFormError.set("Error: Please enter a username");
		}
	},

});
