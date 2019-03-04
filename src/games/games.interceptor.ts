import { Injectable, NestInterceptor, ExecutionContext } from '@nestjs/common';
import { Observable } from 'rxjs';
import {
  map,
} from 'rxjs/operators';
import { Discount } from '../discounts/discount.entity';
import { IGame } from './game.interface';
import { Game } from './game.entity';

@Injectable()
export class GamesInterceptor implements NestInterceptor {

  public intercept(
    context: ExecutionContext,
    call$: Observable<any>,
  ): Observable<IGame | IGame[]> {
    return call$.pipe(map(data => {
      if (data.length > 0) {
        return data.map(d => this.transformGame(d));
      } else if (Object.keys(data).length > 0) {
        return this.transformGame(data);
      } else {
        return data;
      }
    }));
  }

  private transformGame(data: IGame): IGame {
    const game = {...data};
    game.price = parseFloat(data.price as any);
    game.salePrice = null;

    if (data.discount) {
      game.salePrice = this.calculateSalePrice(game.price, data.discount);
    }
    return game;
  }

  private calculateSalePrice(price: number, discount: Discount): number {
    const discountPercent: number = discount.percent;
    const discountFactor: number = (100 - discountPercent) / 100;
    return parseFloat((price * discountFactor).toFixed(2));
  }

}
