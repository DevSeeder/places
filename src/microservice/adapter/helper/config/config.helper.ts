import configuration from '../../../../config/configuration';

export enum EnumConfigAMQP {
  EVENT = 'microservices.rabbitmq.event'
}

export class ConfigHelper {
  static getConfig(config: string, typeConfig: string) {
    if (config.split('.').length < 2) return config;
    let resConfig = configuration();
    resConfig = this.resolveConfig(resConfig, typeConfig);
    resConfig = this.resolveConfig(resConfig, config);
    return resConfig;
  }

  private static resolveConfig(resConfig: object, configKeys: string) {
    const treeConfig = configKeys.split('.');
    for (let i = 0; i < treeConfig.length; i++) {
      resConfig = resConfig[treeConfig[i]];
    }
    return resConfig;
  }
}
