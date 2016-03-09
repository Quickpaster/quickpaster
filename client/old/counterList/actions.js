import Counter from './../counter';
import Type from 'union-type';

export default Type({
  Add     : [],
  Remove  : [Number],
  Reset   : [],
  Update  : [Number, Counter.Action],
});

