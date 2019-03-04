import {
  Length,
  IsNumber,
  IsUUID,
  IsDateString,
} from 'class-validator';
import { IGame } from '../game.interface';

export class CreateGameDto implements IGame {

  @Length(2, 25)
  public title: string;

  @IsNumber()
  public price: number;

  @IsUUID()
  public publisher: string;

  @Length(2, 20, {
    each: true,
  })
  public tags: string[];

  @IsDateString()
  public releaseDate: Date;

}
