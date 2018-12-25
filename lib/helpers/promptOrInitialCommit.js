import inquirer from 'inquirer';

import getConfig from '../getConfig';
import {
  initMessage,
  initQuestion,
} from '../questions';
import gitCommitExeca from './gitCommitExeca';
import sgcPrompt from './sgcPrompt';

const config = getConfig();
const question = initQuestion(config);

const promptOrInitialCommit = async () => {
  const message = initMessage(config);
  const answers = await inquirer.prompt(question);

  if (answers.initCommit) {
    await gitCommitExeca(message);
  } else {
    await sgcPrompt();
  }
};

export default promptOrInitialCommit;
