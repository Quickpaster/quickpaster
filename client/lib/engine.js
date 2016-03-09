// Inspirement Sources:
// https://medium.com/@yelouafi/react-less-virtual-dom-with-snabbdom-functions-everywhere-53b672cb2fe3#.3s8mjoo9i
// https://github.com/paldepind/functional-frontend-architecture/issues/20#issue-117922035
// https://www.npmjs.com/package/snabbdom-jsx
// https://medium.com/@yelouafi/elm-architecture-side-effect-examples-with-snabbdom-and-jsx-3732219d9995#.ql10ueeyv

import { executeEffects } from './util';
import snabbdom from 'snabbdom';

let state = undefined;
let vnode = undefined;
let App = undefined;

const patch = snabbdom.init([
  require('snabbdom/modules/class'),
  require('snabbdom/modules/props'),
  require('snabbdom/modules/style'),
  require('snabbdom/modules/eventlisteners')
]);

function handleUpdateResult([newState, effectsRequests]) {

  // Replace old store with new version
  // TODO: use mori.js to make it more effective?
  state = newState;

  // Change DOM
  vnode = patch(vnode, App.view({state, dispatch}));

  // Change other world, if it's needed
  if (effectsRequests && effectsRequests.length) {
    executeEffects(App.execute, state, effectsRequests, dispatch);
  }
}

function dispatch(action) {
  handleUpdateResult(App.update(state, action));
}

export default (app, root) => {
  vnode = root;
  App = app;
  handleUpdateResult(App.init());
}

