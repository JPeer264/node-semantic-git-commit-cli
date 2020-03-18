import chalk from 'chalk';

const withEmoji = [
  {
    name: `${chalk.bold('Add:')} Files added`,
    value: ':emo: Add:',
    key: [],
  },
];

const withoutEmoji = [
  {
    name: `${chalk.bold('Add:')} Files added`,
    value: 'Add:',
    key: [],
  },
];

export {
  withEmoji,
  withoutEmoji,
};
