import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Discount } from './discount.entity';
import { DiscountService } from './discount.service';

const sharable = [
  DiscountService,
];

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Discount,
    ]),
  ],
  providers: [
    ...sharable,
  ],
  exports: [
    ...sharable,
  ],
})
export class DiscountsModule {}
