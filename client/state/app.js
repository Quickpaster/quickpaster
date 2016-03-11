import { result, actions } from './../lib/util';
import { Effect } from './../effect/app';
import Address from './../address';
import Type from 'union-type';
import View from './../view';

export const model = {};

const T = () => true;

const ViewAction = Type({
  Navigate: [String], // Address
  Internal: [T],
});

const Action = Type({
  Initialize: [String], // Address

  Navigate: [String],
  ViewAction: [T], // ViewAction or internal view-level action
  LinkClicked: [String],
  GoHome: [],
  AddressChanged: [Address.Action],
});

export function init () {
  let effects = [];

  const [address, addressEffects] = Address.init();
  effects = addressEffects ? [...effects, Effect.Address(addressEffects)] : effects;

  return result({action: actions(Action, 'Initialize'), view: null, address}, effects);
}

const State = Type({
  Init: [],
  Run: []
});

const myState = state => state.view === null ? State.Init() : State.Run();

export function update (state, action) {

  const currentState = myState(state);

  return State.case({
    Init: () => Action.case({
      Initialize: address => {
        let view = View.init()[0];
        view = View.update(view, view.action.Initialize(address))[0];
        return result({...state,
          view: {...view,
            app: actions(ViewAction,
              'Internal',
              'Navigate') },

          action: actions(Action,
            'Navigate',
            'ViewAction',
            'LinkClicked',
            'GoHome',
            'AddressChanged') });
      }
    }, action),

    Run: () => Action.case({
      ViewAction: viewAction => {
        let effects = [];
        if (viewAction.of === ViewAction) {
          return ViewAction.case({
            Navigate: url => update(state, state.action.Navigate(url)),
          }, viewAction);
        } else {
          const [newViewState, viewEffects] = View.update(state.view, viewAction);

          effects = viewEffects ? [...effects, Effect.ViewEffects(viewEffects)] : effects;
          return result({...state, view: newViewState}, effects);
        }
      },

      Navigate: url => {
        if (url !== '/') {
          return update(state, state.action.LinkClicked(url));
        } else {
          return update(state, state.action.GoHome());
        }
      },

      LinkClicked: updateAfterLinkClicked(state),

      GoHome: () => {
        let effects = [];

        if (state.address.address === '/') {
          const [newViewState, viewEffects] = View.update(state.view, View.Action.ShowNotify('Already At Home.'));

          effects = [...effects, Effect.ViewEffects(viewEffects)];
          return result({...state, view: newViewState}, effects);
        }

        console.log('Home navigation');
        return updateAfterLinkClicked(state)('/');
      },

      AddressChanged: action => {
        console.log('Address Changed', action[0]);
        const newAddressState = Address.update(state.address, action)[0];
        return result({...state, view: View.update(state.view, View.Action.SetAddress(newAddressState.address))[0],
          address: newAddressState});
      }
    }, action),
  }, currentState);
}

// TODO: parse action data before call of the subfunctions.
// Make the subfunctions return only some partial state based on abstract arguments passed into
// Merge the results in action handler of the update() and most upper init().
// This allows us use the same code in init() and in update().
const updateAfterLinkClicked = state =>
  url => {
    
    let effects = [];

    // Any action request could be declined based on current application state.
    // For different actions, it should be necessary check for applicability for
    // current state. See TLA+ for details.

    const [newAddressState, addressEffectRequests] = Address.update(state.address, Address.Action.Navigate(url));

    effects = addressEffectRequests ? [...effects, Effect.Address(addressEffectRequests)] : effects;

    return result({...state,
      address: newAddressState,
      view: View.update(state.view, View.Action.SetAddress(newAddressState.address))[0]}, effects);
  };

