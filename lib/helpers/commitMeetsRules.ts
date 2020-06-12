import getConfig from '../getConfig';
import rules from '../rules/availableRules';

const commitMeetsRules = (commit: string): boolean => {
  const config = getConfig();

  // commit exceptions
  if (config.initialCommit?.isEnabled && commit === config.initialCommit?.message) {
    return true;
  }

  // check if type is correct
  let scopeRegex = '\\([\\s\\S]*\\)';

  if (!config.scope) {
    scopeRegex = '';
  }

  if (config.addScopeSpace) {
    scopeRegex = ` ${scopeRegex}`;
  }

  const hasType = config.types?.some(({ type }: any) => {
    const newType = config.lowercaseTypes ? type.toLowerCase() : type;
    const delimiter = config.delimiter || ':';

    return commit.match(new RegExp(`^${newType}(${scopeRegex})?${delimiter}`));
  });

  if (!hasType) {
    return false;
  }

  // if length === 5 there is a footer
  // footer is not yet implemented
  const splittedCommit = commit.split('\n');
  const hasBody = splittedCommit.length === 3 && splittedCommit[1] === '' && splittedCommit[2] !== '';
  const invalidBody = splittedCommit.length > 1 && splittedCommit[1] !== '';

  if (
    (!config.body && hasBody)
    || invalidBody
  ) {
    return false;
  }

  // rules
  const endWithDot = !rules.endWithDot(commit).check();
  const maxChar = !rules.maxChar(commit, config).check();
  const minChar = !rules.minChar(commit, config).check();

  if (
    // end with dot correctly
    (config.rules?.endWithDot && !endWithDot)
    || (!config.rules?.endWithDot && endWithDot)
    // has correct length
    || maxChar
    || minChar
  ) {
    return false;
  }

  return true;
};

export default commitMeetsRules;
