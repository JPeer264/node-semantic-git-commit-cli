import inquirer from 'inquirer';

import getConfig from '../getConfig';
import {
  initMessage,
  initQuestion,
} from '../questions';
import gitCommitExeca from './gitCommitExeca';
import sgcPrompt from './sgcPrompt';

const promptOrInitialCommit = async (argv) => {
  const config = getConfig();
  const question = initQuestion(config);
  const message = initMessage(config);
  const answers = await inquirer.prompt(question);

  if (answers.initCommit) {
    await gitCommitExeca(message);
  } else {
    await sgcPrompt(argv);
  }
};

export default promptOrInitialCommit;
