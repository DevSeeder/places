import { ConfigHelper } from '../../microservice/adapter/helper/config/config.helper';
import { EnumConfigAMQP } from './enum/enum-config-amqp.enumerator';

export const CHANNEL_SEED_NEIGHBORHOODS_BY_CITY = ConfigHelper.getConfig(
  'seed.neighborhoods.by.city',
  EnumConfigAMQP.CHANNEL
);

export const CHANNEL_SEED_NEIGHBORHOODS_BY_STATE = ConfigHelper.getConfig(
  'seed.neighborhoods.by.state',
  EnumConfigAMQP.CHANNEL
);

const DEFAULT_CHANNEL = CHANNEL_SEED_NEIGHBORHOODS_BY_CITY;

const prefetchCount = ConfigHelper.getConfig(
  'prefetch-count',
  EnumConfigAMQP.CHANNEL
);

export const channelsConfig = mountChannels([
  CHANNEL_SEED_NEIGHBORHOODS_BY_CITY,
  CHANNEL_SEED_NEIGHBORHOODS_BY_STATE
]);

function mountChannels(arr) {
  const channels = {};
  arr.forEach((item) => {
    channels[item] = {
      prefetchCount,
      default: item == DEFAULT_CHANNEL
    };
  });
  return channels;
}
