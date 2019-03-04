import {
  Injectable,
} from '@nestjs/common';
import { DiscountAlias } from './discount-alias.enum';
import { Discount } from './discount.entity';
import { getRepository } from 'typeorm';

@Injectable()
export class DiscountService {
  /**
   * Get Discount by its alias, throw error if not found
   * @param {DiscountAlias} alias
   */
  public async getDiscountByAlias(alias: DiscountAlias): Promise<Discount> {
    return getRepository(Discount).findOneOrFail({ alias });
  }
}
