import gitCommitRange from 'git-commit-range';
import chalk from 'chalk';

import commitMeetsRules from './helpers/commitMeetsRules';

const check = ({ start } = {}) => {
  const commitRangeText = gitCommitRange({
    from: start,
    type: 'text',
  });
  const commitRangeSha = gitCommitRange({
    from: start,
  });

  commitRangeText.forEach((commit, i) => {
    const isCommitValid = commitMeetsRules(commit);

    if (!isCommitValid) {
      const commitSha = commitRangeSha[i].slice(0, 7);

      console.log(chalk.red(`\n${chalk.bold(commitSha)}\n${commit}`));
    }
  });
};

export default check;
