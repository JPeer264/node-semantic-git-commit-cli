import test from 'ava';

import ruleWaringMessages from '../../lib/rules/ruleWarningMessages';

test('ruleWarningMessages', (t) => {
  const config = {
    rules: {
      'max-char': 72,
      'min-char': 10,
      'end-with-dot': false,
    },
  };
  const messages = ruleWaringMessages('input.', config);
  t.deepEqual(messages, 'The commit message has to be at least 10 character.\nThe commit message can not end with a dot\n');
});
