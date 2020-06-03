import rules from '../../lib/rules/availableRules';

it('rules endWithDot', () => {
  const rulesObj = {
    endWithDot: false,
  };
  const endWithDot = rules.endWithDot('input with dot.', { rules: rulesObj }).check();
  const endWithoutDot = rules.endWithDot('input with dot', { rules: rulesObj }).check();

  expect(endWithDot).toBe(false);
  expect(endWithoutDot).toBe(true);
});

it('rules minChar', () => {
  const rulesObj = {
    minChar: 10,
  };
  const notMinChar = rules.minChar('less', { rules: rulesObj }).check();
  const minChar = rules.minChar('this are more than 10 characters', { rules: rulesObj }).check();

  expect(notMinChar).toBe(false);
  expect(minChar).toBe(true);
});

it('-1 in minChar', () => {
  const rulesObj = {
    minChar: -1,
  };
  const shortText = rules.minChar('n', { rules: rulesObj }).check();
  const longText = rules.minChar('this are more than 10 characters', { rules: rulesObj }).check();

  rules.minChar('n', { rules: rulesObj }).message();

  expect(shortText).toBe(true);
  expect(longText).toBe(true);
});

it('rules mxChar', () => {
  const rulesObj = {
    maxChar: 72,
  };
  const moreThanMaxChar = rules.maxChar('this are more than 72 characters, believe me or not but the value moreThanMaxChar will be false ;-P', { rules: rulesObj }).check();
  const lessThanMaxChar = rules.maxChar('this are less than 72 characters', { rules: rulesObj }).check();

  rules.maxChar('this are more than 72 characters, believe me or not but the value moreThanMaxChar will be false ;-P', { rules: rulesObj }).message();

  expect(moreThanMaxChar).toBe(false);
  expect(lessThanMaxChar).toBe(true);
});

it('-1 in maxChar', () => {
  const rulesObj = {
    maxChar: -1,
  };
  const longText = rules.maxChar('this are more than 72 characters, believe me or not but the value moreThanMaxChar will be true ;-P', { rules: rulesObj }).check();
  const shortText = rules.maxChar('this are less than 72 characters', { rules: rulesObj }).check();

  expect(longText).toBe(true);
  expect(shortText).toBe(true);
});
