import { Module } from '@nestjs/common';
import { GamesModule } from './games/games.module';
import { PublishersModule } from './publishers/publishers.module';
import { DatabaseModule } from './database/database.module';
import { DiscountsModule } from './discounts/discounts.module';
import { CommonsModule } from './commons/commons.module';

@Module({
  imports: [
    CommonsModule,
    DatabaseModule,
    GamesModule,
    DiscountsModule,
    PublishersModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}

