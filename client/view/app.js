/** @jsx html */
import { html } from 'snabbdom-jsx';
import { Action } from './../state/app';
import Link from './../view/address';
//   or may be written as :
// import { view as Link } from './../address';


const onLinkClicked = dispatch =>
  linkClickedAction => {
    if (linkClickedAction[0] === '/') {
      // Sub-components actions are not necessary to bubble up through to child
      // component's update(). Parent component's update can construct the action
      // on the fly based on the purpose of high-level action.
      dispatch(Action.GoHome());
    } else {
      dispatch(Action.LinkClicked(linkClickedAction));
    }
  };


export default ({state, dispatch}, children) => {

  return <div>
    <ul>
      { state.notify.map(({id, message}) => <li>{message} <button on-click={() => dispatch(Action.DismissNotify(id))}>Dismiss</button></li>) }
    </ul>
    <p>
      <h1>You at {
        state.address.address === '/' ? 'home' :
        state.address.address.slice(1, state.address.address.length)
      }.
      </h1>
    </p>
    <p>
      <h1>{state.address.address} {state.address.navigating ? 'Navigating...' : 'Ready'}</h1>
    </p>
    <div>
      <ul>
        <li>
          <Link dispatch={onLinkClicked(dispatch)} href="/">Home</Link>
        </li>
        <li>
          <Link dispatch={onLinkClicked(dispatch)} href="hello">Hello</Link>
        </li>
      </ul>
    </div>
  </div>;
}
