import { Module } from '@nestjs/common';
import { BairrosModule } from './adapter/bairros.module';

@Module({
  imports: [BairrosModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
