import Config from '../../lib/Config';
import commitMeetsRules from '../../lib/helpers/commitMeetsRules';

describe('commitMeetsRules', () => {
  it('should have one of the types', () => {
    jest.spyOn(Config.prototype, 'config', 'get').mockReturnValue({
      types: [
        { type: 'Chore' },
      ],
    });

    expect(commitMeetsRules('Feat: false')).toBe(false);
    expect(commitMeetsRules('Chore: true')).toBe(true);
    expect(commitMeetsRules('Chore    :   true')).toBe(false);
  });

  it('should have one of the types 2', () => {
    jest.spyOn(Config.prototype, 'config', 'get').mockReturnValue({
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
    jest.spyOn(Config.prototype, 'config', 'get').mockReturnValue({
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
    jest.spyOn(Config.prototype, 'config', 'get').mockReturnValue({
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
    jest.spyOn(Config.prototype, 'config', 'get').mockReturnValue({
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
    jest.spyOn(Config.prototype, 'config', 'get').mockReturnValue({
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
    jest.spyOn(Config.prototype, 'config', 'get').mockReturnValue({
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
    jest.spyOn(Config.prototype, 'config', 'get').mockReturnValue({
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
    jest.spyOn(Config.prototype, 'config', 'get').mockReturnValue({
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
    jest.spyOn(Config.prototype, 'config', 'get').mockReturnValue({
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
    jest.spyOn(Config.prototype, 'config', 'get').mockReturnValue({
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
    jest.spyOn(Config.prototype, 'config', 'get').mockReturnValue({
      initialCommit: {
        isEnabled: true,
        message: 'initial commit',
      },
    });

    expect(commitMeetsRules('initial commit')).toBe(true);
    expect(commitMeetsRules('Initial commit')).toBe(false);

    jest.spyOn(Config.prototype, 'config', 'get').mockReturnValue({
      initialCommit: {
        isEnabled: false,
        message: 'initial commit',
      },
    });

    expect(commitMeetsRules('initial commit')).toBe(false);
    expect(commitMeetsRules('Initial commit')).toBe(false);
  });
});
