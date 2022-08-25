import { formatScope, combineTypeScope, formatMessage } from '../../lib/helpers/formatters';

it('FORMATSCOPE | should format scope correctly', () => {
  const scope = formatScope();

  expect(scope).toBe('');
});

it('FORMATSCOPE | should trim scope', () => {
  const scope = formatScope('         te st  ');

  expect(scope).toBe('(te st)');
});

it('COMBINETYPESCOPE | should combine type and scope correctly', () => {
  const typeScope = combineTypeScope('myType', 'myScope');

  expect(typeScope).toBe('myType (myScope):');
});

it('COMBINETYPESCOPE | should combine type and empty scope', () => {
  const typeScope = combineTypeScope('myType');

  expect(typeScope).toBe('myType:');
});

it('COMBINETYPESCOPE | should combine type with : and scope', () => {
  const typeScope = combineTypeScope('myType:', 'myScope');

  expect(typeScope).toBe('myType (myScope):');
});

it('COMBINETYPESCOPE | should combine type with another delimiter', () => {
  const typeScope = combineTypeScope('myType:', 'myScope', ' -     ');
  const typeScope2 = combineTypeScope('myType:', 'myScope', ' =');
  const typeScope3 = combineTypeScope('myType', 'myScope', ' -');

  expect(typeScope).toBe('myType (myScope) -');
  expect(typeScope2).toBe('myType (myScope) =');
  expect(typeScope3).toBe('myType (myScope) -');
});

it('COMBINETYPESCOPE | should combine type with another delimiter but with no space between type | #79', () => {
  const typeScope = combineTypeScope('myType:', 'myScope', ' -     ');
  const typeScope2 = combineTypeScope('myType:', 'myScope', ' =', false);
  const typeScope3 = combineTypeScope('myType', 'myScope', undefined, false);
  const typeNoScope = combineTypeScope('myType', undefined, undefined, false);
  const typeNoScope2 = combineTypeScope('myType', undefined, undefined, true);

  expect(typeScope).toBe('myType (myScope) -');
  expect(typeScope2).toBe('myType(myScope) =');
  expect(typeScope3).toBe('myType(myScope):');
  expect(typeNoScope).toBe('myType:');
  expect(typeNoScope2).toBe('myType:');
});

it('FORMATMESSAGE | should format message', () => {
  const message = formatMessage({
    type: 'myType',
    message: '     something      ',
  });

  expect(message).toBe('myType: something');
});

it('FORMATMESSAGE | should format message with customType', () => {
  const message = formatMessage({
    message: '     something      ',
    customType: 'custom',
  });

  expect(message).toBe('custom: something');
});

it('FORMATMESSAGE | should format with scope', () => {
  const message = formatMessage({
    type: 'myType',
    scope: 'myScope',
    message: '     something      ',
  });

  expect(message).toBe('myType (myScope): something');
});

it('FORMATMESSAGE | should format message with body', () => {
  const message = formatMessage({
    type: 'myType',
    scope: 'myScope',
    body: true,
    editor: 'take this',
  });

  expect(message).toBe('take this');
});

it('FORMATMESSAGE | should format message with argv overrides', () => {
  const message = formatMessage(
    {
      type: 'myType',
      scope: 'myScope',
      message: 'message',
    },
    {
      type: 'overwrite',
    },
  );

  expect(message).toBe('overwrite (myScope): message');
});

it('FORMATMESSAGE | should format message with more argv overrides', () => {
  const message = formatMessage(
    {
      type: 'myType',
      scope: 'myScope',
      message: 'message',
    },
    {
      type: 'myTypeOverwrite',
      scope: 'myScopeOverwrite',
      message: 'messageOverwrite',
    },
  );

  expect(message).toBe('myTypeOverwrite (myScopeOverwrite): messageOverwrite');
});

it('FORMATMESSAGE | should format when editor is undefined but body is set to true', () => {
  const message = formatMessage(
    {
      type: 'myType',
      scope: 'myScope',
      message: 'message',
      body: true,
    },
  );

  expect(message).toBe('myType (myScope): message');
});

it('FORMATMESSAGE | should format when editor is undefined but body is set to true, and no scopespace', () => {
  const message = formatMessage(
    {
      type: 'myType',
      scope: 'myScope',
      message: 'message',
      body: true,
    },
    undefined,
    {
      addScopeSpace: false,
    },
  );

  expect(message).toBe('myType(myScope): message');
});

it('FORMATMESSAGE | should take editor when editor is not undefined and body is set to true', () => {
  const message = formatMessage(
    {
      type: 'myType',
      scope: 'myScope',
      message: 'message',
      body: true,
      editor: 'take this',
    },
  );

  expect(message).toBe('take this');
});

it('FORMATMESSAGE | should format when editor is not undefined and body is set to false', () => {
  const message = formatMessage(
    {
      type: 'myType',
      scope: 'myScope',
      message: 'message',
      body: false,
      editor: 'take this',
    },
  );

  expect(message).toBe('myType (myScope): message');
});

it('FORMATMESSAGE | should format with a delimiter', () => {
  const message = formatMessage(
    {
      type: 'myType',
      scope: 'myScope',
      message: 'message',
      body: false,
      editor: 'take this',
    },
    undefined,
    {
      delimiter: ' -',
    },
  );

  expect(message).toBe('myType (myScope) - message');
});

it('FORMATMESSAGE | should format with a type specific delimiter', () => {
  const message = formatMessage(
    {
      type: 'myType',
      scope: 'myScope',
      message: 'message',
      body: false,
      editor: 'take this',
    },
    undefined,
    {
      delimiter: ' -',
      types: [
        { type: 'myType', delimiter: '---' },
      ],
    },
  );

  expect(message).toBe('myType (myScope)--- message');
});
