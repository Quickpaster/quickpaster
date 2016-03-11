import Type from 'union-type';
const Address = require('./address');
const View = require('./view');

export const Action = Type({
  ViewAction: [View.Action],
  LinkClicked: [Address.Action],
  GoHome: [],
  AddressChanged: [Address.Action],
});

