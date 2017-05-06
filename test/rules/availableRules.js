import test from 'ava';

import rules from '../../lib/rules/availableRules';

test('rules endWithDot', (t) => {
  const rulesObj = {
    'end-with-dot': false,
  };
  const endWithDot = rules.endWithDot('input with dot.', { rules: rulesObj }).check();
  const endWithoutDot = rules.endWithDot('input with dot', { rules: rulesObj }).check();

  t.false(endWithDot);
  t.true(endWithoutDot);
});

test('rules minChar', (t) => {
  const rulesObj = {
    'min-char': 10,
  };
  const notMinChar = rules.minChar('less', { rules: rulesObj }).check();
  const minChar = rules.minChar('this are more than 10 characters', { rules: rulesObj }).check();

  t.false(notMinChar);
  t.true(minChar);
});

test('-1 in minChar', (t) => {
  const rulesObj = {
    'min-char': -1,
  };
  const shortText = rules.minChar('n', { rules: rulesObj }).check();
  const longText = rules.minChar('this are more than 10 characters', { rules: rulesObj }).check();

  t.true(shortText);
  t.true(longText);
});

test('rules mxChar', (t) => {
  const rulesObj = {
    'max-char': 72,
  };
  const moreThanMaxChar = rules.maxChar('this are more than 72 characters, believe me or not but the value moreThanMaxChar will be false ;-P', { rules: rulesObj }).check();
  const lessThanMaxChar = rules.maxChar('this are less than 72 characters', { rules: rulesObj }).check();

  t.false(moreThanMaxChar);
  t.true(lessThanMaxChar);
});

test('-1 in maxChar', (t) => {
  const rulesObj = {
    'min-char': -1,
  };
  const longText = rules.maxChar('this are more than 72 characters, believe me or not but the value moreThanMaxChar will be true ;-P', { rules: rulesObj }).check();
  const shortText = rules.maxChar('this are less than 72 characters', { rules: rulesObj }).check();

  t.true(longText);
  t.true(shortText);
});
