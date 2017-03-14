import path from 'path';
import json from 'json-extra';

const cwd = process.cwd();

const getConfig = (altPath) => {
  const pathString = altPath || path.join(cwd, '.sgcrc');
  let configObject = json.readToObjSync(pathString);

  if (!configObject) {
    // if package.json .rcs else .sgcrc_default
    const packageJson = json.readToObjSync(path.join(cwd, 'package.json')).sgc;
    const sgcrcDefault = json.readToObjSync(path.join(__dirname, '..', '.sgcrc_default'));
    configObject = typeof packageJson === 'object' ? packageJson : sgcrcDefault;
  }

  return configObject;
};

export default getConfig;
