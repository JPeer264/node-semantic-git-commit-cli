import chalk from 'chalk';
import isAdded from 'is-git-added';
import isGit from 'is-git-repository';
import commitCount from 'git-commit-count';

import cli from '../lib/cli';
import sgcPrompt from '../lib/helpers/sgcPrompt';
import retryCommit from '../lib/helpers/retryCommit';
import promptOrInitialCommit from '../lib/helpers/promptOrInitialCommit';
import getConfig from '../lib/getConfig';

import pkg from '../package.json';

jest.mock('is-git-added');
jest.mock('is-git-repository');
jest.mock('git-commit-count');
jest.mock('../lib/helpers/sgcPrompt');
jest.mock('../lib/helpers/retryCommit');
jest.mock('../lib/helpers/promptOrInitialCommit');
jest.mock('../lib/getConfig');

beforeEach(() => {
  sgcPrompt.mockReset();
  retryCommit.mockReset();
  promptOrInitialCommit.mockReset();
  getConfig.mockReset();
  console.log = jest.fn();
  console.error = jest.fn();
});

it('should print the right version', () => {
  cli({ v: true });

  expect(console.log).toHaveBeenCalledWith(`v${pkg.version}`);
});

it('should fail on non git repository', async () => {
  isGit.mockReturnValue(false);
  cli();

  expect(console.error).toHaveBeenCalledWith('fatal: Not a git repository (or any of the parent directories): .git');
});

it('should fail on git repos where nothing is added', async () => {
  isGit.mockReturnValue(true);
  isAdded.mockReturnValue(false);
  cli();

  expect(console.error).toHaveBeenCalledWith(chalk.red('Please', chalk.bold('git add'), 'some files first before you commit.'));
});

it('should retry commit', async () => {
  isGit.mockReturnValue(true);
  isAdded.mockReturnValue(true);
  await cli({ r: true });

  expect(retryCommit).toBeCalledTimes(1);
});

it('should prompt init', async () => {
  isGit.mockReturnValue(true);
  isAdded.mockReturnValue(true);
  commitCount.mockReturnValue(0);
  getConfig.mockReturnValue({ initialCommit: { isEnabled: true } });
  await cli();

  expect(promptOrInitialCommit).toBeCalledTimes(1);
});

it('should not prompt init', async () => {
  isGit.mockReturnValue(true);
  isAdded.mockReturnValue(true);
  commitCount.mockReturnValue(0);
  getConfig.mockReturnValue({ initialCommit: { isEnabled: false } });
  await cli();

  expect(promptOrInitialCommit).not.toBeCalled();
  expect(sgcPrompt).toBeCalledTimes(1);
});
