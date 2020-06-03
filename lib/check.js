import gitCommitRange from 'git-commit-range';
import chalk from 'chalk';

import commitMeetsRules from './helpers/commitMeetsRules';

const check = ({ start } = {}) => {
  const commitRangeText = gitCommitRange({
    from: start,
    type: 'text',
    includeMerges: false,
  });
  const commitRangeSha = gitCommitRange({
    from: start,
    includeMerges: false,
  });

  let hasErrors = false;

  commitRangeText.forEach((commit, i) => {
    const isCommitValid = commitMeetsRules(commit);

    if (!isCommitValid) {
      const commitSha = commitRangeSha[i].slice(0, 7);

      hasErrors = true;

      console.error(chalk.red(`\n${chalk.bold(commitSha)}\n${commit}`));
    }

    return isCommitValid;
  });

  process.exit(+hasErrors);
};

export default check;
