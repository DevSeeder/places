import { Controller, Get } from '@nestjs/common';
import { BairrosService } from './bairros.service';

@Controller()
export class BairrosController {
  constructor(private readonly appService: BairrosService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
