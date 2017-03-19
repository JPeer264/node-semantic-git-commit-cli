import test from 'ava';
import ruleWaringMessages from '../../lib/rules/ruleWarningMessages';

test('ruleWarningMessages', (t) => {
  const messages = ruleWaringMessages('input.');
  t.deepEqual(messages, 'The commit message has to be at least 10 character.\nThe commit message can not end with a dot\n');
});
