import { State } from '../../../src/microservice/domain/schemas/state.schema';

export const mockState = (): State => {
  const state = new State();
  state.stateCode = 'SC';
  state.id = 100;
  state.name = 'Santa Catarina';
  return state;
};
