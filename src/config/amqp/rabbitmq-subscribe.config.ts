import { ConfigHelper } from '../../microservice/adapter/helper/config/config.helper';
import { EnumConfigAMQP } from './enum/enum-config-amqp.enumerator';
import {
  CHANNEL_SEED_NEIGHBORHOODS_BY_CITY,
  CHANNEL_SEED_NEIGHBORHOODS_BY_STATE
} from './rabbitmq-channels.config';
import {
  seedNeighborhoodsByCityError,
  seedNeighborhoodsByCityProcess,
  seedNeighborhoodsByCitySuccess,
  seedNeighborhoodsByStateProcess
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
  exchange: seedNeighborhoodsByCityProcess,
  routingKey: routeKeySub,
  queue: QUEUE_SEED_MESSAGES,
  queueOptions: {
    channel: CHANNEL_SEED_NEIGHBORHOODS_BY_CITY
  }
};

export const subscribeSeedByCitySuccess = {
  exchange: seedNeighborhoodsByCitySuccess,
  routingKey: routeKeySub,
  queue: QUEUE_SEED_SUCCESS
};

export const subscribeSeedByCityError = {
  exchange: seedNeighborhoodsByCityError,
  routingKey: routeKeySub,
  queue: QUEUE_SEED_ERROR
};

export const subscribeSeedByStateProcess = {
  exchange: seedNeighborhoodsByStateProcess,
  routingKey: routeKeySub,
  queue: QUEUE_SEED_MESSAGES,
  queueOptions: {
    channel: CHANNEL_SEED_NEIGHBORHOODS_BY_STATE
  }
};
