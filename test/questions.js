import os from 'os';
import test from 'ava';
import path from 'path';
import fs from 'fs-extra';

import getConfig from '../lib/getConfig';
import questions, { choices } from '../lib/questions';
import { withEmoji, withoutEmoji } from './fixtures/questions';

const cwd = process.cwd();
const date = new Date();
const homedir = os.homedir();
const fixtures = path.join(cwd, 'test', 'fixtures');
const datetime = date.toISOString().slice(0, 10);
const randomString = Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 4);

let globalExist = false;

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

test('check the values of the question object', (t) => {
  const config = getConfig();
  const questionsList = questions(config);

  t.is(typeof questionsList, 'object');
});

test('SCOPE | check if scope is off by default', (t) => {
  const config = getConfig();
  const questionsList = questions(config);

  t.is(questionsList[1].when(), false);
});

test('SCOPE | check if scope filters correctly', (t) => {
  const config = getConfig();
  const questionsList = questions(config);

  t.is(questionsList[1].filter('answer'), '(answer)');
  t.is(questionsList[1].filter(''), '');
});

test('SCOPE | check if scope validates correctly', (t) => {
  const config = getConfig();
  const questionsList = questions(config);

  t.is(questionsList[1].validate('not correct'), 'No whitespaces allowed');
  t.is(questionsList[1].validate('correct'), true);
});

test('COMMIT | validate functions in questions', (t) => {
  const config = getConfig();
  const questionsList = questions(config);

  t.is(questionsList[2].validate('input text'), true);
  t.is(questionsList[2].validate('This message has over 72 characters. So this test will definitely fail. I can guarantee that I am telling the truth'), 'The commit message is not allowed to be longer as 72. Consider writing a body.\n');
});

test('COMMIT | when and default functions in questions', (t) => {
  const config = getConfig();
  const questionsList = questions(config);

  t.is(questionsList[4].when({ body: true }), true);
  t.is(questionsList[4].when({ body: false }), false);
  t.deepEqual(questionsList[4].default({ type: ':wrench: Chore:', description: 'This is a commit message!', body: true }), ':wrench: Chore: This is a commit message!\n\n\n');
});

test('CONFIRM EDITOR | check if it shows if it has to', (t) => {
  const config = getConfig();
  const questionsList = questions(config);

  t.is(questionsList[3].when(), config.body);
});
