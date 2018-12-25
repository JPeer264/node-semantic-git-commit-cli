import inquirer from 'inquirer';

import getConfig from '../getConfig';
import combineTypeScope from './combineTypeScope';
import questions from '../questions';
import gitCommitExeca from './gitCommitExeca';

const config = getConfig();
const questionsList = questions(config);

const sgcPrompt = async () => {
  const answers = await inquirer.prompt(questionsList);
  const typeScope = combineTypeScope(answers.type, answers.scope);
  const message = answers.body ? `${answers.editor}` : `${typeScope} ${answers.description}`;

  return gitCommitExeca(message);
};

export default sgcPrompt;
