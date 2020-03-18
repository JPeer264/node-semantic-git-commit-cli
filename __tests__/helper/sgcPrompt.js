import { stub } from 'sinon';
import inquirer from 'inquirer';

import sgcPrompt from '../../lib/helpers/sgcPrompt';

stub(inquirer, 'prompt');

jest.mock('../../lib/helpers/gitCommitExeca', () => (input) => Promise.resolve(input));
jest.mock('../../lib/helpers/formatters', () => ({
  formatMessage: () => 'message',
}));

it('should return editor output', async () => {
  inquirer.prompt.returns(Promise.resolve({
    body: true,
    editor: 'editor output',
  }));

  const message = await sgcPrompt();

  expect(message).toBe('message');
});

it('should return scope with message', async () => {
  inquirer.prompt.returns(Promise.resolve({
    body: false,
    scope: 'scope',
    message: 'message',
  }));

  const message = await sgcPrompt();

  expect(message).toBe('message');
});
