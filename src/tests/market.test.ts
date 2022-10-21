import { Request, Response } from 'express';
import MarketController from '../controllers/market.controller';
import MarketService from '../services/market.service';

jest.mock('../services/market.service');

//TODO: finish testings & fix mocking websockets impleentation
afterAll(async () => {
  await new Promise<void>(resolve => setTimeout(() => resolve(), 500));
});

describe('Testing OrderBook', () => {
  describe('[GET] /orderbook?change=tBTCUSD', () => {
    it('response statusCode 200', async () => {
      const mockBidAsk = {
        data: [
          {
            price: 19077,
            cnt: 1,
            amount: 0.34728998,
            side: 'bids',
          },
          {
            price: 19054,
            cnt: 1,
            amount: 0.4764614,
            side: 'asks',
          },
        ],
        message: 'tBTCUSD',
      };

      (MarketService.bidAsk as jest.MockedFunction<any>).mockResolvedValueOnce(mockBidAsk);

      const mNext = jest.fn();
      const mReq = {
        query: { change: 'tBTCUSD' },
      } as unknown as Request;
      const mRes = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as unknown as Response;

      const eController = new MarketController();
      await eController.tips(mReq, mRes, mNext);
      expect(MarketService.bidAsk).toHaveBeenCalledTimes(1);
      expect(mRes.status).toBeCalledWith(200);
    });
    it('response should fail with 400 when no pair', async () => {
      const mockBidAsk = {
        data: [
          {
            price: 19077,
            cnt: 1,
            amount: 0.34728998,
            side: 'bids',
          },
          {
            price: 19054,
            cnt: 1,
            amount: 0.4764614,
            side: 'asks',
          },
        ],
        message: 'tBTCUSD',
      };

      (MarketService.bidAsk as jest.MockedFunction<any>).mockResolvedValueOnce(mockBidAsk);

      const mNext = jest.fn();
      const mReq = {
        query: { change: '' },
      } as unknown as Request;
      const mRes = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as unknown as Response;

      try {
        const eController = new MarketController();
        await eController.tips(mReq, mRes, mNext);
      } catch (error) {
        expect(error).toEqual({ message: 'Allowed pair tBTCUSD / tETHUSD' });
      }
    });
  });

  describe('[POST] /place-order', () => {
    it('response statusCode 200 when placing order', async () => {
      const mockOrder = {
        data: {
          price: 19161,
          cnt: 6,
          amount: 3.25226187,
          side: 'bids',
        },
        message: null,
      };

      (MarketService.placeOrder as jest.MockedFunction<any>).mockResolvedValueOnce(mockOrder);

      const mNext = jest.fn();
      const mReq = {
        query: { change: 'tBTCUSD' },
      } as unknown as Request;
      const mRes = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as unknown as Response;

      const eController = new MarketController();
      await eController.execute(mReq, mRes, mNext);
      expect(MarketService.placeOrder).toHaveBeenCalledTimes(1);
      expect(mRes.status).toBeCalledWith(200);
    });
  });
});
