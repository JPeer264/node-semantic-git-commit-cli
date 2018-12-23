import test from 'ava';
import proxyquire from 'proxyquire';
import { stub } from 'sinon';
import inquirer from 'inquirer';

stub(inquirer, 'prompt');

const gitCommitExeca = stub().callsFake(input => Promise.resolve(input));
const combineTypeScope = stub().returns('typescope');
const promptOrInitialCommit = proxyquire.noCallThru().load('../../lib/helpers/sgcPrompt', {
  './gitCommitExeca': gitCommitExeca,
  './combineTypeScope': combineTypeScope,
});

test('should return editor output', async (t) => {
  inquirer.prompt.returns(Promise.resolve({
    body: true,
    editor: 'editor output',
  }));

  const message = await promptOrInitialCommit.default();

  t.is(message, 'editor output');
});

test('should return typescope with description', async (t) => {
  inquirer.prompt.returns(Promise.resolve({
    body: false,
    typeScope: 'scope',
    description: 'description',
  }));

  const message = await promptOrInitialCommit.default();

  t.is(message, 'typescope description');
});
