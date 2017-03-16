import test from 'ava';
import path from 'path';
import chalk from 'chalk';
import json from 'json-extra';
import getConfig from '../lib/getConfig';
import { choices, questions } from '../lib/promptConfig';

const cwd = process.cwd();

test('get configuration file equals .sgcrc_default', (t) => {
  t.deepEqual(getConfig(), json.readToObjSync(path.join(cwd, '.sgcrc_default')));
});

test('choices are the same as choices generated from .sgcrc_default', (t) => {
  const sgc = getConfig();
  const configuration = getConfig();
  const choicesList = choices(configuration);
  const choicesArray = [];

  Promise.resolve(() => {
    sgc.types.forEach((type) => {
      const emoji = `${type.emoji} ` || '';
      const configType = type.type;
      const description = type.description || '';

      choicesArray.push({
        value: emoji + configType,
        name: `${chalk.bold(configType)} ${description}`,
      });
    }).then(() => {
      t.deepEqual(choicesList, choicesArray);
    });
  });
});

test('check the values of the question object', (t) => {
  const configuration = getConfig();
  const choicesList = choices(configuration);
  const questionsList = questions(choicesList);

  t.deepEqual(typeof questionsList, 'object');
});

test('validate functions in questions', (t) => {
  const configuration = getConfig();
  const choicesList = choices(configuration);
  const questionsList = questions(choicesList);

  t.deepEqual(questionsList[1].validate('input text'), true);
  t.deepEqual(questionsList[1].validate(), 'A commit message is mandatory!');
});
