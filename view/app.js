/** @jsx html */
import { html } from 'snabbdom-jsx';
import { Action } from './../action/app';
import View from './../view/view';

const mapViewEventToBusinessAction = dispatch =>
  viewAction => {
    return dispatch(Action.ViewAction(viewAction));
  };

export default ({state, dispatch}, children) =>
  <View state={state} dispatch={mapViewEventToBusinessAction(dispatch)} />;

