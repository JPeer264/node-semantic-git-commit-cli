import chalk from 'chalk';
import ruleWarningMessages from './rules/ruleWarningMessages';
import { formatMessage } from './helpers/formatters';

const customName = 'Custom';

const choices = (config) => {
  const choicesList = [];

  let customCount = 1;

  config.types.forEach((type) => {
    const emoji = config.emoji && type.emoji ? `${type.emoji} ` : '';
    let changedType = type.type;

    // type = false === it is a custom type
    if (!changedType) {
      changedType = `${customName} ${customCount}`;
      customCount += 1;
    }

    const configType = config.lowercaseTypes ? changedType.toLowerCase() : changedType;
    const description = type.description || '';
    const argKeys = type.argKeys || [];
    const isArray = Array.isArray(argKeys);

    if (!isArray) {
      console.error(
        chalk.red('\nAn error occured. The value',
          chalk.bold('argKeys'),
          'of',
          chalk.bold(type.type),
          'must be an array',
        ),
      );
    }

    choicesList.push({
      value: emoji + configType,
      name: `${chalk.bold(configType)} ${description}`,
      key: isArray ? argKeys : [],
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
      name: 'customType',
      when: answers => (answers.type.includes(customName) && !modifiedArgv.c),
      filter: (answer, answers) => {
        let customCount = 1;

        const typeChoice = config.types.find((type) => {
          // if there is no type it is a custom type
          if (!type.type) {
            if (answers.type === `${customName} ${customCount}`) {
              return true;
            }

            customCount += 1;
          }

          return false;
        });


        if (!typeChoice) {
          return answer;
        }

        return `${typeChoice.prefix || ''}${answer}`;
      },
      message: 'Choose your custom commit:',
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

        const formattedMessage = formatMessage({ ...answers, message }, modifiedArgv, config);
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
        const formattedMessage = formatMessage(answers, modifiedArgv, config);

        return `${formattedMessage}\n\n\n`;
      },
    },
  ];

  return questionsList;
};

export default questions;
export {
  choices,
  customName,
  initMessage,
  initQuestion,
};
