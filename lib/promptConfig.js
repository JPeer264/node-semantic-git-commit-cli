import chalk from 'chalk';
import getConfig from './getConfig';

const config = () => getConfig();

const choices = (configuration) => {
  const choicesList = [];

  configuration.types.forEach((type) => {
    const emoji = `${type.emoji} ` || '';
    const configType = type.type;
    const description = type.description || '';

    choicesList.push({
      value: emoji + configType,
      name: `${chalk.bold(configType)} ${description}`,
    });
  });

  return choicesList;
};

const questions = (choicesList) => {
  const questionsList = [
    {
      type: 'list',
      name: 'type',
      message: 'Select the type of your commit:',
      choicesList,
    },
    {
      type: 'input',
      name: 'description',
      message: 'Enter your commit message:',
      validate: input => (input ? true : 'A commit message is mandatory!'),
    },
    {
      type: 'confirm',
      name: 'moreInfo',
      message: 'Do you want to add more information to your commit?',
      default: false,
    },
    {
      type: 'editor',
      name: 'editor',
      message: 'This will let you add more information',
      when: answers => answers.moreInfo,
      default: answers => `${answers.type} ${answers.description}\n\n\n`,
    },
  ];

  return questionsList;
};

export { config, choices, questions };
