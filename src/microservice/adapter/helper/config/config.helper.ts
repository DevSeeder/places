import configuration from '../../../../config/configuration';

export enum EnumConfigAMQP {
  QUEUE = 'microservices.rabbitmq.queue',
  EVENT = 'microservices.rabbitmq.event',
  EXCHANGE = 'microservices.rabbitmq.exchange'
}

export class ConfigHelper {
  static getConfig(config: string, typeConfig: string): string {
    if (config.split('.').length < 1) return config;

    let resConfig = configuration();

    resConfig = this.resolveConfig(resConfig, typeConfig);

    if (typeof resConfig == 'string') return resConfig;

    resConfig = this.resolveConfig(resConfig, config);

    return typeof resConfig == 'string' ? resConfig : null;
  }

  private static resolveConfig(resConfig: object, configKeys: string) {
    const treeConfig = configKeys.split('.');
    for (let i = 0; i < treeConfig.length; i++) {
      resConfig = resConfig[treeConfig[i]];
    }
    return resConfig;
  }
}
