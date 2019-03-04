import {
  getConnection,
  InsertResult,
  ObjectType,
} from 'typeorm';

import { Publisher } from '../publishers/publisher.entity';
import { publisherSeeds } from './seeds/publisher.seeds';
import { Injectable } from '@nestjs/common';
import { Discount } from '../discounts/discount.entity';
import { discountSeeds } from './seeds/discount.seeds';

@Injectable()
export class DatabaseSeeder {

  /**
   * Populate publishers table with data
   * @returns Promise<InsertResult>
   */
  public async seedPublishers(): Promise<InsertResult> {
    return this.seed(Publisher, publisherSeeds);
  }

  /**
   * Populate discounts table with data
   * @returns Promise<InsertResult>
   */
  public async seedDiscounts(): Promise<InsertResult> {
    return this.seed(Discount, discountSeeds);
  }

  /**
   * Populate a given table with a given data
   * @returns Promise<InsertResult>
   */
  private async seed<T>(entity: ObjectType<T>, seeds: T[]): Promise<InsertResult> {
    return getConnection()
      .createQueryBuilder()
      .insert()
      .into(entity)
      .values(seeds)
      .onConflict(`("id") DO NOTHING`)
      .execute();
  }

}
