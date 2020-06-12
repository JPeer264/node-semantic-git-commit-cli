import fs from 'fs-extra';
import os from 'os';
import path from 'path';
import chalk from 'chalk';
import { stub } from 'sinon';

import { withEmoji, withoutEmoji } from './fixtures/questions';
import Config from '../lib/Config';
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
const fixtures = path.join(cwd, '__tests__', 'fixtures');
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
beforeAll(() => {
  // rename global config
  if (fs.existsSync(path.join(homedir, '.sgcrc'))) {
    globalExist = true;
    fs.renameSync(path.join(homedir, '.sgcrc'), path.join(homedir, `.sgcrc.${randomString}-${datetime}.back`));
  }

  // rename local sgcrc
  fs.renameSync(path.join(cwd, '.sgcrc'), path.join(cwd, '.sgcrc_default'));
});

afterAll(() => {
  // rename global config
  if (globalExist) {
    fs.renameSync(path.join(homedir, `.sgcrc.${randomString}-${datetime}.back`), path.join(homedir, '.sgcrc'));
  }

  // rename local sgcrc
  fs.renameSync(path.join(cwd, '.sgcrc_default'), path.join(cwd, '.sgcrc'));
});

it('choices are rendered without emoji', () => {
  const sgc = new Config(fixtures, '.sgcrc').config;
  const choicesList = choices(sgc);

  expect(choicesList).toEqual(withoutEmoji);
});

it('choices are rendered with emoji (default)', () => {
  const sgc = new Config(fixtures, '.sgcrc').config;

  sgc.emoji = true;

  const choicesList = choices(sgc);

  expect(choicesList).toEqual(withEmoji);
});

it('choices are rendered as custom type', () => {
  const sgc = new Config(fixtures, '.sgcrc.customType').config;

  sgc.emoji = false;
  sgc.types[0].type = false;
  sgc.types[1].type = false;

  const choicesList = choices(sgc);

  expect(choicesList[0].value).toEqual(`${customName} 1`);
  expect(choicesList[1].value).toEqual(`${customName} 2`);
});

it('check the values of the question object', () => {
  const { config } = new Config();
  const questionsList = questions(config);

  expect(typeof questionsList).toBe('object');
});

it('alternative description', () => {
  const sgc = new Config(fixtures, '.sgcrc').config;

  sgc.types[0].description = undefined;

  const choicesList = choices(sgc);

  expect(choicesList[0].name).toBe(`${chalk.bold('Add:')} `);
});

it('correct description', () => {
  const sgc = new Config(fixtures, '.sgcrc').config;

  sgc.types[0].description = 'lala land';

  const choicesList = choices(sgc);

  expect(choicesList[0].name).toBe(`${chalk.bold('Add:')} ${'lala land'}`);
});

it('wrong argKeys', () => {
  const sgc = new Config(fixtures, '.sgcrc').config;

  sgc.types[0].argKeys = 'wrong';

  const choicesList = choices(sgc);

  expect(choicesList[0].key).toEqual([]);
});

it('correct argKeys', () => {
  const sgc = new Config(fixtures, '.sgcrc').config;

  sgc.types[0].argKeys = ['n', 'notwrong'];

  const choicesList = choices(sgc);

  expect(choicesList[0].key).toEqual(['n', 'notwrong']);
});

it('TYPES | upperCase (default)', () => {
  const sgc = new Config(fixtures, '.sgcrc').config;

  const choicesList = choices(sgc);

  expect(choicesList[0].value).toBe('Add:');
});

it('TYPES | lowerCase', () => {
  const sgc = new Config(fixtures, '.sgcrc').config;

  sgc.lowercaseTypes = true;

  const choicesList = choices(sgc);

  expect(choicesList[0].value).toBe('add:');
});

it('TYPE | just show if type has not been added', () => {
  const { config } = new Config();
  const questionsList = questions(config);

  expect(questionsList[questionsListOrder.type].when()).toBe(true);
});

it('TYPE | not show if type has been added', () => {
  const { config } = new Config();
  const questionsList = questions(config, { t: 'feat' });

  expect(questionsList[questionsListOrder.type].when()).toBe(false);
});

it('TYPE | filter correct types', async () => {
  const { config } = new Config();
  const allChoices = choices(config);
  const [autocomplete] = questions(config);

  const answerOne = await autocomplete.source(undefined, 'feat');
  const answerTwo = await autocomplete.source();
  const answerKey = await autocomplete.source(undefined, 'performance');

  expect(answerOne).toHaveLength(1);
  expect(answerOne[0].value).toBe('Feat');
  expect(answerTwo).toHaveLength(allChoices.length);
  expect(answerKey).toHaveLength(1);
  expect(answerKey[0].value).toBe('Perf');
});

it('SCOPE | check if scope is off by default', () => {
  const { config } = new Config();
  const questionsList = questions(config);

  expect(questionsList[questionsListOrder.scope].when()).toBe(false);
});

it('CUSTOMTYPE | check if customType gets shown when type is defined', () => {
  const { config } = new Config(fixtures, '.sgcrc.customType');
  const questionsList = questions(config);

  expect(questionsList[questionsListOrder.customType].when({ type: 'Feat:' })).toBe(false);
  expect(questionsList[questionsListOrder.customType].when({ type: 'anything' })).toBe(false);
});

it('CUSTOMTYPE | check if customType gets shown when type is custom', () => {
  const { config } = new Config(fixtures, '.sgcrc.customType');
  const questionsList = questions(config);

  expect(questionsList[questionsListOrder.customType].when({ type: customName })).toBe(true);
  expect(questionsList[questionsListOrder.customType].when({ type: `${customName}feat` })).toBe(true);
});

it('CUSTOMTYPE | should not show when argv is specified', () => {
  const { config } = new Config(fixtures, '.sgcrc.customType');
  const questionsList = questions(config, { c: 'Feat:' });

  expect(questionsList[questionsListOrder.customType].when({ type: customName })).toBe(false);
  expect(questionsList[questionsListOrder.customType].when({ type: `${customName}feat` })).toBe(false);
});

it('CUSTOMTYPE | return prefixed answer', () => {
  const { config } = new Config(fixtures, '.sgcrc.customType');

  config.types[0].prefix = 'myprefix';

  const questionsList = questions(config);

  expect(questionsList[questionsListOrder.customType].filter('answer', { type: `${customName} 1` })).toBe('myprefixanswer');
});

it('CUSTOMTYPE | return nonprefixed answer', () => {
  const { config } = new Config(fixtures, '.sgcrc.customType');

  config.types[0].prefix = undefined;

  const questionsList = questions(config);

  expect(questionsList[questionsListOrder.customType].filter('answer', { type: `${customName} 1` })).toBe('answer');
});

it('CUSTOMTYPE | return any type', () => {
  const { config } = new Config(fixtures, '.sgcrc.customType');
  const questionsList = questions(config);

  expect(questionsList[questionsListOrder.customType].filter('something', { type: 'none' })).toBe('something');
});

it('SCOPE | check if scope is off when it has been added by argv', () => {
  const { config } = new Config();
  const questionsList = questions(config, { s: 'some scope' });

  expect(questionsList[questionsListOrder.scope].when()).toBe(false);
});

it('SCOPE | check if scope is off when it has been added in config and argv', () => {
  const { config } = new Config();

  config.scope = true;

  const questionsList = questions(config, { s: 'some scope' });

  expect(questionsList[questionsListOrder.scope].when()).toBe(false);
});

it('SCOPE | check if scope is on when it has been added just in config', () => {
  const { config } = new Config();

  config.scope = true;

  const questionsList = questions(config);

  expect(questionsList[questionsListOrder.scope].when()).toBe(true);
});

it('SCOPE | check if scope validates correctly', () => {
  const { config } = new Config();
  const questionsList = questions(config);

  expect(questionsList[questionsListOrder.scope].validate('not correct')).toBe('No whitespaces allowed');
  expect(questionsList[questionsListOrder.scope].validate('correct')).toBe(true);
});

it('MESSAGE | validate functions in questions', () => {
  const { config } = new Config();
  const questionsList = questions(config);

  expect(questionsList[questionsListOrder.message].validate('', { type: 'Fix' })).toBe('The commit message is not allowed to be empty');
  expect(questionsList[questionsListOrder.message].validate('input text', { type: 'Fix' })).toBe(true);
  expect(questionsList[questionsListOrder.message].validate('This message has over 72 characters. So this test will definitely fail. I can guarantee that I am telling the truth', { type: 'Fix' })).toBe('The commit message is not allowed to be longer as 72 character, but is 120 character long. Consider writing a body.\n');
});

it('MESSAGE | do not show if there is the message in argv', () => {
  const { config } = new Config();
  const questionsList = questions(config, { m: 'something' });

  expect(questionsList[questionsListOrder.message].when()).toBe(false);
});

it('MESSAGE | show if no argv has been added', () => {
  const { config } = new Config();
  const questionsList = questions(config);

  expect(questionsList[questionsListOrder.message].when()).toBe(true);
});

it('EDITOR | when and default functions in questions', () => {
  const { config } = new Config();
  const questionsList = questions(config);

  expect(questionsList[questionsListOrder.editor].when({ body: true })).toBe(true);
  expect(questionsList[questionsListOrder.editor].when({ body: false })).toBe(false);
});

it('EDITOR | should return formatted message', () => {
  const { config } = new Config();
  const questionsList = questions(config);

  expect(questionsList[questionsListOrder.editor].default({ message: 'message', type: 'type' })).toBe('type: message\n\n\n');
});

it('CONFIRM EDITOR | check if it shows if it has to', () => {
  const { config } = new Config();
  const questionsList = questions(config);

  expect(questionsList[3].when()).toBe(config.body);
});

it('CONFIRM EDITOR | check if it returns config.body', () => {
  const { config } = new Config();
  const questionsList = questions(config);

  expect(questionsList[questionsListOrder.body].when()).toBe(config.body);
});


it('INIT COMMIT | check message without emoji', () => {
  const { config } = new Config();
  const message = initMessage(config);

  expect(message).toBe(config.initialCommit.message);
});

it('INIT COMMIT | check message with emoji', () => {
  const { config } = new Config();

  config.emoji = true;

  const message = initMessage(config);

  expect(message).toBe(`${config.initialCommit.emoji} ${config.initialCommit.message}`);
});

it('INIT QUESTION | check message without emoji', () => {
  const { config } = new Config();
  const question = initQuestion(config);

  expect(question.message).toBe(`Confirm as first commit message: "${config.initialCommit.message}"`);
});

it('INIT QUESTION | check message with emoji', () => {
  const { config } = new Config();

  config.emoji = true;

  const question = initQuestion(config);

  expect(question.message).toBe(`Confirm as first commit message: "${config.initialCommit.emoji} ${config.initialCommit.message}"`);
});
