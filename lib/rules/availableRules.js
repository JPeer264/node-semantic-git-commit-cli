const rules = {
  endWithDot: input => ({
    message: () => 'The commit message can not end with a dot',
    check: () => {
      if (input[input.length - 1] === '.') return false;

      return true;
    },
  }),
  maxChar: (input, config) => ({
    message: () => `The commit message is not allowed to be longer as ${config.rules['max-char']}. Consider writing a body.`,
    check: () => {
      let number = config.rules['max-char'];

      if (number === -1) {
        number = Number.POSITIVE_INFINITY;
      }

      if (input.length > number) return false;

      return true;
    },
  }),
  minChar: (input, config) => ({
    message: () => `The commit message has to be at least ${config.rules['min-char']} character.`,
    check: () => {
      if (input.length < config.rules['min-char']) return false;

      return true;
    },
  }),
};

export default rules;
