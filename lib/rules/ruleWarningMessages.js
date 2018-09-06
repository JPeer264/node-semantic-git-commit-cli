import entries from 'object.entries';
import rules from './availableRules';

const ruleWarningMessages = (input, config) => {
  let warningMessage = '';

  const configRuleEntries = entries(config.rules);

  configRuleEntries.forEach((rule) => {
    const ruleName = rule[0];

    if (!(rules[ruleName] instanceof Function)) {
      throw new Error(`The rule '${ruleName}' does not exist, look at the documentation to check valid rules.`);
    }

    const ruleIs = rules[ruleName](input, config).check();

    if (!ruleIs) {
      warningMessage += `${rules[ruleName](input, config).message()}\n`;
    }
  });

  return warningMessage;
};

export default ruleWarningMessages;
