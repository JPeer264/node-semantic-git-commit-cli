import inquirer from 'inquirer';

import Config from '../Config';
import questions from '../questions';
import gitCommitExeca from './gitCommitExeca';
import { formatMessage } from './formatters';

const sgcPrompt = async (argv) => {
  const { config } = new Config();
  const questionsList = questions(config, argv);
  const answers = await inquirer.prompt(questionsList);
  const message = formatMessage(answers, argv, config);

  return gitCommitExeca(message);
};

export default sgcPrompt;
