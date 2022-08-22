import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CheerioAPI } from 'cheerio';
import { InjectPage } from 'nest-puppeteer';
import { NeighborhoodByCity } from '../../../../domain/model/neighborhoods/neighborhood-by-city.model';
import { SearchNeighborhoodsDTO } from '../../../../domain/model/search/neighborhoods/search-neighborhoods-dto.model';
import { PuppeteerPlacesRepository } from '../../../../domain/repository/puppeteer/neighborhood/puppeteer-places.repository';
import { Page } from '../../../../domain/interface/puppeteer/page.interface';
import { EnumTranslations } from '../../../../domain/enumerators/enum-translations.enumerator';
import { ValidOutputSearchByCity } from '../../../../domain/interface/valid-output-search/valid-outpu-search.interface';
import { PuppeteerService } from '../../../../domain/service/puppeteer/puppeteer.service';

@Injectable()
export class GuiaMaisRepository extends PuppeteerPlacesRepository<
  NeighborhoodByCity,
  SearchNeighborhoodsDTO,
  ValidOutputSearchByCity
> {
  language = EnumTranslations.BR;
  constructor(
    protected configService: ConfigService,
    protected puppeteerService: PuppeteerService
  ) {
    super(
      configService.get<string>('repository.neighborhoods.guia-mais.url'),
      puppeteerService,
      'Neighborhoods'
    );
  }

  async buildElementsFromDocument(
    searchParams: SearchNeighborhoodsDTO,
    convertedSearch: ValidOutputSearchByCity,
    $: CheerioAPI
  ): Promise<NeighborhoodByCity[]> {
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
    searchParams: SearchNeighborhoodsDTO
  ): Promise<CheerioAPI> {
    const city = searchParams.city.trim().replaceAll(' ', '-');
    const url = `${this.url}/${city}-${searchParams.state}`;
    return this.getDocumentHtml(url);
  }
}
