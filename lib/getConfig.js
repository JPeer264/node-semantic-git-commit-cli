import os from 'os';
import path from 'path';
import json from 'json-extra';
import merge from 'lodash.merge';

const cwd = process.cwd();
const homedir = os.homedir();

const getConfig = (altPath) => {
  const pathString = altPath || path.join(cwd, '.sgcrc');
  const configObject = json.readToObjSync(pathString);
  const globalConfig = json.readToObjSync(path.join(homedir, '.sgcrc'));
  const packageConfig = json.readToObjSync(path.join(cwd, 'package.json')).sgc;
  const sgcrcDefaultConfig = json.readToObjSync(path.join(__dirname, '..', '.sgcrc'));
  const sgcrcTestDefaultConfig = json.readToObjSync(path.join(__dirname, '..', '.sgcrc_default'));

  // priority order (1. highest priority):
  // 1. local config
  //   - 1. .sgcrc
  //   - 2. (package.json).sgc
  // 2. global config
  // 3. default config from ../.sgcrc
  // 4. In the test case ../.sgcrc is renamed to ../.sgcrc_default
  let config = configObject
              || packageConfig
              || globalConfig
              || sgcrcDefaultConfig
              || sgcrcTestDefaultConfig;

  // set defaults
  const configDefaults = {
    questions: {
      scope: false,
      moreInfo: true,
    },
  };

  config = merge({}, configDefaults, config);

  return config;
};

export default getConfig;
