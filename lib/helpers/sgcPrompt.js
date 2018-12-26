import inquirer from 'inquirer';

import getConfig from '../getConfig';
import questions from '../questions';
import gitCommitExeca from './gitCommitExeca';
import { formatMessage } from './formatters';

const sgcPrompt = async (argv) => {
  const config = getConfig();
  const questionsList = questions(config, argv);
  const answers = await inquirer.prompt(questionsList);
  const message = formatMessage(answers, argv);

  console.log(message);

  return gitCommitExeca(message);
};

export default sgcPrompt;
