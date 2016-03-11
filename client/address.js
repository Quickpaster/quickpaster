import { Effect, execute } from './effect/address';
import { Action, model, init, update } from './state/address';
 
// Unnecessary for any sub-components!
import view from './../view/address';

export default { init, update, view, execute, model, Action, Effect };
