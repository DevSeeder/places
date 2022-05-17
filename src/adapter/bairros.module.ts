import { Module } from '@nestjs/common';
import { BairrosController } from './controller/bairros.controller';
import { BairrosService } from './service/bairros.service';

@Module({
  imports: [],
  controllers: [BairrosController],
  providers: [BairrosService]
})
export class BairrosModule {}
