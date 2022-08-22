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
import {
  QUEUE_SEED_ERROR_NEIGHBORHOODS_BY_CITY,
  QUEUE_SEED_MESSAGE_NEIGHBORHOODS_BY_CITY,
  QUEUE_SEED_MESSAGE_NEIGHBORHOODS_BY_STATE,
  QUEUE_SEED_SUCCESS_NEIGHBORHOODS_BY_CITY
} from './rabbitmq-queues.config';

/* EXPORT */
export const routeKeySub = 'sub-1';

export const subscribeSeedByCityProcess = {
  exchange: seedNeighborhoodsByCityProcess,
  routingKey: routeKeySub,
  queue: QUEUE_SEED_MESSAGE_NEIGHBORHOODS_BY_CITY,
  queueOptions: {
    channel: CHANNEL_SEED_NEIGHBORHOODS_BY_CITY
  }
};

export const subscribeSeedByCitySuccess = {
  exchange: seedNeighborhoodsByCitySuccess,
  routingKey: routeKeySub,
  queue: QUEUE_SEED_SUCCESS_NEIGHBORHOODS_BY_CITY
};

export const subscribeSeedByCityError = {
  exchange: seedNeighborhoodsByCityError,
  routingKey: routeKeySub,
  queue: QUEUE_SEED_ERROR_NEIGHBORHOODS_BY_CITY
};

export const subscribeSeedByStateProcess = {
  exchange: seedNeighborhoodsByStateProcess,
  routingKey: routeKeySub,
  queue: QUEUE_SEED_MESSAGE_NEIGHBORHOODS_BY_STATE,
  queueOptions: {
    channel: CHANNEL_SEED_NEIGHBORHOODS_BY_STATE
  }
};
