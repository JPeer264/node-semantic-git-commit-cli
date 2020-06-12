import getConfig from '../../lib/getConfig';
import commitMeetsRules from '../../lib/helpers/commitMeetsRules';

jest.mock('../../lib/getConfig', jest.fn);

const getConfigMock = getConfig as jest.MockedFunction<typeof getConfig>;

describe('commitMeetsRules', () => {
  it('should have one of the types', () => {
    getConfigMock.mockReturnValue({
      types: [
        { type: 'Chore' },
      ],
    });

    expect(commitMeetsRules('Feat: false')).toBe(false);
    expect(commitMeetsRules('Chore: true')).toBe(true);
    expect(commitMeetsRules('Chore    :   true')).toBe(false);
  });

  it('should have one of the types', () => {
    getConfigMock.mockReturnValue({
      lowercaseTypes: true,
      types: [
        { type: 'Chore' },
      ],
    });

    expect(commitMeetsRules('Feat: false')).toBe(false);
    expect(commitMeetsRules('feat: false')).toBe(false);
    expect(commitMeetsRules('chore: true')).toBe(true);
    expect(commitMeetsRules('Chore: true')).toBe(false);
    expect(commitMeetsRules('chore    :   true')).toBe(false);
  });

  it('should have one of the types with different delimiter', () => {
    getConfigMock.mockReturnValue({
      delimiter: ' -',
      types: [
        { type: 'Chore' },
        { type: 'Fix' },
      ],
    });

    expect(commitMeetsRules('Feat - false')).toBe(false);
    expect(commitMeetsRules('Fix - false')).toBe(true);
    expect(commitMeetsRules('Chore - true')).toBe(true);
    expect(commitMeetsRules('Chore    :   true')).toBe(false);
  });

  it('should not have scope', () => {
    getConfigMock.mockReturnValue({
      scope: false,
      types: [
        { type: 'Feat' },
      ],
    });

    expect(commitMeetsRules('Feat(scope): Test')).toBe(false);
    expect(commitMeetsRules('Feat (scope): Test')).toBe(false);
    expect(commitMeetsRules('Feat (scope)  : Test')).toBe(false);
    expect(commitMeetsRules('Feat: Test')).toBe(true);
    expect(commitMeetsRules('Feat: Test (scope at the end)')).toBe(true);
    expect(commitMeetsRules('Feat : Test')).toBe(false);
    expect(commitMeetsRules('Feat:    Test  ')).toBe(true);
    expect(commitMeetsRules('Feat  : Test')).toBe(false);
  });

  it('should have optional scope', () => {
    getConfigMock.mockReturnValue({
      scope: true,
      types: [
        { type: 'Feat' },
      ],
    });

    expect(commitMeetsRules('Feat(scope): Test')).toBe(true);
    expect(commitMeetsRules('Feat (scope): Test')).toBe(false);
    expect(commitMeetsRules('Feat (scope)  : Test')).toBe(false);
    expect(commitMeetsRules('Feat: Test')).toBe(true);
    expect(commitMeetsRules('Feat : Test')).toBe(false);
    expect(commitMeetsRules('Feat:    Test  ')).toBe(true);
    expect(commitMeetsRules('Feat  : Test')).toBe(false);
  });

  it('should have optional scope with scopespace', () => {
    getConfigMock.mockReturnValue({
      scope: true,
      addScopeSpace: true,
      types: [
        { type: 'Feat' },
      ],
    });

    expect(commitMeetsRules('Feat(scope): Test')).toBe(false);
    expect(commitMeetsRules('Feat (scope): Test')).toBe(true);
    expect(commitMeetsRules('Feat (scope)  : Test')).toBe(false);
    expect(commitMeetsRules('Feat: Test')).toBe(true);
    expect(commitMeetsRules('Feat : Test')).toBe(false);
    expect(commitMeetsRules('Feat:    Test  ')).toBe(true);
    expect(commitMeetsRules('Feat  : Test')).toBe(false);
  });

  it('should have dot ending', () => {
    getConfigMock.mockReturnValue({
      rules: {
        endWithDot: true,
      },
      types: [
        { type: 'Feat' },
      ],
    });

    expect(commitMeetsRules('Feat: Test.')).toBe(true);
    expect(commitMeetsRules('Feat: Test')).toBe(false);
    expect(commitMeetsRules('Feat   : Test.')).toBe(false);
    expect(commitMeetsRules('Feat   : Test')).toBe(false);
  });

  it('should have no dot ending', () => {
    getConfigMock.mockReturnValue({
      rules: {
        endWithDot: false,
      },
      types: [
        { type: 'Feat' },
      ],
    });

    expect(commitMeetsRules('Feat: Test')).toBe(true);
    expect(commitMeetsRules('Feat: Test.')).toBe(false);
    expect(commitMeetsRules('Feat   : Test.')).toBe(false);
    expect(commitMeetsRules('Feat   : Test')).toBe(false);
  });

  it('should have correct length', () => {
    getConfigMock.mockReturnValue({
      rules: {
        maxChar: 10,
        minChar: 8,
      },
      types: [
        { type: 'Feat' },
      ],
    });

    expect(commitMeetsRules('Feat: T')).toBe(false);
    expect(commitMeetsRules('Feat: Te')).toBe(true);
    expect(commitMeetsRules('Feat: Tes')).toBe(true);
    expect(commitMeetsRules('Feat: Test')).toBe(true);
    expect(commitMeetsRules('Feat: Test1')).toBe(false);
  });

  it('should have no length', () => {
    getConfigMock.mockReturnValue({
      types: [
        { type: 'Feat' },
      ],
    });

    expect(commitMeetsRules('Feat: T')).toBe(true);
    expect(commitMeetsRules('Feat: Te')).toBe(true);
    expect(commitMeetsRules('Feat: Tes')).toBe(true);
    expect(commitMeetsRules('Feat: Test')).toBe(true);
    expect(commitMeetsRules('Feat: Test1')).toBe(true);
  });

  it('should have body', () => {
    getConfigMock.mockReturnValue({
      body: true,
      types: [
        { type: 'Feat' },
      ],
    });

    expect(commitMeetsRules('Chore: T\n\nmy body in here')).toBe(false);
    expect(commitMeetsRules('Feat: T\n\nmy body in here')).toBe(true);
    expect(commitMeetsRules('Feat: T\ninvalid body in here')).toBe(false);
  });

  it('should have initial commit', () => {
    getConfigMock.mockReturnValue({
      initialCommit: {
        isEnabled: true,
        message: 'initial commit',
      },
    });

    expect(commitMeetsRules('initial commit')).toBe(true);
    expect(commitMeetsRules('Initial commit')).toBe(false);

    getConfigMock.mockReturnValue({
      initialCommit: {
        isEnabled: false,
        message: 'initial commit',
      },
    });

    expect(commitMeetsRules('initial commit')).toBe(false);
    expect(commitMeetsRules('Initial commit')).toBe(false);
  });
});
