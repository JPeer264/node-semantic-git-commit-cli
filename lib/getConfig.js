import json from 'json-extra';
import merge from 'lodash.merge';
import os from 'os';
import fs from 'fs';
import path from 'path';

const cwd = process.cwd();
const homedir = os.homedir();

const safeRequire = jsPath => fs.existsSync(jsPath) && require(jsPath);

const getConfig = (altPath) => {
  const pathString = altPath || path.join(cwd, '.sgcrc');
  const localeConfigJS = safeRequire(path.join(cwd, 'sgc.config.js'));
  const localeConfig = json.readToObjSync(pathString);
  const globalConfigJS = safeRequire(path.join(homedir, 'sgc.config.js'));
  const globalConfig = json.readToObjSync(path.join(homedir, '.sgcrc'));
  const packageConfig = json.readToObjSync(path.join(cwd, 'package.json')).sgc;
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
  const config =
    localeConfigJS ||
    localeConfig ||
    packageConfig ||
    globalConfigJS ||
    globalConfig ||
    sgcrcDefault;

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
