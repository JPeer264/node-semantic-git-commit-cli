import getConfig from '../getConfig';

const configuration = getConfig();

const rules = {
  endWithDot: {
    message: 'The commit message can not end with a dot',
    check: (input) => {
      if (input[input.length - 1] === '.') return false;
      return true;
    },
  },
  maxChar: {
    message: `The commit message is not allowed to be longer as ${configuration.rules['max-char']}. Consider writing a body.`,
    check: (input) => {
      if (input.length > configuration.rules['max-char']) return false;
      return true;
    },
  },
  minChar: {
    message: `The commit message has to be at least ${configuration.rules['min-char']} character.`,
    check: (input) => {
      if (input.length < configuration.rules['min-char']) return false;
      return true;
    },
  },
};

export default rules;
