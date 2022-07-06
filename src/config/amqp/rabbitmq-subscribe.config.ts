import {
  ConfigHelper,
  EnumConfigAMQP
} from '../../microservice/adapter/helper/config/config.helper';

const QUEUE_SEED_MESSAGES = ConfigHelper.getConfig(
  'messages',
  EnumConfigAMQP.QUEUE
);

/* EXPORT */
export const routeKeySub = 'sub-1';

export const subscribeSeedByCitySucess = {
  exchange: ConfigHelper.getConfig(
    'seed.neighborhoods.by.city.success',
    EnumConfigAMQP.EXCHANGE
  ),
  routingKey: routeKeySub,
  queue: QUEUE_SEED_MESSAGES
};

export const subscribeSeedByCityError = {
  exchange: ConfigHelper.getConfig(
    'seed.neighborhoods.by.city.error',
    EnumConfigAMQP.EXCHANGE
  ),
  routingKey: routeKeySub,
  queue: QUEUE_SEED_MESSAGES
};
