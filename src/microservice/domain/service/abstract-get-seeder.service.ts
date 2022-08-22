import { Injectable } from '@nestjs/common';
import { AbstractService } from './abstract-service.service';
import { FinderDBService } from '../interface/service/finder-db-service.interface';
import { SeederService } from '../interface/service/seeder-service.interface';

@Injectable()
export abstract class AbstractGetSeederService<
  SearchElements,
  ValidOutput,
  ResponseElement,
  ResponseDB
> extends AbstractService {
  constructor(
    protected readonly finderService: FinderDBService<ValidOutput, ResponseDB>,
    protected readonly seederService: SeederService<
      SearchElements,
      ValidOutput,
      ResponseElement
    >
  ) {
    super();
  }

  async getFindAndSeedElements(
    searchParams: SearchElements
  ): Promise<ResponseElement[] | ResponseDB[]> {
    const convertedSearch = await this.validateAndConvertInput(searchParams);

    const resMongo = await this.finderService.searchInDatabase(convertedSearch);

    if (resMongo.length === 0) {
      this.logger.log('Searching by puppeteer...');
      const resPuppeteer = await this.seederService.searchByPuppeterAndSave(
        searchParams,
        convertedSearch
      );

      this.logger.log('Returning Puppeteer response...');
      return resPuppeteer;
    }

    this.logger.log('Returning MongoDB response...');

    return resMongo;
  }

  abstract validateAndConvertInput(
    searchParams: SearchElements
  ): Promise<ValidOutput>;
}
