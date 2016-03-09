import { Effect, execute } from './effect/app';
import view from './view/app';
import { Action, model, init, update } from './state/app';

export default { view, init, update, execute, Action, Effect, model };
