import merge from 'lodash.merge';
import findup from 'findup-sync';
import json from 'json-extra';
import path from 'path';
import os from 'os';
import fs from 'fs';

const cwd = process.cwd();
const homedir = os.homedir();

// eslint-disable-next-line global-require, import/no-dynamic-require
const safeRequire = (jsPath) => fs.existsSync(jsPath) && require(jsPath);

// params just for testing
const getConfig = (altPath, fileName = '.sgcrc') => {
  const pathString = findup(fileName, { cwd: altPath || cwd });
  const localeConfigJS = safeRequire(findup('sgc.config.js', { cwd }));
  const localeConfig = json.readToObjSync(pathString);
  const globalConfigJS = safeRequire(path.join(homedir, 'sgc.config.js'));
  const globalConfig = json.readToObjSync(path.join(homedir, '.sgcrc'));
  const packageConfig = json.readToObjSync(findup('package.json', { cwd })).sgc;
  const sgcrcDefaultConfig = json.readToObjSync(path.join(__dirname, '..', '.sgcrc'));
  const sgcrcTestDefaultConfig = json.readToObjSync(path.join(__dirname, '..', '.sgcrc_default'));

  const sgcrcDefault = sgcrcDefaultConfig || sgcrcTestDefaultConfig;

  // priority order (1. highest priority):
  // 1. local config
  //   - 1. sgc.config.js
  //   - 2. .sgcrc
  //   - 3. (package.json).sgc
  // 2. global config
  // 3. default config
  //   - 1. from ../.sgcrc
  //   - 2. test case ../.sgcrc is renamed to ../.sgcrc_default
  const config = localeConfigJS
    || localeConfig
    || packageConfig
    || globalConfigJS
    || globalConfig
    || sgcrcDefault;

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
  const { inherit, ...copiedConfig } = tempConfig;

  return copiedConfig;
};

export default getConfig;
