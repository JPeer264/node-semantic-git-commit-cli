import { stub } from 'sinon';
import inquirer from 'inquirer';

import gitCommitExeca from '../../lib/helpers/gitCommitExeca';
import sgcPrompt from '../../lib/helpers/sgcPrompt';
import promptOrInitialCommit from '../../lib/helpers/promptOrInitialCommit';

stub(inquirer, 'prompt');
jest.mock('../../lib/helpers/gitCommitExeca');
jest.mock('../../lib/helpers/sgcPrompt');

beforeEach(() => {
  gitCommitExeca.mockReturnValue(Promise.resolve());
  sgcPrompt.mockReturnValue(Promise.resolve());
});

it('should run gitCommitExeca', async () => {
  inquirer.prompt.returns(Promise.resolve({ initCommit: true }));

  await promptOrInitialCommit();

  expect(gitCommitExeca).toBeCalledTimes(1);
});

it('should run sgcPrompt', async () => {
  inquirer.prompt.returns(Promise.resolve({ initCommit: false }));

  await promptOrInitialCommit();

  expect(sgcPrompt).toBeCalledTimes(1);
});
