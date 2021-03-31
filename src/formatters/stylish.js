import _ from 'lodash';

const makeIndent = (level, string = ' ', indentWidth = 4) => string.repeat(indentWidth).repeat(level);

const stringifyValue = (value, level, cb) => ((!_.isPlainObject(value))
  ? value
  : `{
${_.sortBy(Object.entries(value))
    .map(([childKey, childValue]) => cb({ key: childKey, value: childValue, type: 'unchanged' }, level + 1))
    .join('\n')}
${makeIndent(level)}}`);

const formatter = (node, level = 0) => {
  const { key, type } = node;

  switch (type) {
    case 'nested':
      return `${makeIndent(level)}${
        key === 'root' ? '' : `${key}: `
      }{
${node.children.map((child) => formatter(child, level + 1)).join('\n')}
${makeIndent(level)}}`;
    case 'removed':
      return `${makeIndent(level - 1)}  - ${key}: ${stringifyValue(node.value, level, formatter)}`;
    case 'added':
      return `${makeIndent(level - 1)}  + ${key}: ${stringifyValue(node.value, level, formatter)}`;
    case 'updated':
      return `${makeIndent(level - 1)}  - ${key}: ${stringifyValue(node.oldValue, level, formatter)}
${makeIndent(level - 1)}  + ${key}: ${stringifyValue(node.newValue, level, formatter)}`;
    default:
      return `${makeIndent(level - 1)}    ${key}: ${stringifyValue(node.value, level, formatter)}`;
  }
};

export default formatter;
