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

  public async placeOrder(data: MarketDto, limit?: number): Promise<any> {
    const obj = data.pair === PairEnum.tBTCUSD ? tBTCUSD.getBook() : tETHUSD.getBook();

    return data.type === TypeEnum.buy ? this.process(obj, 'bids', data.amount, limit) : this.process(obj, 'asks', data.amount, limit);
  }

  private process(obj: Book, side: string, amount: number, limit: number) {
    // console.log('obj :>> ', obj);
    const data = Object.keys(obj[side]);
    let reversedKeys = side === 'bids' ? data.reverse() : data;
    // filter object
    if (limit > 0) {
      // const filtered = reversedKeys
      //   .filter(key => Number(key) > limit)
      //   .reduce((o, key) => {
      //     o[key] = obj[side][key];
      //     return o;
      //   }, {});

      reversedKeys = reversedKeys.filter(k => {
        return Number(k) < limit;
      });
    }
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
