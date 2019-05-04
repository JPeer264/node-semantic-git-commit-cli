import test from 'ava';

import getTypeFromName from '../../lib/helpers/getTypeFromName';

test('accept empty configs', (t) => {
  t.is(getTypeFromName(), null);
  t.is(getTypeFromName({}), null);
  t.is(getTypeFromName({ types: [] }), null);
});

test('cannot find name', (t) => {
  const config = { types: [{ type: 'find' }] };

  t.is(getTypeFromName(config, 'findme'), null);
});

test('find name', (t) => {
  const config = { types: [{ type: 'findme' }] };

  t.deepEqual(getTypeFromName(config, 'findme'), { type: 'findme' });
});
