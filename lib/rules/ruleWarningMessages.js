import entries from 'object.entries';
import getConfig from '../getConfig';
import rules from './availableRules';

const configuration = getConfig();

const ruleWarningMessages = (input) => {
  let warningMessage = '';
  const configRuleEntries = entries(configuration.rules);

  configRuleEntries.forEach((rule) => {
    const camelCaseRuleName = (rule[0]).replace(/-([a-z])/g, g => (g[1].toUpperCase()));
    const ruleIs = rules[camelCaseRuleName].check(input);

    if (!ruleIs) warningMessage += `${rules[camelCaseRuleName].message}\n`;
  });

  return warningMessage;
};

export default ruleWarningMessages;
