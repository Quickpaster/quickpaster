import { result } from './../lib/util';
import { Effect } from './../effect/app';
import Address from './../address';
import Type from 'union-type';

export const model = {};

export function init () {
  // Build app state
  
  let effects = [];

  const [address, addressEffects] = Address.init();
  effects = addressEffects ? [...effects, Effect.Address(addressEffects)] : effects;

  return result({notify: [], address}, effects);
}

// TODO: parse action data before call of the subfunctions.
// Make the subfunctions return only some partial state based on abstract arguments passed into
// Merge the results in action handler of the update() and most upper init().
// This allows us use the same code in init() and in update().
const updateAfterLinkClicked = state =>
  linkNavigateAction => {
    let effects = [];

    // Any action request could be declined based on current application state.
    // For different actions, it should be necessary check for applicability for
    // current state. See TLA+ for details.

    const [newAddressState, addressEffectRequests ] = Address.update(state.address, linkNavigateAction);

    effects = addressEffectRequests ? [...effects, Effect.Address(addressEffectRequests)] : effects;

    return result({...state, address: newAddressState}, effects);
  };

export function update (state, action) {
  return Action.case({
    LinkClicked: updateAfterLinkClicked(state),

    DismissNotify: notifyId =>
      result({...state, notify: state.notify.filter(({id}) => id !== notifyId)}),

    GoHome: () => {
      let effects = [];

      if (state.address.address === '/') {
        const notifyId = Meteor.uuid();
        state.notify = [...state.notify, {id: notifyId, message: 'Already At Home.'}];
        effects = [...effects, Effect.AutoDismissNotify(notifyId, 5000)];
        return result(state, effects);
      }

      console.log('Home navigation');
      return updateAfterLinkClicked(state)(Address.Action.Navigate('/'));
    },

    AddressChanged: action => {
      console.log('Address Changed', action[0]);
      return result({...state, notify: [], address: Address.update(state.address, action)[0]});
    }
  }, action);
}

export const Action = Type({
  LinkClicked: [Address.Action],
  GoHome: [],
  AddressChanged: [Address.Action],
  DismissNotify: [String]
});

