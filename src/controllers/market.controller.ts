import { MarketDto } from '@/dtos/market.dto';
import { HttpException } from '@/exceptions/HttpException';
import MarketService from '@/services/market.service';
import { validate } from 'class-validator';
import { NextFunction, Request, Response } from 'express';

class MarketController {
  public marketService = new MarketService();

  public tips = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const change = req.query.change as string;
      if (change !== 'tBTCUSD' && change !== 'tETHUSD') throw new HttpException(400, 'Allowed pair tBTCUSD / tETHUSD');

      const result = await this.marketService.bidAsk(change);

      res.status(200).json({ data: result, message: req.query.change });
    } catch (error) {
      next(error);
    }
  };

  public execute = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const data: MarketDto = req.body;
      const newOrder = new MarketDto();
      newOrder.amount = data.amount;
      newOrder.pair = data.pair;
      newOrder.type = data.type;

      const errors = await validate(newOrder);
      if (errors.length > 0) throw new HttpException(400, JSON.stringify(errors));

      const result = await this.marketService.placeOrder(data);

      res.status(200).json({ data: result, message: null });
    } catch (error) {
      next(error);
    }
  };
}

export default MarketController;
