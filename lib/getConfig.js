import json from 'json-extra';
import merge from 'lodash.merge';
import os from 'os';
import path from 'path';

const cwd = process.cwd();
const homedir = os.homedir();

const getConfig = (altPath) => {
  const pathString = altPath || path.join(cwd, '.sgcrc');
  const configObject = json.readToObjSync(pathString);
  const globalConfig = json.readToObjSync(path.join(homedir, '.sgcrc'));
  const packageConfig = json.readToObjSync(path.join(cwd, 'package.json')).sgc;
  const sgcrcDefaultConfig = json.readToObjSync(path.join(__dirname, '..', '.sgcrc'));
  const sgcrcTestDefaultConfig = json.readToObjSync(path.join(__dirname, '..', '.sgcrc_default'));

  const sgcrcDefault = sgcrcDefaultConfig || sgcrcTestDefaultConfig;

  // priority order (1. highest priority):
  // 1. local config
  //   - 1. .sgcrc
  //   - 2. (package.json).sgc
  // 2. global config
  // 3. default config
  //   - 1. from ../.sgcrc
  //   - 2. test case ../.sgcrc is renamed to ../.sgcrc_default
  const config = configObject || packageConfig || globalConfig || sgcrcDefault;

  // set defaults which are necessary
  const tempConfig = merge({}, sgcrcDefault, config);

  // do not merge types
  // so return them to their set default
  if (config.types) {
    tempConfig.types = config.types;
  }

  if (config.initialCommit) {
    tempConfig.initialCommit = config.initialCommit;
  }

  // next will remove "inherit" from the config
  // eslint-disable-next-line
  const { inherit, ...copiedConfig } = tempConfig;

  return copiedConfig;
};

export default getConfig;
