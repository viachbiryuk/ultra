import {
  Column,
  PrimaryGeneratedColumn,
  Entity,
} from 'typeorm';

@Entity()
export class Publisher {

  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @Column()
  public name: string;

  @Column()
  public siret: number;

  @Column()
  public phone: string;

}
