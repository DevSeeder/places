import { ConfigHelper } from '../../microservice/adapter/helper/config/config.helper';
import { EnumConfigAMQP } from './enum/enum-config-amqp.enumerator';
import {
  seedByCityError,
  seedByCitySuccess
} from './rabbitmq-exchanges.config';

const QUEUE_SEED_MESSAGES = ConfigHelper.getConfig(
  'messages',
  EnumConfigAMQP.QUEUE
);

/* EXPORT */
export const routeKeySub = 'sub-1';

export const subscribeSeedByCitySucess = {
  exchange: seedByCitySuccess,
  routingKey: routeKeySub,
  queue: QUEUE_SEED_MESSAGES
};

export const subscribeSeedByCityError = {
  exchange: seedByCityError,
  routingKey: routeKeySub,
  queue: QUEUE_SEED_MESSAGES
};
