import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
  UseInterceptors,
  UsePipes,
} from '@nestjs/common';
import { GamesService } from './games.service';
import { CreateGameDto } from './dto/create-game.dto';
import { UpdateGameDto } from './dto/update-game.dto';
import { Game } from './game.entity';
import { DeleteResult } from 'typeorm';
import { Publisher } from '../publishers/publisher.entity';
import { ActualizeResultDto } from './dto/actualize-result.dto';
import { GamesInterceptor } from './games.interceptor';
import { ValidationPipe } from '../commons/validation.pipe';

@Controller('games')
export class GamesController {

  constructor(
    private readonly gamesService: GamesService,
  ) {}

  /**
   * Find all games
   * @returns Promise<Game[]>
   */
  @Get()
  @UseInterceptors(GamesInterceptor)
  public async findGames(): Promise<Game[]> {
    return this.gamesService.findMany();
  }

  /**
   * Deletes games that have the releaseDate older than 18 months
   * Adds the default discount to games, that have the releaseDate between 18 and 12 months old
   * @returns Promise<ActualizeResultDto>
   */
  @Post('actualize')
  public async actualizeGames(): Promise<ActualizeResultDto> {
    // This endpoint should be above findGame
    // because of first-match-wins strategy
    // (to avoid conflict with GET */:id)
    const deletedPromise = this.gamesService.deleteOutdated();
    const updatedPromise = this.gamesService.setDiscountForObsolescent();
    return Promise.all([deletedPromise, updatedPromise]).then(result => {
      return {
        deleted: result[0],
        updated: result[1],
      };
    });
  }

  /**
   * Find game by UUID, throw 404 if not found
   * @param {string} id - game UUID
   * @returns Promise<Game>
   */
  @Get(':id')
  @UseInterceptors(GamesInterceptor)
  public async findGame(@Param('id') id: string): Promise<Game> {
    return this.gamesService.getOne(id, {
      relations: ['discount'],
    });
  }

  /**
   * Find game by UUID and return its publisher, throw 404 if not found
   * @param {string} id - game UUID
   * @returns Promise<Publisher>
   */
  @Get(':id/publisher')
  public async findGamePublisher(@Param('id') id: string): Promise<Publisher> {
    const game = await this.gamesService.getOne(id, {
      relations: ['publisher'],
    });
    return game.publisher;
  }

  /**
   * Create game with a given payload
   * @param {Game} body - game data
   * @returns Promise<Game>
   */
  @Post()
  @UsePipes(new ValidationPipe())
  public async createGame(@Body() body: CreateGameDto): Promise<Game> {
    return this.gamesService.createOne(body);
  }

  /**
   * Find game by UUID and update it with a given payload, throw 404 if not found
   * @param {string} id - game UUID
   * @param {Game} body - game payload (data)
   * @returns Promise<Game>
   */
  @Patch(':id')
  @UsePipes(new ValidationPipe())
  public async updateGame(@Param('id') id, @Body() body: UpdateGameDto): Promise<Game> {
    return this.gamesService.updateOne(id, body);
  }

  /**
   * Find a game by UUID and delete it, throw 404 if not found
   * @param {string} id - game UUID
   * @returns Promise<DeleteResult>
   */
  @Delete(':id')
  @HttpCode(204)
  public async deleteGame(@Param('id') id: string): Promise<DeleteResult> {
    return this.gamesService.deleteOne(id);
  }
}
