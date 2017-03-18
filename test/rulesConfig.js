import test from 'ava';
import { checkRulesMaxLength, checkRulesMinLength, checkRulesEndWithDot } from '../lib/rulesConfig';

test('checkRulesMaxLength', (t) => {
  t.deepEqual(checkRulesMaxLength('1234'), true);
  t.deepEqual(checkRulesMaxLength('This is a very loooooooooooooooooooooooooong commit message with over 72 characters'), false);
});

test('checkRulesMinLength', (t) => {
  t.deepEqual(checkRulesMinLength('1234'), false);
  t.deepEqual(checkRulesMinLength('This is a a commit message'), true);
});

test('checkRulesEndWithDot', (t) => {
  t.deepEqual(checkRulesEndWithDot('1234'), true);
  t.deepEqual(checkRulesEndWithDot('This is a very a commit message with a dot.'), false);
});
