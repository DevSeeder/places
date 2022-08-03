import configuration from '../../../../config/configuration';

export class ConfigHelper {
  static getConfig(config: string, typeConfig: string): string {
    let resConfig = configuration();

    resConfig = this.resolveConfig(resConfig, typeConfig);

    if (typeof resConfig == 'string') return resConfig;

    resConfig = this.resolveConfig(resConfig, config);

    return typeof resConfig == 'string' ? resConfig : null;
  }

  private static resolveConfig(resConfig: object, configKeys: string) {
    const treeConfig = configKeys.split('.');
    for (const nodeCfg of treeConfig) {
      resConfig = resConfig[nodeCfg];
    }
    return resConfig;
  }
}
