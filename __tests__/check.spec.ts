import gitCommitRange from 'git-commit-range';
import chalk from 'chalk';

import check from '../lib/check';

jest.mock('git-commit-range', jest.fn);

const gitCommitRangeMock = gitCommitRange as jest.MockedFunction<typeof gitCommitRange>;

describe('check', () => {
  beforeEach(() => {
    global.process.exit = jest.fn() as any;
    global.console.error = jest.fn() as any;

    chalk.enabled = false;
  });

  it('should have valid commits', () => {
    gitCommitRangeMock.mockReturnValue([
      'Feat: should be valid',
    ]);

    check();

    expect(process.exit).toBeCalledTimes(1);
    expect(process.exit).toBeCalledWith(0);

    check();

    expect(process.exit).toBeCalledTimes(2);
    expect(process.exit).toBeCalledWith(0);
  });

  it('should have valid initial commits', () => {
    gitCommitRangeMock.mockReturnValue([
      'Feat: should be valid',
      'Initial commit',
    ]);

    check();

    expect(process.exit).toBeCalledTimes(1);
    expect(process.exit).toBeCalledWith(0);
  });

  it('should have invalid commits', () => {
    gitCommitRangeMock.mockReturnValue([
      'NotValid : should be valid',
    ]);

    check();

    expect(process.exit).toBeCalledTimes(1);
    expect(process.exit).toBeCalledWith(1);
    // eslint-disable-next-line no-console
    expect(console.error).toBeCalledWith('\nNotVali\nNotValid : should be valid');

    check();

    expect(process.exit).toBeCalledTimes(2);
    expect(process.exit).toBeCalledWith(1);
  });
});
