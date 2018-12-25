import test from 'ava';
import chalk from 'chalk';
import { stub } from 'sinon';
import proxyquire from 'proxyquire';

import pkg from '../package.json';

stub(console, 'log');
stub(console, 'error');

const isGit = stub().returns(true);
const isGitAdded = stub().returns(true);
const commitCount = stub().returns(true);
const retryCommit = stub();
const promptOrInitialCommit = stub();
const sgcPrompt = stub();
const getConfig = stub();

const cli = proxyquire
  .noCallThru()
  .noPreserveCache()
  .load('../lib/cli', {
    'is-git-added': isGitAdded,
    'is-git-repository': isGit,
    'git-commit-count': commitCount,
    './helpers/sgcPrompt': sgcPrompt,
    './helpers/retryCommit': retryCommit,
    './helpers/promptOrInitialCommit': promptOrInitialCommit,
    './getConfig': getConfig,
  });

test.beforeEach(() => {
  sgcPrompt.reset();
  retryCommit.reset();
  console.log.reset();
  console.error.reset();
  promptOrInitialCommit.reset();
});

test('should print the right version', (t) => {
  cli.default({ v: true });

  t.is(console.log.args[0][0], `v${pkg.version}`);
});

test('should fail on non git repository', async (t) => {
  isGit.returns(false);
  cli.default();

  t.is(console.error.args[0][0], 'fatal: Not a git repository (or any of the parent directories): .git');

  isGit.resetBehavior();
});

test('should fail on git repos where nothing is added', async (t) => {
  isGit.returns(true);
  isGitAdded.returns(false);
  cli.default();

  t.is(console.error.args[0][0], chalk.red('Please', chalk.bold('git add'), 'some files first before you commit.'));
});

test('should retry commit', async (t) => {
  isGit.returns(true);
  isGitAdded.returns(true);
  await cli.default({ r: true });

  t.true(retryCommit.calledOnce);
});

test('should prompt init', async (t) => {
  isGit.returns(true);
  isGitAdded.returns(true);
  commitCount.returns(0);
  getConfig.returns({ initialCommit: { isEnabled: true } });
  await cli.default();

  t.true(promptOrInitialCommit.calledOnce);
});

test('should not prompt init', async (t) => {
  isGit.returns(true);
  isGitAdded.returns(true);
  commitCount.returns(0);
  getConfig.returns({ initialCommit: { isEnabled: false } });
  await cli.default();

  t.false(promptOrInitialCommit.called);
  t.true(sgcPrompt.calledOnce);
});
