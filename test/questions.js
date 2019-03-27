import test from 'ava';
import fs from 'fs-extra';
import os from 'os';
import path from 'path';
import chalk from 'chalk';
import { stub } from 'sinon';

import { withEmoji, withoutEmoji } from './fixtures/questions';
import getConfig from '../lib/getConfig';
import questions, {
  choices,
  customName,
  initMessage,
  initQuestion,
} from '../lib/questions';

stub(console, 'error');

const cwd = process.cwd();
const date = new Date();
const homedir = os.homedir();
const fixtures = path.join(cwd, 'test', 'fixtures');
const datetime = date.toISOString().slice(0, 10);
const randomString = Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 4);

let globalExist = false;

const questionsListOrder = {
  type: 0,
  customType: 1,
  scope: 2,
  message: 3,
  body: 4,
  editor: 5,
};

// rename global .sgcrc
test.before(() => {
  // rename global config
  if (fs.existsSync(path.join(homedir, '.sgcrc'))) {
    globalExist = true;
    fs.renameSync(path.join(homedir, '.sgcrc'), path.join(homedir, `.sgcrc.${randomString}-${datetime}.back`));
  }

  // rename local sgcrc
  fs.renameSync(path.join(cwd, '.sgcrc'), path.join(cwd, '.sgcrc_default'));
});

test.after.always(() => {
  // rename global config
  if (globalExist) {
    fs.renameSync(path.join(homedir, `.sgcrc.${randomString}-${datetime}.back`), path.join(homedir, '.sgcrc'));
  }

  // rename local sgcrc
  fs.renameSync(path.join(cwd, '.sgcrc_default'), path.join(cwd, '.sgcrc'));
});

test('choices are rendered without emoji', (t) => {
  const sgc = getConfig(path.join(fixtures, '.sgcrc'));
  const choicesList = choices(sgc);

  t.deepEqual(choicesList, withoutEmoji);
});

test('choices are rendered with emoji (default)', (t) => {
  const sgc = getConfig(path.join(fixtures, '.sgcrc'));

  sgc.emoji = true;

  const choicesList = choices(sgc);

  t.deepEqual(choicesList, withEmoji);
});

test('choices are rendered as custom type', (t) => {
  const sgc = getConfig();

  sgc.emoji = false;
  sgc.types[0].type = false;
  sgc.types[1].type = false;

  const choicesList = choices(sgc);

  t.deepEqual(choicesList[0].value, `${customName} 1`);
  t.deepEqual(choicesList[1].value, `${customName} 2`);
});

test('check the values of the question object', (t) => {
  const config = getConfig();
  const questionsList = questions(config);

  t.is(typeof questionsList, 'object');
});

test('alternative description', (t) => {
  const sgc = getConfig(path.join(fixtures, '.sgcrc'));

  sgc.types[0].description = undefined;

  const choicesList = choices(sgc);

  t.is(choicesList[0].name, `${chalk.bold('Add:')} `);
});

test('correct description', (t) => {
  const sgc = getConfig(path.join(fixtures, '.sgcrc'));

  sgc.types[0].description = 'lala land';

  const choicesList = choices(sgc);

  t.is(choicesList[0].name, `${chalk.bold('Add:')} ${'lala land'}`);
});

test('wrong argKeys', (t) => {
  const sgc = getConfig(path.join(fixtures, '.sgcrc'));

  sgc.types[0].argKeys = 'wrong';

  const choicesList = choices(sgc);

  t.deepEqual(choicesList[0].key, []);
});

test('correct argKeys', (t) => {
  const sgc = getConfig(path.join(fixtures, '.sgcrc'));

  sgc.types[0].argKeys = ['n', 'notwrong'];

  const choicesList = choices(sgc);

  t.deepEqual(choicesList[0].key, ['n', 'notwrong']);
});

test('TYPES | upperCase (default)', (t) => {
  const sgc = getConfig(path.join(fixtures, '.sgcrc'));

  const choicesList = choices(sgc);

  t.is(choicesList[0].value, 'Add:');
});

test('TYPES | lowerCase', (t) => {
  const sgc = getConfig(path.join(fixtures, '.sgcrc'));

  sgc.lowercaseTypes = true;

  const choicesList = choices(sgc);

  t.is(choicesList[0].value, 'add:');
});

test('TYPE | just show if type has not been added', (t) => {
  const config = getConfig();
  const questionsList = questions(config);

  t.is(questionsList[questionsListOrder.type].when(), true);
});

test('TYPE | not show if type has been added', (t) => {
  const config = getConfig();
  const questionsList = questions(config, { t: 'feat' });

  t.is(questionsList[questionsListOrder.type].when(), false);
});

test('SCOPE | check if scope is off by default', (t) => {
  const config = getConfig();
  const questionsList = questions(config);

  t.is(questionsList[questionsListOrder.scope].when(), false);
});

test('CUSTOMTYPE | check if customType gets shown when type is defined', (t) => {
  const config = getConfig();
  const questionsList = questions(config);

  t.is(questionsList[questionsListOrder.customType].when({ type: 'Feat:' }), false);
  t.is(questionsList[questionsListOrder.customType].when({ type: 'anything' }), false);
});

test('CUSTOMTYPE | check if customType gets shown when type is custom', (t) => {
  const config = getConfig();
  const questionsList = questions(config);

  t.is(questionsList[questionsListOrder.customType].when({ type: customName }), true);
  t.is(questionsList[questionsListOrder.customType].when({ type: `${customName}feat` }), true);
});

test('CUSTOMTYPE | should not show when argv is specified', (t) => {
  const config = getConfig();
  const questionsList = questions(config, { c: 'Feat:' });

  t.is(questionsList[questionsListOrder.customType].when({ type: customName }), false);
  t.is(questionsList[questionsListOrder.customType].when({ type: `${customName}feat` }), false);
});

test('CUSTOMTYPE | return prefixed answer', (t) => {
  const config = getConfig();

  config.types[0].prefix = 'myprefix';

  const questionsList = questions(config);

  t.is(questionsList[questionsListOrder.customType].filter('answer', { type: `${customName} 1` }), 'myprefixanswer');
});

test('CUSTOMTYPE | return nonprefixed answer', (t) => {
  const config = getConfig();

  config.types[0].prefix = undefined;

  const questionsList = questions(config);

  t.is(questionsList[questionsListOrder.customType].filter('answer', { type: `${customName} 1` }), 'answer');
});

test('CUSTOMTYPE | return any type', (t) => {
  const config = getConfig();
  const questionsList = questions(config);

  t.is(questionsList[questionsListOrder.customType].filter('something', { type: 'none' }), 'something');
});

test('SCOPE | check if scope is off when it has been added by argv', (t) => {
  const config = getConfig();
  const questionsList = questions(config, { s: 'some scope' });

  t.is(questionsList[questionsListOrder.scope].when(), false);
});

test('SCOPE | check if scope is off when it has been added in config and argv', (t) => {
  const config = getConfig();

  config.scope = true;

  const questionsList = questions(config, { s: 'some scope' });

  t.is(questionsList[questionsListOrder.scope].when(), false);
});

test('SCOPE | check if scope is on when it has been added just in config', (t) => {
  const config = getConfig();

  config.scope = true;

  const questionsList = questions(config);

  t.is(questionsList[questionsListOrder.scope].when(), true);
});

test('SCOPE | check if scope validates correctly', (t) => {
  const config = getConfig();
  const questionsList = questions(config);

  t.is(questionsList[questionsListOrder.scope].validate('not correct'), 'No whitespaces allowed');
  t.is(questionsList[questionsListOrder.scope].validate('correct'), true);
});

test('MESSAGE | validate functions in questions', (t) => {
  const config = getConfig();
  const questionsList = questions(config);

  t.is(questionsList[questionsListOrder.message].validate('', { type: 'Fix' }), 'The commit message is not allowed to be empty');
  t.is(questionsList[questionsListOrder.message].validate('input text', { type: 'Fix' }), true);
  t.is(questionsList[questionsListOrder.message].validate('This message has over 72 characters. So this test will definitely fail. I can guarantee that I am telling the truth', { type: 'Fix' }), 'The commit message is not allowed to be longer as 72 character, but is 120 character long. Consider writing a body.\n');
});

test('MESSAGE | do not show if there is the message in argv', (t) => {
  const config = getConfig();
  const questionsList = questions(config, { m: 'something' });

  t.is(questionsList[questionsListOrder.message].when(), false);
});

test('MESSAGE | show if no argv has been added', (t) => {
  const config = getConfig();
  const questionsList = questions(config);

  t.is(questionsList[questionsListOrder.message].when(), true);
});

test('EDITOR | when and default functions in questions', (t) => {
  const config = getConfig();
  const questionsList = questions(config);

  t.is(questionsList[questionsListOrder.editor].when({ body: true }), true);
  t.is(questionsList[questionsListOrder.editor].when({ body: false }), false);
});

test('EDITOR | should return formatted message', (t) => {
  const config = getConfig();
  const questionsList = questions(config);

  t.is(questionsList[questionsListOrder.editor].default({ message: 'message', type: 'type' }), 'type: message\n\n\n');
});

test('CONFIRM EDITOR | check if it shows if it has to', (t) => {
  const config = getConfig();
  const questionsList = questions(config);

  t.is(questionsList[3].when(), config.body);
});

test('INIT COMMIT | check message without emoji', (t) => {
  const config = getConfig();
  const message = initMessage(config);

  t.is(message, config.initialCommit.message);
});

test('INIT COMMIT | check message with emoji', (t) => {
  const config = getConfig();

  config.emoji = true;

  const message = initMessage(config);

  t.is(message, `${config.initialCommit.emoji} ${config.initialCommit.message}`);
});

test('INIT QUESTION | check message without emoji', (t) => {
  const config = getConfig();
  const question = initQuestion(config);

  t.is(question.message, `Confirm as first commit message: "${config.initialCommit.message}"`);
});

test('INIT QUESTION | check message with emoji', (t) => {
  const config = getConfig();

  config.emoji = true;

  const question = initQuestion(config);

  t.is(question.message, `Confirm as first commit message: "${config.initialCommit.emoji} ${config.initialCommit.message}"`);
});
