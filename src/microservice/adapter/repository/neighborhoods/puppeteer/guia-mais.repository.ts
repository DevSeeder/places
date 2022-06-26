import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CheerioAPI } from 'cheerio';
import { InjectPage } from 'nest-puppeteer';
import { NeighborhoodByCity } from '../../../../domain/model/neighborhoods/neighborhood-by-city.model';
import { SearchNeighborhoodsInput } from '../../../../domain/model/search/neighborhoods/search-neighborhoods-input.model';
import { IPuppeteerNeighborhoodRepository } from '../../../../domain/interface/puppeteer/repository/puppeteer-neighborhood-repository.interface';
import { PuppeteerNeighborhoodRepository } from '../../../../domain/repository/puppeteer/neighborhood/puppeteer-neighborhood.repository';
import { Page } from '../../../../domain/interface/puppeteer/page.interface';
import { EnumTranslations } from '../../../../domain/enumerators/enum-translations.enumerator';
import { ValidOutputSearchNeighborhood } from '../../../../domain/interface/valid-output-search/valid-outpu-search-neighborhood.interface';

@Injectable()
export class GuiaMaisRepository
  extends PuppeteerNeighborhoodRepository
  implements IPuppeteerNeighborhoodRepository
{
  language = EnumTranslations.BR;
  constructor(
    protected configService: ConfigService,
    @InjectPage() protected readonly page: Page
  ) {
    super(
      configService.get<string>('repository.neighborhoods.guia-mais.url'),
      page
    );
  }

  buildElementsFromDocument(
    searchParams,
    convertedSearch: ValidOutputSearchNeighborhood,
    $: CheerioAPI
  ): NeighborhoodByCity[] {
    const arrNeighborhoods = [];
    $('.cities.centerContent')
      .find('a')
      .each(function () {
        const neighborhood = new NeighborhoodByCity();

        neighborhood.name = $(this).text();
        neighborhood.cityId = convertedSearch.city.id;
        neighborhood.city = `${searchParams.city.capitalize()} - ${searchParams.state.toUpperCase()}`;
        neighborhood.stateId = convertedSearch.state.id;
        neighborhood.countryId = convertedSearch.country.id;

        arrNeighborhoods.push(neighborhood);
      });

    return arrNeighborhoods;
  }

  async callEndpoint(
    searchParams: SearchNeighborhoodsInput
  ): Promise<CheerioAPI> {
    const url = `${this.url}/${searchParams.city}-${searchParams.state}`;
    return this.getDocumentHtml(url);
  }
}
