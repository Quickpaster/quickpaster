import Type from 'union-type';

export const Effect = Type({
  Address: [Array],
  ViewEffects: [Array]
});

import { Action, model } from './../state/app';
import { executeEffects } from './../lib/util';
import Address from './../address';
import View from './../view';

const onAddressChanged = (state, dispatch) => action =>
  dispatch(state.action.AddressChanged(action));

export function execute (state, effect, dispatch) {

  return Effect.case({
    ViewEffects: viewEffects => executeEffects(View.execute, state.view, viewEffects,
      viewAction => dispatch(state.action.ViewAction(viewAction))),
      
    Address: (addressChangeRequests) => executeEffects(
      // Sub-component execute
      Address.execute,

      // Sub-component part of state
      state.address,

      // Sub-component effectsQueries
      addressChangeRequests,

      // Sub-component dispatcher thunk, if any Action should be passed back
      // from sub-component execute.
      onAddressChanged(state, dispatch))

  }, effect);
}

