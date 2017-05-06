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
      when: () => config.scope,
      validate: input => (input.match(/\s/) !== null ? 'No whitespaces allowed' : true),
      filter: input => (input ? `(${input})` : input),
    },
    {
      type: 'input',
      name: 'description',
      message: 'Enter your commit message:',
      validate: (input) => {
        const warnings = ruleWarningMessages(input, config);

        return warnings || true;
      },
    },
    {
      type: 'confirm',
      name: 'body',
      message: 'Do you want to add a body?',
      when: () => config.body,
      default: false,
    },
    {
      type: 'editor',
      name: 'editor',
      message: 'This will let you add more information',
      when: answers => answers.body,
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
