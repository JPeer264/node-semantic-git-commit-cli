import os from 'os';
import path from 'path';
import json from 'json-extra';

const cwd = process.cwd();
const homedir = os.homedir();

const getConfig = (altPath) => {
  const pathString = altPath || path.join(cwd, '.sgcrc');
  const configObject = json.readToObjSync(pathString);
  const globalConfig = json.readToObjSync(path.join(homedir, '.sgcrc'));
  const packageConfig = json.readToObjSync(path.join(cwd, 'package.json')).sgc;
  const sgcrcDefaultConfig = json.readToObjSync(path.join(__dirname, '..', '.sgcrc_default'));

  // priority order (1. highest priority):
  // 1. local config
  //   - 1. .sgcrc
  //   - 2. (package.json).sgc
  // 2. global config
  // 3. default config from ../.sgcrc_default
  const config = configObject || packageConfig || globalConfig || sgcrcDefaultConfig;

  return config;
};

export default getConfig;
