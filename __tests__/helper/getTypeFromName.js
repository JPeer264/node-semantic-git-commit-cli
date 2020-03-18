import getTypeFromName from '../../lib/helpers/getTypeFromName';

it('accept empty configs', () => {
  expect(getTypeFromName()).toBe(null);
  expect(getTypeFromName({})).toBe(null);
  expect(getTypeFromName({ types: [] })).toBe(null);
});

it('cannot find name', () => {
  const config = { types: [{ type: 'find' }] };

  expect(getTypeFromName(config, 'findme')).toBe(null);
});

it('find name', () => {
  const config = { types: [{ type: 'findme' }] };

  expect(getTypeFromName(config, 'findme')).toEqual({ type: 'findme' });
});
