import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CheerioAPI } from 'cheerio';
import { InjectPage } from 'nest-puppeteer';
import { IPuppeteerNeighborhoodRepository } from '../../../domain/interfaces/puppeteer/repository/puppeteer-neighborhood-repository.interface';
import { PuppeteerNeighborhoodRepository } from '../../../domain/repository/puppeteer/neighborhood/puppeteer-neighborhood.repository';
import { NeighborhoodsByCity } from '../../../domain/model/neighborhoods-by-city.model';
import { SearchNeighborhoods } from '../../../domain/model/search/search-neighborhoods.model';
import { Page } from '../../../domain/interfaces/puppeteer/page.interface';

@Injectable()
export class GuiaMaisRepository
  extends PuppeteerNeighborhoodRepository
  implements IPuppeteerNeighborhoodRepository
{
  constructor(
    protected configService: ConfigService,
    @InjectPage() protected readonly page: Page
  ) {
    super(
      configService.get<string>('repository.neighborhoods.guia-mais.url'),
      page
    );
  }

  buildElementFromDocument(searchParams, $: CheerioAPI): NeighborhoodsByCity[] {
    const arrNeighborhoods = [];
    $('.cities.centerContent')
      .find('a')
      .each(function () {
        const neighborhood = new NeighborhoodsByCity();

        neighborhood.name = $(this).text();
        neighborhood.city = `${searchParams.city.capitalize()} - ${searchParams.state.toUpperCase()}`;

        arrNeighborhoods.push(neighborhood);
      });

    return arrNeighborhoods;
  }

  async getEndpoint(searchParams: SearchNeighborhoods): Promise<CheerioAPI> {
    const url = `${this.url}/${searchParams.city}-${searchParams.state}`;
    return this.getDocumentHtml(url);
  }
}
