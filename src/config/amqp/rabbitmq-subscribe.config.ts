import { ConfigHelper } from '../../microservice/adapter/helper/config/config.helper';
import { EnumConfigAMQP } from './enum/enum-config-amqp.enumerator';
import {
  seedByCityError,
  seedByCityProcess,
  seedByCitySuccess
} from './rabbitmq-exchanges.config';

const QUEUE_SEED_MESSAGES = ConfigHelper.getConfig(
  'messages',
  EnumConfigAMQP.QUEUE
);

const QUEUE_SEED_SUCCESS = ConfigHelper.getConfig(
  'success',
  EnumConfigAMQP.QUEUE
);

const QUEUE_SEED_ERROR = ConfigHelper.getConfig('error', EnumConfigAMQP.QUEUE);

/* EXPORT */
export const routeKeySub = 'sub-1';

export const subscribeSeedByCityProcess = {
  exchange: seedByCityProcess,
  routingKey: routeKeySub,
  queue: QUEUE_SEED_MESSAGES,
  queueOptions: {
    channel: 'channel-1'
  }
};

export const subscribeSeedByCitySuccess = {
  exchange: seedByCitySuccess,
  routingKey: routeKeySub,
  queue: QUEUE_SEED_SUCCESS
};

export const subscribeSeedByCityError = {
  exchange: seedByCityError,
  routingKey: routeKeySub,
  queue: QUEUE_SEED_ERROR
};
