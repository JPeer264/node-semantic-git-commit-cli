import chalk from 'chalk';

const withEmoji = [
  {
    name: `${chalk.bold('Add:')} Files added`,
    value: ':emo: Add:',
  },
];

const withoutEmoji = [
  {
    name: `${chalk.bold('Add:')} Files added`,
    value: 'Add:',
  },
];

export {
  withEmoji,
  withoutEmoji,
};
