import chalk from 'chalk';
import combineTypeScope from './helpers/combineTypeScope';
import ruleWarningMessages from './rules/ruleWarningMessages';

const choices = (config) => {
  const choicesList = [];

  config.types.forEach((type) => {
    const emoji = config.emoji && type.emoji ? `${type.emoji} ` : '';
    const configType = config.lowercaseTypes ? type.type.toLowerCase() : type.type;
    const description = type.description || '';

    choicesList.push({
      value: emoji + configType,
      name: `${chalk.bold(configType)} ${description}`,
    });
  });

  return choicesList;
};

const initialMessage = (config) => {
  let message = '';

  if (config.emoji &&
    typeof config.initialCommit === 'object' &&
    config.initialCommit.isEnabled) {
    message = `${config.initialCommit.emoji} ${config.initialCommit.message}`;
  } else {
    ({ message } = config.initialCommit);
  }

  return message;
};

const initialQuestion = (config) => {
  const message = initialMessage(config);

  return {
    type: 'confirm',
    name: 'initialCommit',
    message: `Confirm as first commit message: "${message}"`,
    default: true,
  };
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
      validate: (input, answers) => {
        if (input.length === 0) {
          return 'The commit message is not allowed to be empty';
        }

        const scope = answers.scope || '';
        const type = combineTypeScope(answers.type, scope.trim());
        const combinedInput = `${type} ${input.trim()}`;
        const warnings = ruleWarningMessages(combinedInput, config);

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
export {
  choices,
  initialMessage,
  initialQuestion,
};
