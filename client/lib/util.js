import Type from 'union-type';

const T = () => true;

const UpdateResult = Type({
  Pure: [T],
  WithEffects: [T, T]
});

export const pure         = v => UpdateResult.Pure(v);
export const withEffects  = (v, ef) => UpdateResult.WithEffects(v, ef);
export const result = (newState, effects) => effects && effects.length ? withEffects(newState, effects) : pure(newState);

export const executeEffects = (execute, state, effects, dispatch) =>
  // TODO: could be added a check on child effect types,
  // if use {Effect, execute} instead of just execute by means of
  // Effects.case({
  effects.forEach(effect => execute(state, effect, dispatch));

export const actions = (type, ...actionsList) =>
  actionsList.reduce((actionsMap, name) => ({...actionsMap, [name]: type[name]}), {});

