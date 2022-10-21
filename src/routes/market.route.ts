import { Router } from 'express';
import { Routes } from '@interfaces/routes.interface';
import MarketController from '@/controllers/market.controller';

class MarketRoute implements Routes {
  public path = '/market';
  public router = Router();
  public marketController = new MarketController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}/orderbook`, this.marketController.tips);
    this.router.post(`${this.path}/place-order`, this.marketController.execute);
  }
}

export default MarketRoute;
