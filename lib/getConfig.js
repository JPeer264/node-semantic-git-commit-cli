import path from 'path';
import json from 'json-extra';

const cwd = process.cwd();

const getConfig = (altPath) => {
  const pathString = altPath || path.join(cwd, '.sgcrc');
  let configObject = json.readToObjSync(pathString);

  if (!configObject) {
    // package.json .rcs if no other config is found
    configObject = json.readToObjSync(path.join(cwd, 'package.json')).sgc;
  }

  if (!configObject) {
    // if no config is available on the users project, the default settings should be used
    configObject = json.readToObjSync(path.join(__dirname, '..', '.sgcrc_default'));
  }

  return configObject;
};

export default getConfig;
