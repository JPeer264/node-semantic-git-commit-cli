import getConfig from './getConfig';

const checkRulesMaxLength = (input) => {
  const configuration = getConfig();

  if (configuration.rules['max-char-commit-message'] === true && input.length > configuration.rules['max-char']) {
    return false;
  } else if ((configuration.rules['max-char-commit-message'] === true && input.length <= configuration.rules['max-char']) || configuration.rules['max-char-commit-message'] === false) {
    return true;
  }

  return false;
};

const checkRulesMinLength = (input) => {
  const configuration = getConfig();

  if (input.length < configuration.rules['min-char']) {
    return false;
  } else if (input.length >= configuration.rules['min-char']) {
    return true;
  }

  return false;
};

const checkRulesEndWithDot = (input) => {
  const configuration = getConfig();

  if (configuration.rules['end-with-dot'] === true && input[input.length - 1] === '.') {
    return false;
  } else if (configuration.rules['end-with-dot'] === false && input[input.length - 1] !== '.') {
    return true;
  }

  return false;
};

export { checkRulesMaxLength, checkRulesMinLength, checkRulesEndWithDot };
