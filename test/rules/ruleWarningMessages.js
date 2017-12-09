import test from 'ava';

import ruleWaringMessages from '../../lib/rules/ruleWarningMessages';

test('ruleWarningMessages', (t) => {
  const config = {
    rules: {
      maxChar: 72,
      minChar: 10,
      endWithDot: false,
    },
  };
  const messages = ruleWaringMessages('input.', config);
  t.deepEqual(messages, 'The commit message has to be at least 10 character, but is only 6 character long.\nThe commit message can not end with a dot\n');
});
