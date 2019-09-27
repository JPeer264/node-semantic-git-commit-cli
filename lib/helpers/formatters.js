import getTypeFromName from './getTypeFromName';

export const formatScope = (scope = '') => (scope ? `(${scope.trim()})` : scope.trim());

export const combineTypeScope = (type, scope, delimiter = ':', addScopeSpace = true) => {
  let thisType = type;

  const thisScope = formatScope(scope);
  // originalDelimiter to still keep the previous behavior
  const originalDelimiter = ':';
  const trimmedDelimiter = delimiter.replace(/ *$/, '');

  // add scope correctly if delimiter is at the end
  if (thisScope.length > 0) {
    if (
      thisType.charAt(thisType.length - 1) === trimmedDelimiter
      || thisType.charAt(thisType.length - 1) === originalDelimiter
    ) {
      thisType = thisType.slice(0, thisType.length - 1);
    }

    thisType = `${thisType}${addScopeSpace ? ' ' : ''}${thisScope}${trimmedDelimiter}`;
  } else if (
    thisType.charAt(thisType.length - 1) !== trimmedDelimiter
    || thisType.charAt(thisType.length - 1) !== originalDelimiter
  ) {
    thisType = `${thisType}${trimmedDelimiter}`;
  }

  return thisType;
};

export const formatMessage = (answers, argv, config) => {
  const combinedAnswers = {
    ...answers,
    ...argv,
  };

  const correctType = combinedAnswers.customType || combinedAnswers.type;
  const typeInfo = getTypeFromName(config, combinedAnswers.type);
  const delimiter = (typeInfo && typeInfo.delimiter) || (config && config.delimiter);
  const type = combineTypeScope(
    correctType,
    combinedAnswers.scope,
    delimiter,
    (config && config.addScopeSpace),
  );
  const formattedMessage = `${type} ${(combinedAnswers.message || '').trim()}`;
  let result = formattedMessage;

  if (combinedAnswers.editor) {
    result = answers.body ? combinedAnswers.editor : formattedMessage;
  }

  return result;
};
