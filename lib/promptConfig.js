import chalk from 'chalk';

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
      choices: choicesList,
    },
    {
      type: 'input',
      name: 'commitMessage',
      message: 'Enter your commit message:',
      validate: input => (input ? true : 'A commit message is mandatory!'),
    },
    {
      type: 'confirm',
      when: answers => answers.commitMessage.length > 50,
      name: 'commitMessageWarning',
      message: chalk.yellow('A maximum commit message length of 50 is recommended! Do you want to continue anyway?'),
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
      default: answers => `${answers.type} ${answers.commitMessage}\n\n\n`,
    },
  ];

  return questionsList;
};

export { choices, questions };
