import { ConfigHelper } from 'src/microservice/adapter/helper/config/config.helper';
import { EnumConfigAMQP } from './enum/enum-config-amqp.enumerator';

export const seedByCityProcess = ConfigHelper.getConfig(
  'seed.neighborhoods.by.city.process',
  EnumConfigAMQP.EXCHANGE
);

export const seedByCitySuccess = ConfigHelper.getConfig(
  'seed.neighborhoods.by.city.success',
  EnumConfigAMQP.EXCHANGE
);

export const seedByCityError = ConfigHelper.getConfig(
  'seed.neighborhoods.by.city.error',
  EnumConfigAMQP.EXCHANGE
);

const type = 'topic';
export const arrExchanges = mountExchanges([
  seedByCitySuccess,
  seedByCityError,
  seedByCityProcess
]);

function mountExchanges(arr) {
  return arr.map((item) => {
    return {
      name: item,
      type
    };
  });
}
