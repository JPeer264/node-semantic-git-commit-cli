import os from 'os';
import test from 'ava';
import path from 'path';
import fs from 'fs-extra';
import json from 'json-extra';

import getConfig from '../lib/getConfig';
import { choices, questions } from '../lib/promptConfig';
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
  if (fs.existsSync(path.join(homedir, '.sgcrc'))) {
    globalExist = true;
    fs.renameSync(path.join(homedir, '.sgcrc'), path.join(homedir, `.sgcrc.${randomString}-${datetime}.back`));
  }
});

test.after(() => {
  if (globalExist) {
    fs.renameSync(path.join(homedir, `.sgcrc.${randomString}-${datetime}.back`), path.join(homedir, '.sgcrc'));
  }
});

test('get configuration file equals .sgcrc_default', (t) => {
  t.deepEqual(getConfig(), json.readToObjSync(path.join(cwd, '.sgcrc_default')));
});

test('choices are rendered without emojis', (t) => {
  const sgc = getConfig(path.join(fixtures, '.sgcrc'));

  sgc.emojies = false;

  const choicesList = choices(sgc);

  t.deepEqual(choicesList, withoutEmoji);
});

test('choices are rendered with emojis (default)', (t) => {
  const sgc = getConfig(path.join(fixtures, '.sgcrc'));
  const choicesList = choices(sgc);

  t.deepEqual(choicesList, withEmoji);
});

test('check the values of the question object', (t) => {
  const configuration = getConfig();
  const choicesList = choices(configuration);
  const questionsList = questions(choicesList, configuration);

  t.deepEqual(typeof questionsList, 'object');
});

test('validate functions in questions', (t) => {
  const configuration = getConfig();
  const choicesList = choices(configuration);
  const questionsList = questions(choicesList, configuration);

  t.deepEqual(questionsList[1].validate('input text'), true);
  t.deepEqual(questionsList[1].validate('This message has over 72 characters. So this test will definitely fail. I can guarantee that I am telling the truth'), 'The commit message is not allowed to be longer as 72. Consider writing a body.\n');
});

test('when and default functions in questions', (t) => {
  const configuration = getConfig();
  const choicesList = choices(configuration);
  const questionsList = questions(choicesList);

  t.deepEqual(questionsList[3].when({ moreInfo: true }), true);
  t.deepEqual(questionsList[3].when({ moreInfo: false }), false);
  t.deepEqual(questionsList[3].default({ type: ':wrench: Chore:', description: 'This is a commit message!', moreInfo: true }), ':wrench: Chore: This is a commit message!\n\n\n');
});
