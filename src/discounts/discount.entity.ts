import {
  Column,
  PrimaryGeneratedColumn,
  Entity,
  OneToMany,
} from 'typeorm';
import { DiscountAlias } from './discount-alias.enum';
import { Game } from '../games/game.entity';

@Entity()
export class Discount {
  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @Column({
    enum: DiscountAlias,
  })
  public alias: DiscountAlias;

  @Column('decimal')
  public percent: number;

  @OneToMany(hasMany => Game, game => game.discount)
  public games: Game[];
}
