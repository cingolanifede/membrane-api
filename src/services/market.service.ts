// import { HttpException } from '@exceptions/HttpException';

import { tBTCUSD, tETHUSD } from '@/app';
import { MarketDto, PairEnum, TypeEnum } from '@/dtos/market.dto';
import { Book } from '@/interfaces/book.interface';

class MarketService {
  public async bidAsk(data: string) {
    const obj = data === 'tBTCUSD' ? tBTCUSD.getBook() : tETHUSD.getBook();

    const min = Object.keys(obj.asks)[0];
    const max = Object.keys(obj.bids)[Object.keys(obj.bids).length - 1];
    return [obj.bids[max], obj.asks[min]];
  }

  public async placeOrder(data: MarketDto): Promise<any> {
    const obj = data.pair === PairEnum.tBTCUSD ? tBTCUSD.getBook() : tETHUSD.getBook();

    return data.type === TypeEnum.buy ? this.process(obj, 'bids', data.amount) : this.process(obj, 'asks', data.amount);
  }

  private process(obj: Book, side: string, amount: number) {
    const data = Object.keys(obj[side]);
    const reversedKeys = side === 'bids' ? data.reverse() : data;
    let result = null;
    let delta = 0;

    for (const key of reversedKeys) {
      const el = obj[side][key];
      delta = (!delta ? amount : delta) - el.cnt;
      if (delta <= el.cnt) {
        result = el;
        break;
      }
    }
    return result;
  }
}

export default MarketService;
