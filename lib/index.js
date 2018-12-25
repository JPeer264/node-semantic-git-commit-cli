#!/usr/bin/env node

import updateNotifier from 'update-notifier';
import yargs from 'yargs';

import pkg from '../package.json';
import cli from './cli';

const argv = yargs
  .usage('Usage: $0')
  .alias('v', 'version')
  .describe('v', 'Version number')
  .alias('r', 'retry')
  .describe('r', 'Retry your previous failed commit')
  .help('h')
  .alias('h', 'help')
  .argv;

updateNotifier({ pkg }).notify();

cli(argv);
