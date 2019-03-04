import {
  Injectable,
  NotFoundException,
  OnModuleInit,
} from '@nestjs/common';
import {
  DeleteResult,
  FindManyOptions,
  FindOneOptions,
  getConnection,
  getRepository,
  LessThanOrEqual,
} from 'typeorm';
import { Game } from './game.entity';
import { IGame } from './game.interface';
import * as moment from 'moment';
import { DiscountService } from '../discounts/discount.service';
import { DiscountAlias } from '../discounts/discount-alias.enum';

@Injectable()
export class GamesService implements OnModuleInit {

  constructor(
    private readonly discountService: DiscountService,
  ) {}

  private gameProps: string[];

  public async onModuleInit() {
    this.gameProps = await this.getEntityProps();
  }

  /**
   * Get entity properties as array of strings
   * @returns Promise<string[]>
   */
  private async getEntityProps(): Promise<string[]> {
    return getConnection()
      .getMetadata(Game)
      .ownColumns
      .map(column => column.propertyName);
  }

  /**
   * Create game, based on payload
   * @param {Game} payload - game data
   * @returns Promise<Game>
   */
  public createOne(payload: IGame): Promise<Game> {
    return getRepository(Game).save(payload as Game);
  }

  /**
   * Find one game by id
   * @param {string} id - UUID of the game
   * @param {FindOneOptions} [opts] - options to extend the search
   * @returns Promise<Game>
   */
  public findOne(id: string, opts?: FindOneOptions): Promise<Game> {
    const query: FindOneOptions = {
      where: { id },
      ...opts,
    };
    return getRepository(Game).findOne(query);
  }

  /**
   * Get one game by id, throw 404 if not found
   * @param {string} id - UUID of the game
   * @param {FindOneOptions} [opts] - options to extend the search
   * @returns Promise<Game>
   */
  public async getOne(id: string, opts?: FindOneOptions): Promise<Game> {
    const found = await this.findOne(id, opts);
    if (!found) {
      throw new NotFoundException();
    }
    return found;
  }

  /**
   * Find many games
   * @param {FindManyOptions} [opts] - options to extend the search
   * @returns Promise<Game[]>
   */
  public async findMany(): Promise<Game[]> {
    return getRepository(Game)
      .createQueryBuilder('game')
      .leftJoinAndSelect('game.discount', 'discount', 'game.discount = discount.id')
      .getMany();
  }

  /**
   * Delete one game by id, throws 404 if not found
   * @param {string} id - UUID of the game
   * @returns Promise<DeleteResult>
   */
  public async deleteOne(id: string): Promise<DeleteResult> {
    // needed to make sure that target game exists
    // throws 404, otherwise
    await this.getOne(id);
    return getRepository(Game).delete({ id });
  }

  /**
   * Update one game by id, throws 404 if not found
   * @param {string} id - UUID of the game
   * @param {Game} payload - game data
   * @returns Promise<Game>
   */
  public async updateOne(id: string, payload: IGame): Promise<Game> {
    const game = await this.getOne(id);
    const updatedGame = {...game, ...payload};
    await getRepository(Game).update({ id }, updatedGame as Game);
    return updatedGame as Game;
  }

  /**
   * Delete outdated (releaseDate is older than 18 months) games
   * @returns Promise<number> - number of affected rows
   */
  public async deleteOutdated(): Promise<number> {
    const ago18months = moment().subtract(18, 'months').toDate();
    const deleteResult = await getRepository(Game).delete({
      releaseDate: LessThanOrEqual(ago18months),
    });
    return deleteResult.affected; // affected rows
  }

  /**
   * Create a default discount for obsolete games (release date is between 18 and 12 months ago)
   * @returns Promise<number> - number of affected rows
   */
  public async setDiscountForObsolescent(): Promise<number> {
    const discount = await this.discountService.getDiscountByAlias(DiscountAlias.default);
    const ago18months = moment().subtract(18, 'months').toDate();
    const ago12months = moment().subtract(12, 'months').toDate();
    const updateResult = await getRepository(Game)
      .createQueryBuilder('game')
      .update(Game, { discount })
      .where('release_date BETWEEN :from AND :to', {
        from: ago18months,
        to: ago12months,
      })
      .andWhere('discount IS NULL')
      .returning(this.gameProps[0]) // needed to count affected rows
      .execute();
    return updateResult.raw.length; // rows affected
  }


}
