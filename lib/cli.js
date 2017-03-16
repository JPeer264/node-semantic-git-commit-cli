#!/usr/bin/env node
import promptConfig from './promptConfig';

const cli = promptConfig;
const config = cli.config();
const choices = cli.choices(config);
const questions = cli.questions(choices);

cli.prompt(questions);
