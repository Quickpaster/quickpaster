/** @jsx html */
import { html } from 'snabbdom-jsx';
import { Action } from './../state/address';

const defaultLink = (dispatch, href) =>
  evt => {
    evt.preventDefault();
    evt.stopPropagation();

    console.log(`Clicked link with href=${evt.target.href}`);

    dispatch(Action.Navigate(href));
    // dispatch(Action.Navigate(evt.target.href));
  };


export default ({dispatch, href}, children) =>

  <a on-click={defaultLink(dispatch, href)} href={href}>{children}</a>;
