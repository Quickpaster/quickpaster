import { Effect, execute } from './effect/app';
import view from './../view/view';
import { Action, model, init, update } from './state/app';

export default { view, init, update, execute, Action, Effect, model };
