import { Discount } from '../../discounts/discount.entity';
import { DiscountAlias } from '../../discounts/discount-alias.enum';

export const discountSeeds: Discount[] = [
  {
    id: '4c78ce2a-ca80-4d9c-b7d2-21e0bc177598',
    alias: DiscountAlias.default,
    percent: 20,
    games: [],
  },
];
