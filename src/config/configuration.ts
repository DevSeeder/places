import { readFileSync } from 'fs';
import * as yaml from 'js-yaml';
import { join } from 'path';
import * as dotenv from 'dotenv';

dotenv.config();

const YAML_CONFIG_FILENAME = '../../config/yaml/values.yaml';

export default () => {
  const configYaml = yaml.load(
    readFileSync(join(__dirname, YAML_CONFIG_FILENAME), 'utf8')
  ) as Record<string, any>;
  return resolveEnvVars(configYaml);
};

function resolveEnvVars(obj: object) {
  const objConfig = {};
  Object.keys(obj).forEach((key) => {
    objConfig[key] =
      typeof obj[key] != 'object'
        ? getVarsFromEnvFile(obj[key])
        : resolveEnvVars(obj[key]);
  });
  return objConfig;
}

function textExtract(txt: string, start: string, end: string): string[] {
  return txt
    .split(start)
    .filter(function (v) {
      return v.indexOf(end) > -1;
    })
    .map(function (value) {
      return value.split(end)[0];
    });
}

function getVarsFromEnvFile(value): string {
  if (typeof value != 'string') return value;
  const matches = textExtract(value, '${', '}');
  return matches != null && matches.length > 0
    ? replaceEnvVar(value, matches)
    : value;
}

function replaceEnvVar(value, matches): string {
  matches.forEach((element) => {
    value = value.replace(`\${${element}}`, process.env[element]);
  });
  return value;
}
