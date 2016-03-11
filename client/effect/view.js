import Type from 'union-type';

export const Effect = Type({
  AutoDismissNotify: [String, Number]
});

import { Action, model } from './../state/view';
import { executeEffects } from './../lib/util';

export function execute (state, effect, dispatch) {

  return Effect.case({

    AutoDismissNotify: (notifyId, dismissTimeout) =>
      setTimeout(() => dispatch(state.action.DismissNotify(notifyId)), dismissTimeout)

  }, effect);
}

