import Type from 'union-type';

export const Action = Type({
  Navigate: [String],
  UrlChanged: [String]
});

