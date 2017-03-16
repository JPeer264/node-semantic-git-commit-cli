import chalk from 'chalk';
import execa from 'execa';
import inquirer from 'inquirer';
import getConfig from './getConfig';

const promptConfig = {
  config: () => getConfig(),

  choices: (configuration) => {
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
  },

  answerTypes: (configuration) => {
    const configTypeList = [];
    configuration.types.forEach((type) => {
      const configType = type.type;

      configTypeList.push(configType);
    });
    return configTypeList;
  },

  questions: (choices) => {
    const questionsList = [
      {
        type: 'list',
        name: 'type',
        message: 'Select the type of your commit:',
        choices,
      },
      {
        type: 'input',
        name: 'description',
        message: 'Enter your commit message:',
        validate: /* istanbul ignore next */ input => (input ? true : 'A commit message is mandatory!'),
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
        when: /* istanbul ignore next */ answers => answers.moreInfo,
        default: /* istanbul ignore next */ answers => `${answers.type} ${answers.description}\n\n\n`,
      },
    ];
    return questionsList;
  },

  prompt: (questions) => {
    const config = promptConfig.config();
    const types = promptConfig.answerTypes(config);
    const cli = inquirer.prompt(questions).then((answers) => {
      const message = answers.moreInfo ? `${answers.editor}` : `${answers.type} ${answers.description}`;
      /* istanbul ignore if */
      if (types.includes(answers.type.split(' ')[1])) {
        return execa('git', ['commit', '-m', message])
          .then(result => console.log(result.stdout))
          .catch((err) => {
            console.error(chalk.red("Have you thought about 'git add' some files? Add files and try run following again:\n"));
            console.error(chalk.green(err.cmd));
          });
      }
      return answers.type;
    });
    return cli;
  },
};

export default promptConfig;
