import os from 'os';
import test from 'ava';
import path from 'path';
import chalk from 'chalk';
import fs from 'fs-extra';
import json from 'json-extra';

import getConfig from '../lib/getConfig';
import { choices, questions } from '../lib/promptConfig';

const cwd = process.cwd();
const homedir = os.homedir();
const date = new Date();
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

test('choices are the same as choices generated from .sgcrc_default', async (t) => {
  const sgc = await getConfig();
  const choicesList = await choices(sgc);
  const choicesArray = [];

  sgc.types.forEach((type) => {
    const emoji = `${type.emoji} ` || '';
    const configType = type.type;
    const description = type.description || '';

    choicesArray.push({
      value: emoji + configType,
      name: `${chalk.bold(configType)} ${description}`,
    });
  });

  t.deepEqual(choicesList, await choicesArray);
});

test('check the values of the question object', async (t) => {
  const configuration = await getConfig();
  const choicesList = await choices(configuration);
  const questionsList = await questions(choicesList, configuration);

  t.deepEqual(typeof questionsList, 'object');
});

test('validate functions in questions', async (t) => {
  const configuration = await getConfig();
  const choicesList = await choices(configuration);
  const questionsList = await questions(choicesList, configuration);

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
