import Type from 'union-type';

export const Effect = Type({
  Address: [Array],
  AutoDismissNotify: [String, Number]
});

import { Action, model } from './../state/app';
import { executeEffects } from './../lib/util';
import Address from './../address';

const onAddressChanged = dispatch => action =>
  dispatch(Action.AddressChanged(action));

export function execute (state, effect, dispatch) {

  return Effect.case({
    Address: (addressChangeRequests) => executeEffects(
      // Sub-component execute
      Address.execute,

      // Sub-component part of state
      state.address,

      // Sub-component effectsQueries
      addressChangeRequests,

      // Sub-component dispatcher thunk, if any Action should be passed back
      // from sub-component execute.
      onAddressChanged(dispatch)),

    AutoDismissNotify: (notifyId, dismissTimeout) =>
      setTimeout(() => dispatch(Action.DismissNotify(notifyId)), dismissTimeout)

  }, effect);
}

