import { ConfigHelper } from '../../microservice/adapter/helper/config/config.helper';
import { EnumConfigAMQP } from './enum/enum-config-amqp.enumerator';

export const QUEUE_SEED_MESSAGE_NEIGHBORHOODS_BY_CITY = ConfigHelper.getConfig(
  'seed.neighborhoods.by.city.process',
  EnumConfigAMQP.QUEUE
);

export const QUEUE_SEED_SUCCESS_NEIGHBORHOODS_BY_CITY = ConfigHelper.getConfig(
  'seed.neighborhoods.by.city.success',
  EnumConfigAMQP.QUEUE
);

export const QUEUE_SEED_ERROR_NEIGHBORHOODS_BY_CITY = ConfigHelper.getConfig(
  'seed.neighborhoods.by.city.error',
  EnumConfigAMQP.QUEUE
);

export const QUEUE_SEED_MESSAGE_NEIGHBORHOODS_BY_STATE = ConfigHelper.getConfig(
  'seed.neighborhoods.by.state.process',
  EnumConfigAMQP.QUEUE
);
