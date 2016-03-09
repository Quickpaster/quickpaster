import Type from 'union-type';

export const Effect = Type({
  SubscribeChanges : [],
  ChangeUrlRequest: [String]
});

import { Action, model } from './../state/address';
import { executeEffects } from './../lib/util';

export function execute (state, effect, dispatch) {
  Effect.case({
    SubscribeChanges: () => {
      window.onpopstate = event => dispatch(Action.UrlChanged(document.location.pathname));
    },

    ChangeUrlRequest: (toUrl) => {
      setTimeout( () => {
        window.history.pushState(null, '', toUrl);
        dispatch(Action.UrlChanged(document.location.pathname));
      }, 700);
    }
  },
  effect);
}

