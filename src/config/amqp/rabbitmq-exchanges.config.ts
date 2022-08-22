import { ConfigHelper } from '../../microservice/adapter/helper/config/config.helper';
import { EnumConfigAMQP } from './enum/enum-config-amqp.enumerator';

export const seedNeighborhoodsByCityProcess = ConfigHelper.getConfig(
  'seed.neighborhoods.by.city.process',
  EnumConfigAMQP.EXCHANGE
);

export const seedNeighborhoodsByCitySuccess = ConfigHelper.getConfig(
  'seed.neighborhoods.by.city.success',
  EnumConfigAMQP.EXCHANGE
);

export const seedNeighborhoodsByCityError = ConfigHelper.getConfig(
  'seed.neighborhoods.by.city.error',
  EnumConfigAMQP.EXCHANGE
);

export const seedNeighborhoodsByStateProcess = ConfigHelper.getConfig(
  'seed.neighborhoods.by.state.process',
  EnumConfigAMQP.EXCHANGE
);

const type = 'topic';
export const arrExchanges = mountExchanges([
  seedNeighborhoodsByCitySuccess,
  seedNeighborhoodsByCityError,
  seedNeighborhoodsByCityProcess,
  seedNeighborhoodsByStateProcess
]);

function mountExchanges(arr) {
  return arr.map((item) => {
    return {
      name: item,
      type
    };
  });
}
