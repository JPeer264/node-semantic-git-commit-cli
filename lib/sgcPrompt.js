import chalk from 'chalk';
import execa from 'execa';
import inquirer from 'inquirer';
import getConfig from './getConfig';

const sgcPrompt = () => {
  const config = getConfig();
  const choices = [];

  config.types.forEach((type) => {
    const emoji = `${type.emoji} ` || '';
    const configType = type.type;
    const description = type.description || '';

    choices.push({
      value: emoji + configType,
      name: `${chalk.bold(configType)} ${description}`,
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
    message: 'This will let you add more information',
    when: answers => answers.moreInfo,
    default: answers => `${answers.type} ${answers.description}\n\n\n`,
  }];

  inquirer.prompt(questions).then((answers) => {
    const message = answers.moreInfo ? `"${answers.editor}"` : `"${answers.type} ${answers.description}"`;

    execa('git', ['commit', '-m', message])
      .then(result => console.log(result.stdout))
      .catch((err) => {
        console.error(chalk.red("Have you thought about 'git add' some files? Add files and try run following again:\n"));
        console.error(chalk.green(err.cmd));
      });
  });
};

export default sgcPrompt;
