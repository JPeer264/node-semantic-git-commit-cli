import test from 'ava';
import proxyquire from 'proxyquire';
import { stub } from 'sinon';
import inquirer from 'inquirer';

stub(inquirer, 'prompt');

const gitCommitExeca = stub().returns(Promise.resolve());
const sgcPrompt = stub().returns(Promise.resolve());
const promptOrInitialCommit = proxyquire
  .noCallThru()
  .noPreserveCache()
  .load('../../lib/helpers/promptOrInitialCommit', {
    './gitCommitExeca': gitCommitExeca,
    './sgcPrompt': sgcPrompt,
  });

test('should run gitCommitExeca', async (t) => {
  inquirer.prompt.returns(Promise.resolve({ initCommit: true }));

  await promptOrInitialCommit.default();

  t.true(gitCommitExeca.calledOnce);
});

test('should run sgcPrompt', async (t) => {
  inquirer.prompt.returns(Promise.resolve({ initCommit: false }));

  await promptOrInitialCommit.default();

  t.true(sgcPrompt.calledOnce);
});
