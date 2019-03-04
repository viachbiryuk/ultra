import { Publisher } from '../publishers/publisher.entity';
import { Discount } from '../discounts/discount.entity';

export interface IGame {
  id?: string;
  title: string;
  price: number;
  tags: string[];
  publisher: string | Publisher;
  releaseDate: Date;
  discount?: Discount;
  salePrice?: number;
}
