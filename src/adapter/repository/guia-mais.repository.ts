import { Injectable } from '@nestjs/common';
import { BairroByCity } from 'src/domain/model/bairros-by-city.model';
import { PuppeteerRepository } from 'src/domain/repository/puppeteer.repository';

@Injectable()
export class GuiaMaisRepository extends PuppeteerRepository {
  async getBairrosByCity(country: string, state: string, city: string) {
    const url = `https://www.guiamais.com.br/bairros/${city}-${state}`;
    const $ = await this.getDocumentHtml(url);

    const arrBairros = [];
    $('.cities.centerContent')
      .find('a')
      .each(function () {
        const bairro = new BairroByCity();
        bairro.name = $(this).text();
        bairro.city = city.capitalize() + '-' + state.toUpperCase();
        arrBairros.push(bairro);
      });

    return arrBairros;
  }
}
