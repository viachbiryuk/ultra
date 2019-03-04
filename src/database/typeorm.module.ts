import {
  Module,
} from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CONF } from '../conf';
import { resolve } from 'path';
import { CustomNamingStrategy } from './custom-naming.strategy';

const typeOrmModule = TypeOrmModule.forRoot({
  type: 'postgres',
  host: CONF.DB_HOST,
  port: 5432,
  username: CONF.DB_USER,
  password: CONF.DB_PWD,
  database: CONF.DB_NAME,
  entities: [resolve(__dirname, '../../') + '/**/*.entity{.ts,.js}'],
  synchronize: true,
  namingStrategy: new CustomNamingStrategy(),
  logging: false,
});

@Module({
  imports: [
    typeOrmModule,
  ],
  exports: [
    typeOrmModule,
  ],
})
export class TypeormModule {}
