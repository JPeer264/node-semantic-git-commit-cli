import chalk from 'chalk';
import inquirer from 'inquirer';
import getConfig from './getConfig';

const sgcPrompt = () => {
  const config = getConfig();
  const choices = [];

  config.types.forEach((type) => {
    const emoji = `${type.emoji} ` || '';
    const prefix = type.type;
    const description = type.description || '';

    choices.push({
      value: emoji + prefix,
      name: `${chalk.bold(prefix)} ${description}`,
    });
  });

  const questions = [{
    type: 'list',
    name: 'type',
    message: 'Select the type of your commit:',
    choices,
  }, {
    type: 'input',
    name: 'description',
    message: 'Describe your commit message:',
  }, {
    type: 'confirm',
    name: 'moreInfo',
    message: 'You want to add more information to your commit?',
    default: false,
  }, {
    type: 'editor',
    name: 'editor',
    message: 'this is the message',
    when: answers => answers.moreInfo,
    default: answers => `${answers.type} ${answers.description}`,
  }];

  inquirer.prompt(questions).then((answers) => {
    // TODO commit message
    console.log(answers);
  });
};

export default sgcPrompt;
