import test from 'ava';
import proxyquire from 'proxyquire';
import { stub } from 'sinon';
import inquirer from 'inquirer';

stub(inquirer, 'prompt');

const gitCommitExeca = stub().callsFake((input) => Promise.resolve(input));
const formatters = {
  formatMessage: stub().returns('message'),
};
const promptOrInitialCommit = proxyquire
  .noCallThru()
  .noPreserveCache()
  .load('../../lib/helpers/sgcPrompt', {
    './gitCommitExeca': gitCommitExeca,
    './formatters': formatters,
  });

test('should return editor output', async (t) => {
  inquirer.prompt.returns(Promise.resolve({
    body: true,
    editor: 'editor output',
  }));

  const message = await promptOrInitialCommit.default();

  t.is(message, 'message');
});

test('should return scope with message', async (t) => {
  inquirer.prompt.returns(Promise.resolve({
    body: false,
    scope: 'scope',
    message: 'message',
  }));

  const message = await promptOrInitialCommit.default();

  t.is(message, 'message');
});
