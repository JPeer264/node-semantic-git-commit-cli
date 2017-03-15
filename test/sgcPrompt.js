import test from 'ava';
import prompt from '../lib/sgcPrompt';

test.skip((t) => {
  prompt();
  t.true(prompt());
});
