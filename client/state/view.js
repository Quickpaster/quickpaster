import { result, actions } from './../lib/util';
import { Effect } from './../effect/view';
import Type from 'union-type';

export const model = {};

export function init () {
  return result({notify: [], navigating: false, address: null, action: actions(Action, 'Initialize') });
}


export function update (state, action) {
  return Action.case({

    Initialize: newAddress =>
      result({...state,
        address: newAddress,
        action: actions(Action,
          'SetAddress',
          'ShowNotify',
          'NavigatedTo',
          'DismissNotify',
          'LinkClicked'),
      }),

    SetAddress: newAddress => result({...state, address: newAddress}),

    DismissNotify: notifyId =>
      result({...state, notify: state.notify.filter(({id}) => id !== notifyId)}),

    ShowNotify: message => {
      let effects = [];

      const notifyId = Meteor.uuid();
      const newNotify = [...state.notify, {id: notifyId, message: message}];
      effects = [...effects, Effect.AutoDismissNotify(notifyId, 5000)];
      return result({...state, notify: newNotify}, effects);
    },

    NavigatedTo: address => {
      return result({...state, notify: [], address: address});
    }
  }, action);
}


export const Action = Type({
  Initialize: [String],
  LinkClicked: [String],
  SetAddress: [String],
  ShowNotify: [String],
  NavigatedTo: [String],
  DismissNotify: [String]
});

