import { result } from './../../lib/util';
import Action from './actions';
import Effect from './effects';
import Counter from './../counter';
import model from './model';

export default (state, action) => Action.case({

  Add: () => {
    // Update children, gather new state and side effect requests
    const counterUpdateResult = Counter.init();

    // Merge state with children new state
    const newState = [...state, counterUpdateResult[0]];

    // Generate side effect requests
    const effects = [];
    if (counterUpdateResult[1]) {
      effects.push(Effect.Counter(state.length, counterUpdateResult[1]));
    }

    return result(newState, effects);
  },

  Update: (idx, action) => {
    // Update children, gather new state and side effect requests
    const counterUpdateResult = Counter.update(model.childState(state, idx), action);

    // Merge state with children new state
    const newState = state.map((item, i) => i === idx ? counterUpdateResult[0] : item);

    // Generate side effect requests
    const effects = [];
    if (counterUpdateResult[1]) {
      console.log('UPDATE EFFECT');
      effects.push(Effect.Counter(idx, counterUpdateResult[1]));
    }
    return result(newState, effects);
  },

  // Pure result, no effects
  Remove: id => result(state.filter((v, idx) => idx !== id)),

  Reset:  () => {
    // Update children, gather new state and side effect requests
    const countersUpdateResults = state.reduce(arr => [...arr, Counter.init()], []);

    // Merge state with children new state
    const newState = state.map((item, i) => countersUpdateResults[i][0]);

    // Add effect requests from children list
    const effects = countersUpdateResults.reduce((arr, obj, idx) =>
      obj[1] ? [...arr, Effect.Counter(idx, obj[1])] : arr, []);

    return result(newState, effects);
  }}, action);

