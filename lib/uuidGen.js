const UUID_TO_URLABLE   = '378acdehkmnpwxyz';
const UUID_TO_WRITEABLE = '37demEFGHJLMNQTY'; 

//const UUID_TO_WRITEABLE_SPLIT = '9-6-5-5-7';
const UUID_TO_WRITEABLE_SPLIT = '3-3-3-3-3-3-3-11';
const UUID_TO_URLABLE_SPLIT = UUID_TO_WRITEABLE_SPLIT;

const pattern = patternStr => patternStr
  .split('-')
  .reduce((acc, curr, index) =>
    acc.concat([index ? +curr + +acc[index - 1] : +curr - 1]),
    []
  )
  .reduce((acc, curr, index) => 
    ({...acc, [curr]: true}),
    {}
  );

const makeConvertor = (convertMap, splitScheme) => uuid => uuid
  .split('')
  .map(x => x === '-' ? '' : convertMap[parseInt(x, 16)])
  .join('')
  .split('')
  .join('-')
  .split('')
  .filter((x, i) => i % 2 ? splitScheme[(i-1)/2] : true)
  .join('');

export const uuidToWriteable = makeConvertor(UUID_TO_WRITEABLE, pattern(UUID_TO_WRITEABLE_SPLIT));
export const uuidToUrlable = makeConvertor(UUID_TO_URLABLE, pattern(UUID_TO_URLABLE_SPLIT));

