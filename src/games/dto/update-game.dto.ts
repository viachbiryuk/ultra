import {
  Length,
  IsNumber,
  IsUUID,
  IsDateString,
  IsOptional,
} from 'class-validator';
import { IGame } from '../game.interface';

export class UpdateGameDto implements IGame {

  @IsOptional()
  @Length(2, 25)
  public title: string;

  @IsOptional()
  @IsNumber()
  public price: number;

  @IsOptional()
  @IsUUID()
  public publisher: string;

  @IsOptional()
  @Length(2, 20, {
    each: true,
  })
  public tags: string[];

  @IsOptional()
  @IsDateString()
  public releaseDate: Date;

}
