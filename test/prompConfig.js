import test from 'ava';
import path from 'path';
import chalk from 'chalk';
import json from 'json-extra';
import bddStdin from 'bdd-stdin';
import getConfig from '../lib/getConfig';
import promptConfig from '../lib/promptConfig';

const cwd = process.cwd();

test('get configuration file equals .sgcrc_default', (t) => {
  const cli = promptConfig;
  const config = cli.config();
  t.deepEqual(config, json.readToObjSync(path.join(cwd, '.sgcrc_default')));
});

test('choises are the same as choises generated from .sgcrc_default', (t) => {
  const sgc = getConfig();
  const cli = promptConfig;
  const config = cli.config();
  const choices = cli.choices(config);
  const choicesList = [];

  Promise.resolve(() => {
    sgc.types.forEach((type) => {
      const emoji = `${type.emoji} ` || '';
      const configType = type.type;
      const description = type.description || '';

      choicesList.push({
        value: emoji + configType,
        name: `${chalk.bold(configType)} ${description}`,
      });
    }).then(() => {
      t.deepEqual(choices, choicesList);
    });
  });
});

test('check the values of the question object', (t) => {
  const cli = promptConfig;
  const config = cli.config();
  const choices = cli.choices(config);
  const questions = cli.questions(choices);

  t.deepEqual(questions[0].type, 'list');
  t.deepEqual(questions[0].name, 'type');
  t.deepEqual(questions[0].message, 'Select the type of your commit:');
  t.deepEqual(typeof questions[0].choices, 'object');

  t.deepEqual(questions[1].type, 'input');
  t.deepEqual(questions[1].name, 'description');
  t.deepEqual(questions[1].message, 'Enter your commit message:');
  t.deepEqual(typeof questions[1].validate, 'function');

  t.deepEqual(questions[2].type, 'confirm');
  t.deepEqual(questions[2].name, 'moreInfo');
  t.deepEqual(questions[2].message, 'Do you want to add more information to your commit?');
  t.deepEqual(questions[2].default, false);

  t.deepEqual(questions[3].type, 'editor');
  t.deepEqual(questions[3].name, 'editor');
  t.deepEqual(questions[3].message, 'This will let you add more information');
  t.deepEqual(typeof questions[3].when, 'function');
  t.deepEqual(typeof questions[3].default, 'function');
});

test('check cli', (t) => {
  bddStdin(bddStdin.keys.down, '\n');
  const questions = [
    {
      type: 'list',
      name: 'type',
      message: 'Select the type of your commit:',
      choices: [
        '1', '2', '3',
      ],
    },
  ];
  const cli = promptConfig;
  return Promise.resolve(cli.prompt(questions))
    .then((res) => {
      t.deepEqual('2', res);
    });
});
