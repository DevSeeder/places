import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CheerioAPI } from 'cheerio';
import { IPuppeteerRepository } from '../../../../domain/interface/puppeteer/repository/puppeteer-repository.interface';
import { SearchRegionsDTO } from '../../../../domain/model/search/regions/search-regions-dto.model';
import { RegionsByCountry } from '../../../../domain/model/regions/regions-by-country.model';
import { Country } from '../../../../domain/schemas/country.schema';
import { PuppeteerPlacesRepository } from '../../../../domain/repository/puppeteer/neighborhood/puppeteer-places.repository';
import { PuppeteerService } from '../../../../domain/service/puppeteer/puppeteer.service';

@Injectable()
export class CityPopulationRepository
  extends PuppeteerPlacesRepository<RegionsByCountry, SearchRegionsDTO, Country>
  implements IPuppeteerRepository<RegionsByCountry, SearchRegionsDTO, Country>
{
  constructor(
    protected configService: ConfigService,
    protected puppeteerService: PuppeteerService
  ) {
    super(
      configService.get<string>('repository.regions.citypopulation.url'),
      puppeteerService,
      'Regions'
    );
  }

  async getRegionsByCountry(
    searchParams: SearchRegionsDTO,
    convertedSearch: Country
  ) {
    const $ = await this.callEndpoint(searchParams, convertedSearch);
    return this.buildElementsFromDocument(searchParams, convertedSearch, $);
  }

  async buildElementsFromDocument(
    searchParams: SearchRegionsDTO,
    convertedSearch: Country,
    $: CheerioAPI
  ): Promise<RegionsByCountry[]> {
    const arr = [];
    const htmlElements = $('#reg_div').find('li a');
    for (let i = 0; i < htmlElements.length; i++) {
      const element = htmlElements.eq(i);

      htmlElements.eq(i).find('svg').remove();

      const region = new RegionsByCountry();
      region.name = element.text();

      const urlRegion = this.getBaseUrl(searchParams, convertedSearch);
      region.states = await this.goToRegionAndGetStates(
        `${urlRegion}/${element.prop('href')}`
      );

      arr.push(region);
    }

    return arr;
  }

  async callEndpoint(
    _searchParams: SearchRegionsDTO,
    convertedSearch: Country
  ): Promise<CheerioAPI> {
    return this.getDocumentHtml(
      this.getBaseUrl(_searchParams, convertedSearch)
    );
  }

  private getBaseUrl(
    _searchParams: SearchRegionsDTO,
    convertedSearch: Country
  ): string {
    return `${this.url}/en/${convertedSearch.name.toLocaleLowerCase()}`;
  }

  async goToRegionAndGetStates(url: string): Promise<Array<string>> {
    const arr = [];
    const $ = await this.getDocumentHtml(url);
    $('.rstatus:contains(State)')
      .parent()
      .find('.rname')
      .each(function () {
        arr.push($(this).text());
      });

    return arr;
  }
}
