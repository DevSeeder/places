import { Injectable } from '@nestjs/common';
import { NeighborhoodsByCity } from 'src/domain/model/neighborhoods-by-city.model';
import { PuppeteerRepository } from 'src/domain/repository/puppeteer.repository';

@Injectable()
export class GuiaMaisRepository extends PuppeteerRepository {
  async getNeighborhoodsByCity(country: string, state: string, city: string) {
    const url = `https://www.guiamais.com.br/bairros/${city}-${state}`;
    const $ = await this.getDocumentHtml(url);

    const arrNeighborhoods = [];
    $('.cities.centerContent')
      .find('a')
      .each(function () {
        const neighborhood = new NeighborhoodsByCity();
        neighborhood.name = $(this).text();
        neighborhood.city = city.capitalize() + '-' + state.toUpperCase();
        arrNeighborhoods.push(neighborhood);
      });

    return arrNeighborhoods;
  }
}
