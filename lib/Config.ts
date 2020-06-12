import merge from 'lodash.merge';
import findup from 'findup-sync';
import * as json from 'json-extra';
import path from 'path';
import os from 'os';
import fs from 'fs';

const cwd = process.cwd();
const homedir = os.homedir();

export interface SgcConfig {
  scope?: boolean;
  body?: boolean;
  emoji?: boolean;
  delimiter?: string;
  lowercaseTypes?: boolean;
  addScopeSpace?: boolean;
  initialCommit?: {
    isEnabled: boolean;
    emoji: string;
    message: string;
  };
  types: {
    emoji?: string;
    type: string;
    description?: string;
    argKeys?: string[];
  }[];
  rules?: {
    maxChar?: number;
    minChar?: number;
    endWithDot?: boolean;
  };
}

const safeRequire = (jsPath: string | null): SgcConfig | false => (
  // eslint-disable-next-line global-require, import/no-dynamic-require
  jsPath && fs.existsSync(jsPath) && require(jsPath)
);

class Config {
  altPath: string | null;

  fileName: string;

  constructor(altPath: string | null = null, fileName = '.sgcrc') {
    this.altPath = altPath;
    this.fileName = fileName;

    this.setConfig();
  }

  private setConfig(): SgcConfig {
    const pathString = findup(this.fileName, { cwd: this.altPath || cwd });
    const localeConfigJS = safeRequire(findup('sgc.config.js', { cwd }));
    const localeConfig = pathString ? json.readToObjSync<SgcConfig>(pathString) : false;
    const globalConfigJS = safeRequire(path.join(homedir, 'sgc.config.js'));
    const globalConfig = json.readToObjSync<SgcConfig>(path.join(homedir, '.sgcrc'));
    const packageJson = findup('package.json', { cwd });
    const packageConfig = packageJson
      ? (json.readToObjSync<{ sgc?: SgcConfig }>(packageJson) || {}).sgc
      : false;
    const sgcrcDefaultConfig = json.readToObjSync<SgcConfig>(path.join(__dirname, '..', '.sgcrc')) as SgcConfig;
    const sgcrcTestDefaultConfig = json.readToObjSync<SgcConfig>(path.join(__dirname, '..', '.sgcrc_default')) as SgcConfig;
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
    const modifiedConfig = merge({}, sgcrcDefault, config);

    // do not merge types
    // so return them to their set default
    if (config.types) {
      modifiedConfig.types = config.types;
    }

    if (config.initialCommit) {
      modifiedConfig.initialCommit = config.initialCommit;
    }

    return modifiedConfig;
  }

  public get config(): SgcConfig {
    return this.setConfig();
  }
}

export default Config;
