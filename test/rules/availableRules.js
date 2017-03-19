import test from 'ava';
import rules from '../../lib/rules/availableRules';

test('rules endWithDot', (t) => {
  const endWithDot = rules.endWithDot.check('input with dot.');
  const endWithoutDot = rules.endWithDot.check('input with dot');
  t.deepEqual(endWithDot, false);
  t.deepEqual(endWithoutDot, true);
});

test('rules minChar', (t) => {
  const notMinChar = rules.minChar.check('less');
  const minChar = rules.minChar.check('this are more than 10 characters');
  t.deepEqual(notMinChar, false);
  t.deepEqual(minChar, true);
});

test('rules mxChar', (t) => {
  const moreThanMaxChar = rules.maxChar.check('this are more than 72 characters, believe me or not but the value moreThanMaxChar will be false ;-P');
  const lessThanMaxChar = rules.maxChar.check('this are less than 72 characters');
  t.deepEqual(moreThanMaxChar, false);
  t.deepEqual(lessThanMaxChar, true);
});
