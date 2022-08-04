import { expect } from 'chai';
import { ObjectId } from 'mongoose';
import { ReferenceEventByCity } from '../../../../../../src/microservice/domain/model/references/reference-event-by-city.model';
import {
  MessageSeedNeighborhoodsByCityErrorDTO,
  MessageSeedNeighborhoodsByCitySuccessDTO
} from '../../../../../../src/microservice/domain/model/dto/messages/message-seed-neighborhoods-by-city-dto.model';

describe('MessageSeedNeighborhoodsByCitySuccessDTO ', () => {
  it('should instance MessageSeedNeighborhoodsByCitySuccessDTO  and return the object with the correct properties', async () => {
    const model = new MessageSeedNeighborhoodsByCitySuccessDTO(
      1,
      new Date(),
      new ReferenceEventByCity()
    );
    expect(model.seededCount).to.be.equal(1);
  });
});

describe('MessageSeedNeighborhoodsByCityErrorDTO  ', () => {
  it('should instance MessageSeedNeighborhoodsByCityErrorDTO  and return the object with the correct properties', async () => {
    const id: ObjectId = null;
    const model = new MessageSeedNeighborhoodsByCityErrorDTO(
      id,
      new Date(),
      new ReferenceEventByCity()
    );
    expect(model.idLogSeed).to.be.equal(id);
  });
});
