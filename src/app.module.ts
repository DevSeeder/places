import { Module } from '@nestjs/common';
import { BairrosModule } from './bairros/bairros.module';

@Module({
  imports: [BairrosModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
