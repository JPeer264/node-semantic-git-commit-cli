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

  const sgcrcDefault = sgcrcDefaultConfig || sgcrcTestDefaultConfig;

  // priority order (1. highest priority):
  // 1. local config
  //   - 1. .sgcrc
  //   - 2. (package.json).sgc
  // 2. global config
  // 3. default config
  //   - 1. from ../.sgcrc
  //   - 2. test case ../.sgcrc is renamed to ../.sgcrc_default
  let config = configObject || packageConfig || globalConfig || sgcrcDefault;

  config.inherit = config.inherit === undefined ? {} : config.inherit;

  // set defaults
  let configDefaults = {
    questions: {
      scope: false,
      body: true,
    },
  };

  // inherit everything
  if (config.inherit === true) {
    configDefaults = sgcrcDefault;
  }

  if (Object.prototype.toString.call(config.inherit) === '[object Array]') {
    config.inherit.forEach((element) => {
      if (!config[element] && sgcrcDefault[element] !== undefined) {
        config[element] = sgcrcDefault[element];
      }
    });
  }

  config = merge({}, configDefaults, config);

  // next will remove "inherit" from the config
  // eslint-disable-next-line
  const { inherit, ...copiedConfig } = config;

  return copiedConfig;
};

export default getConfig;
