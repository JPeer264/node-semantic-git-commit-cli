import ruleWaringMessages from '../../lib/rules/ruleWarningMessages';

it('ruleWarningMessages', () => {
  const config = {
    rules: {
      maxChar: 72,
      minChar: 10,
      endWithDot: false,
    },
  };
  const messages = ruleWaringMessages('input.', config);
  expect(messages).toBe('The commit message has to be at least 10 character, but is only 6 character long.\nThe commit message can not end with a dot\n');
});

it('should throw an error', () => {
  const config = {
    rules: {
      notExisting: 10,
    },
  };

  expect(() => ruleWaringMessages('input.', config)).toThrow();
});
