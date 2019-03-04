import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GamesController } from './games.controller';
import { GamesService } from './games.service';
import { Game } from './game.entity';
import { DiscountsModule } from '../discounts/discounts.module';
import { GamesInterceptor } from './games.interceptor';

@Module({
  imports: [
    DiscountsModule,
    TypeOrmModule.forFeature([
      Game,
    ]),
  ],
  providers: [
    GamesService,
    GamesInterceptor,
  ],
  controllers: [
    GamesController,
  ],
})
export class GamesModule {}
