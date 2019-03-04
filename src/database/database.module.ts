import {
  Module,
  OnModuleInit,
} from '@nestjs/common';
import { DatabaseSeeder } from './database.seeder';
import { TypeormModule } from './typeorm.module';

@Module({
  imports: [
    TypeormModule,
  ],
  providers: [
    DatabaseSeeder,
  ],
})
export class DatabaseModule implements OnModuleInit {

  constructor(
    private readonly seeder: DatabaseSeeder,
  ) {}

  public async onModuleInit() {
    await this.seeder.seedPublishers();
    await this.seeder.seedDiscounts();
  }

}
