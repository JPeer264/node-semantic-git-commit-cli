export const formatScope = (scope = '') => (scope ? `(${scope.trim()})` : scope.trim());

export const combineTypeScope = (type, scope) => {
  let thisType = type;

  const thisScope = formatScope(scope);

  // add scope correctly if ':' is at the end
  if (thisScope.length > 0) {
    if (thisType.charAt(thisType.length - 1) === ':') {
      thisType = thisType.slice(0, thisType.length - 1);
    }

    thisType = `${thisType} ${thisScope}:`;
  } else if (thisType.charAt(thisType.length - 1) !== ':') {
    thisType = `${thisType}:`;
  }

  return thisType;
};

export const formatMessage = (answers, argv) => {
  const combinedAnswers = {
    ...answers,
    ...argv,
  };

  const correctType = combinedAnswers.customType || combinedAnswers.type;
  const type = combineTypeScope(correctType, combinedAnswers.scope);
  const formattedMessage = `${type} ${(combinedAnswers.message || '').trim()}`;
  const result = answers.body ? combinedAnswers.editor : formattedMessage;

  return result;
};