/** @jsx html */
import { html } from 'snabbdom-jsx';
import Counter from './../counter';
import Action from './actions';

function counterItemView(item, idx, handler) {
  return <div className="counter-item" key={item.id}>
    <button className="remove" on-click={ e => handler(Action.Remove(idx)) }>Remove</button>
    <Counter state={item} dispatch={action => handler(Action.Update(idx, action))} />
    <hr/>
  </div>
}

export default ({state, dispatch}, children)  =>
  <div>
    <button on-click={[dispatch, Action.Add()]}>Add</button>
    <button on-click={ () => dispatch(Action.Reset()) }>Reset</button>
    <hr/>
    <div className="counter-list">
      {state.map((item, idx) => counterItemView(item, idx, dispatch))}
    </div>
  </div>;

