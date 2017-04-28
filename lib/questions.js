import chalk from 'chalk';
import ruleWarningMessages from './rules/ruleWarningMessages';
import combineTypeScope from './helpers/combineTypeScope';

const choices = (config) => {
  const choicesList = [];

  config.types.forEach((type) => {
    const emoji = config.emoji && type.emoji ? `${type.emoji} ` : '';
    const configType = type.type;
    const description = type.description || '';

    choicesList.push({
      value: emoji + configType,
      name: `${chalk.bold(configType)} ${description}`,
    });
  });

  return choicesList;
};

const questions = (config) => {
  const choicesList = choices(config);
  const questionsList = [
    {
      type: 'list',
      name: 'type',
      message: 'Select the type of your commit:',
      choices: choicesList,
    },
    {
      type: 'input',
      name: 'scope',
      message: 'Enter your scope (no whitespaces allowed):',
      when: () => config.questions.scope,
      filter: answers => (answers ? `(${answers})` : answers),
    },
    {
      type: 'input',
      name: 'description',
      message: 'Enter your commit message:',
      validate: (input) => {
        const warnings = ruleWarningMessages(input);

        return warnings || true;
      },
    },
    {
      type: 'confirm',
      name: 'moreInfo',
      message: 'Do you want to add more information to your commit?',
      when: () => config.questions.moreInfo,
      default: false,
    },
    {
      type: 'editor',
      name: 'editor',
      message: 'This will let you add more information',
      when: answers => answers.moreInfo,
      default: (answers) => {
        const type = combineTypeScope(answers.type, answers.scope);

        return `${type} ${answers.description}\n\n\n`;
      },
    },
  ];

  return questionsList;
};

export default questions;
export { choices };
