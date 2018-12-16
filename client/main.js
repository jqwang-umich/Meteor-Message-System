import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import {Session} from 'meteor/session'
import {User} from '/database/users'

import './main.html';

Template.main.onCreated(function () {
  Session.set('currentUser', '');
});

Template.main.helpers({
  getCurrentUser(){
    return Session.get('currentUser');
  }
});

Template.hello.events({
  'click button'(event, instance) {
    // increment the counter when button is clicked
    instance.counter.set(instance.counter.get() + 1);
  },
});
