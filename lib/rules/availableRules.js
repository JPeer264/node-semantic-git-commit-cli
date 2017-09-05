const rules = {
  endWithDot: input => ({
    message: () => 'The commit message can not end with a dot',
    check: () => {
      if (input[input.length - 1] === '.') {
        return false;
      }

      return true;
    },
  }),
  maxChar: (input, config) => ({
    message: () => `The commit message is not allowed to be longer as ${config.rules['max-char']} character, but is ${input.length} character long. Consider writing a body.`,
    check: () => {
      let number = config.rules['max-char'];

      if (number === -1) {
        number = Number.POSITIVE_INFINITY;
      }

      if (input.length > number) {
        return false;
      }

      return true;
    },
  }),
  minChar: (input, config) => ({
    message: () => `The commit message has to be at least ${config.rules['min-char']} character, but is only ${input.length} character long.`,
    check: () => {
      if (input.length < config.rules['min-char']) {
        return false;
      }

      return true;
    },
  }),
};

export default rules;
