import {
  Column,
  PrimaryGeneratedColumn,
  Entity,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { Publisher } from '../publishers/publisher.entity';
import { IGame } from './game.interface';
import { Discount } from '../discounts/discount.entity';

@Entity()
export class Game implements IGame {

  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @Column()
  public title: string;

  @Column('decimal')
  public price: number;

  @ManyToOne(belongsTo => Publisher)
  @JoinColumn({
    name: 'publisher_id',
  })
  public publisher: Publisher;

  @Column('varchar', {
    array: true,
    length: 20,
  })
  public tags: string[];

  @Column('date')
  public releaseDate: Date;

  @ManyToOne(hasOne => Discount, discount => discount.games)
  @JoinColumn({
    name: 'discount_id',
  })
  public discount: Discount;
}
