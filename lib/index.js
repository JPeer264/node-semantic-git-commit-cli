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
  .alias('m', 'message')
  .describe('m', 'Use this to add it as commit message. If this option is given, it will skip the original message prompt')
  .alias('s', 'scope')
  .describe('s', 'Use this to add it as commit scope. If this option is given, it will skip the original message prompt. If scope is deactivated by the sgcrc this argument will get ignored')
  .alias('t', 'type')
  .describe('t', 'Use this to choose the type. Remember: the given key must be specified in your config file (types). If this option is given, it will skip the original message prompt')
  .help('h')
  .alias('h', 'help')
  .argv;

updateNotifier({ pkg }).notify();

cli(argv);
