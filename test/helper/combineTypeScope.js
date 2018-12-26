import test from 'ava';

import { combineTypeScope } from '../../lib/helpers/formatters';

test('check if the combination is correct', (t) => {
  t.is(combineTypeScope('Type:', '(scope)'), 'Type(scope):');
  t.is(combineTypeScope('Type', '(scope)'), 'Type(scope)');
  t.is(combineTypeScope('Type'), 'Type');
});
