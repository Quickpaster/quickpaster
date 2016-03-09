import Action from './actions';
import Effect from './effects';
import Counter from './../counter';
import model from './model';
import { executeEffects } from './../../lib/util';

export default (state, effect, dispatch) => Effect.case({
  Counter: (idx, counterEffects) => executeEffects(
    Counter,
    model.childState(state, idx),
    counterEffects,
    action => dispatch(Action.Update(idx, action)))
  }, effect);

