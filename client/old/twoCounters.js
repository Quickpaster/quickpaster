import h from 'snabbdom/h';
import counter from './counter';

// Model:
// { first : counter.model, second : counter.model }

const RESET         = Symbol('reset');
const UPDATE_FIRST  = Symbol('update first');
const UPDATE_SECOND = Symbol('update second');

function init () {
  return { first: counter.init(), second: counter.init() };
}

function view (model, handler) { 
  return h('div', [
    h('button', {
      on   : { click: handler.bind(null, {type: RESET}) }
    }, 'Reset'),
    h('hr'),
    counter.view(model.first, counterAction => handler({ type: UPDATE_FIRST, data: counterAction})),
    h('hr'),
    counter.view(model.second, counterAction => handler({ type: UPDATE_SECOND, data: counterAction})),
    
  ]); 
}

function update (model, action) {
  return  action.type === RESET     ?
      { 
        first : counter.init(),
        second: counter.init()
      }
        
    : action.type === UPDATE_FIRST   ?
      {...model, first : counter.update(model.first, action.data) }
        
    : action.type === UPDATE_SECOND  ?
      {...model, second : counter.update(model.second, action.data) }
        
    : model;
}

export default { view, init, update, actions : { UPDATE_FIRST, UPDATE_SECOND, RESET } }
