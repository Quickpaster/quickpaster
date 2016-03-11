import Type from 'union-type';

export const Action = Type({
  SetAddress: [String],
  ShowNotify: [String],
  NavigatedTo: [String],
  DismissNotify: [String]
});

