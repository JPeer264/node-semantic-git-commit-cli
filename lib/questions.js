import chalk from 'chalk';
import ruleWarningMessages from './rules/ruleWarningMessages';
import { formatMessage } from './helpers/formatters';

const choices = (config) => {
  const choicesList = [];

  config.types.forEach((type) => {
    const emoji = config.emoji && type.emoji ? `${type.emoji} ` : '';
    const configType = config.lowercaseTypes ? type.type.toLowerCase() : type.type;
    const description = type.description || '';

    choicesList.push({
      value: emoji + configType,
      name: `${chalk.bold(configType)} ${description}`,
      key: type.argKeys || [],
    });
  });

  return choicesList;
};

const initMessage = (config) => {
  let message = '';

  if (config.emoji &&
    typeof config.initialCommit === 'object' &&
    config.initialCommit.isEnabled) {
    message = `${config.initialCommit.emoji} ${config.initialCommit.message}`;
  } else {
    message = config.initialCommit.message;
  }

  return message;
};

const initQuestion = (config) => {
  const message = initMessage(config);

  return {
    type: 'confirm',
    name: 'initCommit',
    message: `Confirm as first commit message: "${message}"`,
    default: true,
  };
};

const questions = (config, argv = {}) => {
  const modifiedArgv = argv;
  const choicesList = choices(config);
  const argChoice = choicesList.find(choice => choice.key.includes(modifiedArgv.t));

  if (argChoice) {
    modifiedArgv.type = argChoice.value;
  }

  const questionsList = [
    {
      type: 'list',
      name: 'type',
      when: () => !argChoice,
      message: 'Select the type of your commit:',
      choices: choicesList,
    },
    {
      type: 'input',
      name: 'scope',
      message: 'Enter your scope (no whitespaces allowed):',
      when: () => (config.scope && !modifiedArgv.s),
      validate: input => (input.match(/\s/) !== null ? 'No whitespaces allowed' : true),
    },
    {
      type: 'input',
      name: 'message',
      message: 'Enter your commit message:',
      when: () => !modifiedArgv.m,
      validate: (message, answers) => {
        if (message.length === 0) {
          return 'The commit message is not allowed to be empty';
        }

        const formattedMessage = formatMessage({ ...answers, message }, modifiedArgv);
        const warnings = ruleWarningMessages(formattedMessage, config);

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
        const formattedMessage = formatMessage(answers, modifiedArgv);

        return `${formattedMessage}\n\n\n`;
      },
    },
  ];

  return questionsList;
};

export default questions;
export {
  choices,
  initMessage,
  initQuestion,
};
