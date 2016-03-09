/** @jsx html */
import { html } from 'snabbdom-jsx';
import Type from 'union-type';
import { result } from './../lib/util';

const Action = Type({
  Increment : [],
  Decrement : [],
  IncrementLater : []
});

const Effect = Type({
  IncrementAsync : []
});

function init () {
  // return result(0);
  return result(0, [Effect.IncrementAsync()]);
}

// model : Number
function view({state, dispatch}, children) { 
  return <div>
    <button on-click={ () => dispatch(Action.Increment()) }>+</button>
    <button on-click={ () => dispatch(Action.Decrement()) }>-</button>
    <button on-click={ () => dispatch(Action.IncrementLater()) }>+ (Async)</button>
    <div>Count : {state}</div>
  </div>;
}


const update = (state, action) => Action.case({
  Increment      : () => result(state + 1),
  IncrementLater : () => result(state, [Effect.IncrementAsync()]),
  Decrement      : () => result(state - 1)
}, action);

const execute = (state, effect, dispatch) =>
  Effect.case({
    IncrementAsync: () => {
      setTimeout(() => dispatch(Action.Increment()), 1000)
    }
  }, effect);

export default { init, view, update, execute, Action, Effect }
