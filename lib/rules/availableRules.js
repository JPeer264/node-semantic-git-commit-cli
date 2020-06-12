const rules = {
  endWithDot: (input) => ({
    message: () => 'The commit message can not end with a dot',
    check: () => {
      if (input[input.length - 1] === '.') {
        return false;
      }

      return true;
    },
  }),
  maxChar: (input, config) => ({
    message: () => `The commit message is not allowed to be longer as ${config.rules?.maxChar} character, but is ${input.length} character long. Consider writing a body.`,
    check: () => {
      let number = config.rules?.maxChar;

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
    message: () => `The commit message has to be at least ${config.rules?.minChar} character, but is only ${input.length} character long.`,
    check: () => {
      if (input.length < config.rules?.minChar) {
        return false;
      }

      return true;
    },
  }),
};

export default rules;
