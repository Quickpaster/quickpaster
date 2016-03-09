import { result } from './../lib/util';
import { Effect } from './../effect/address';
import Type from 'union-type';

export const model = {};

export function init () {
  let state = {};
  // Build component state

  state.address = document.location.pathname;

  return result(state, [Effect.SubscribeChanges()]);
}

export function update (state, action) {
  return Action.case({
    Navigate: (toUrl) => result({...state, navigating: true, toUrl}, [Effect.ChangeUrlRequest(toUrl)]),

    UrlChanged: (newUrl) => {

      console.log(`Navigated to ${newUrl}`);
      return result({...state, navigating: false, fromUrl: state.address, address: newUrl});
    }
  }, action);
}

export const Action = Type({
  Navigate: [String],
  UrlChanged: [String]
});

