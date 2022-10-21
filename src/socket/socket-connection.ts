import WebSocket from 'ws';
import { WS_SERVER } from '@config';
import { Book } from '@/interfaces/book.interface';

export class WebSocketClient {
  private client: WebSocket;
  private orderBook: Book;
  private connected = false;
  private connecting = false;

  constructor(pair: string) {
    this.client = new WebSocket(WS_SERVER);
    if (pair === '') throw new Error('Pair cant be empty tBTCUSD or tETHUSD');

    this.handleMessage();
    this.handlerClose();
    this.openConnection(pair);
  }

  openConnection(pair: string) {
    this.client.on('open', () => {
      this.connecting = false;
      this.connected = true;
      this.orderBook = {
        bids: { price: 0, amount: 0, cnt: 0 },
        asks: { price: 0, amount: 0, cnt: 0 },
        mcnt: 0,
        side: '',
      };
      this.client.send(
        JSON.stringify({
          event: 'subscribe',
          channel: 'book',
          symbol: pair,
        }),
      );
    });
  }

  handlerClose() {
    this.client.on('close', () => {
      this.connecting = false;
      this.connected = false;
    });
  }

  handleMessage() {
    this.client.on('message', (data: any) => {
      try {
        const msg = JSON.parse(data);
        if (msg.event) return;
        if (msg[1] === 'hb') {
          return;
        } else if (msg[1] === 'cs') {
          return;
        }

        if (this.orderBook.mcnt === 0) {
          msg[1].forEach((pp: any) => {
            const side = pp.amount >= 0 ? 'bids' : 'asks';
            pp = { price: pp[0], cnt: pp[1], amount: pp[2], side };
            pp.amount = Math.abs(pp.amount);
            this.orderBook[side][pp.price] = pp;
          });

          //remove initial values
          ['bids', 'asks'].forEach((side: string) => {
            delete this.orderBook[side].price;
            delete this.orderBook[side].amount;
            delete this.orderBook[side].cnt;
          });
        } else {
          const pp = { price: msg[1][0], cnt: msg[1][1], amount: msg[1][2], side: '' };
          if (!pp.cnt) {
            if (pp.amount > 0 && this.orderBook['bids'][pp.price]) {
              delete this.orderBook['bids'][pp.price];
            } else if (pp.amount < 0 && this.orderBook['asks'][pp.price]) {
              delete this.orderBook['asks'][pp.price];
            }
          } else {
            const side = pp.amount >= 0 ? 'bids' : 'asks';
            pp.amount = Math.abs(pp.amount);
            pp.side = side;
            this.orderBook[side][pp.price] = pp;
          }
        }
        this.orderBook.mcnt++;
      } catch (error) {
        console.log('error :>> ', error);
      }
    });
  }

  getBook() {
    return this.orderBook;
  }
}
