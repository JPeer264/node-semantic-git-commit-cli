import entries from 'object.entries';
import getConfig from '../getConfig';
import rules from './availableRules';

const config = getConfig();

const ruleWarningMessages = (input) => {
  let warningMessage = '';
  const configRuleEntries = entries(config.rules);

  configRuleEntries.forEach((rule) => {
    const camelCaseRuleName = (rule[0]).replace(/-([a-z])/g, g => (g[1].toUpperCase()));
    const ruleIs = rules[camelCaseRuleName](input, config).check();

    if (!ruleIs) warningMessage += `${rules[camelCaseRuleName](input, config).message()}\n`;
  });

  return warningMessage;
};

export default ruleWarningMessages;
