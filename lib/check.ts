import gitCommitRange from 'git-commit-range';
import chalk from 'chalk';

import commitMeetsRules from './helpers/commitMeetsRules';

const check = ({ start }: { start?: string } = {}): void => {
  const commitRangeText: string[] = gitCommitRange({
    from: start,
    type: 'text',
    includeMerges: false,
  });
  const commitRangeSha: string[] = gitCommitRange({
    from: start,
    includeMerges: false,
  });

  let hasErrors = false;

  commitRangeText.forEach((commit, i) => {
    const isCommitValid = commitMeetsRules(commit);

    if (!isCommitValid) {
      const commitSha = commitRangeSha[i].slice(0, 7);

      hasErrors = true;

      // eslint-disable-next-line no-console
      console.error(chalk.red(`\n${chalk.bold(commitSha)}\n${commit}`));
    }

    return isCommitValid;
  });

  process.exit(+hasErrors);
};

export default check;
