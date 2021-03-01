import _ from 'lodash';
import buildNode from './buildNode.js';

const buildAST = (object1, object2, level = 0) => {
  const keys = _.sortBy(_.union(Object.keys(object1), Object.keys(object2)));

  const diffs = keys.flatMap((key) => buildNode(key, object1, object2, level, buildAST));
  return diffs;
};

export default buildAST;