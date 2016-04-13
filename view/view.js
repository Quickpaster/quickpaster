/** @jsx html */
import { html } from 'snabbdom-jsx';
import { Action } from './../action/view';
import { Action as AppAction } from './../action/app';
import Link from './address';
//   or may be written as :
// import { view as Link } from './../address';


const onLinkClicked = (state, dispatch) =>
  linkClickedAction => {
    dispatch(state.app.Navigate(linkClickedAction[0]));
        /*
    if (linkClickedAction[0] === '/') {
      // Sub-components actions are not necessary to bubble up through to child
      // component's update(). Parent component's update can construct the action
      // on the fly based on the purpose of high-level action.
      dispatch(state.app.GoHome());
    } else {
      dispatch(state.app.LinkClicked(linkClickedAction));
    } */
  };

export default ({state, dispatch, complete, abort, fail}, children) =>
  <div id="root">
    <ul>
      { state.notify.map(({id, message}) =>
         <li>
           {message}
           <button on-click={() =>
             dispatch(state.action.DismissNotify(id))}>
             Dismiss
           </button>
         </li>)
      }
    </ul>
      <h1>You at {
        state.address === '/' ? 'home' :
        state.address.slice(1, state.address.length)
      }.
      </h1>
      <h1>{state.address} {state.navigating ? 'Navigating...' : 'Ready'}</h1>
    <div>
      <ul>
        <li>
          <Link dispatch={onLinkClicked(state, dispatch)} href="/">Home</Link>
        </li>
        <li>
          <Link dispatch={onLinkClicked(state, dispatch)} href="hello">Hello</Link>
        </li>
      </ul>
    </div>
  </div>;

