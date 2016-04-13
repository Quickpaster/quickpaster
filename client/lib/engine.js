// Inspirement Sources:
// https://medium.com/@yelouafi/react-less-virtual-dom-with-snabbdom-functions-everywhere-53b672cb2fe3#.3s8mjoo9i
// https://github.com/paldepind/functional-frontend-architecture/issues/20#issue-117922035
// https://www.npmjs.com/package/snabbdom-jsx
// https://medium.com/@yelouafi/elm-architecture-side-effect-examples-with-snabbdom-and-jsx-3732219d9995#.ql10ueeyv

import { executeEffects } from './util';
import snabbdom from 'snabbdom';
// import asap from 'asap';
// import setimmediate from 'immediate';

let theState = undefined;
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
  theState = newState;

  // Change DOM based on newState
  const viewDispatch = viewAction => dispatch(newState.action.ViewAction(viewAction));
  vnode = patch(vnode, App.view({state: newState.view, dispatch: viewDispatch}));

  // All effects can be divided into the following categories:
  // 1. Next Action Predicate (pure State Machine handlers).
  // 2. Time Delayed Actions (simple delay before some action).
  // 3. Asynchronous actions (server-sent events, websocket messages, etc.)
  // 4. World changing imperative operations (side effects)
  if (effectsRequests && effectsRequests.length) {
    // setimmediate(() => 
    executeEffects(App.execute, newState, effectsRequests, dispatch);//);
  }
}

function dispatch(action) {
  handleUpdateResult(App.update(theState, action));
}

export default (app, root, route) => {
  vnode = root;
  App = app;

  // TODO: remove effects from init(). init() should never return effects.
  // But new returned state should return a list of all allowed effects
  // for all possible transitions from that state.
  const [appStructure, appInitEffects] = App.init();

  // TODO: Remove update from here. It is not necessary.
  let initUpdateResult = App.update(appStructure, appStructure.action.Initialize(route));
  if (initUpdateResult[1]) {
    initUpdateResult[1] = appInitEffects.concat(initUpdateResult[1]);
  } else {
    initUpdateResult[1] = appInitEffects;
  }
  handleUpdateResult(initUpdateResult);
}

