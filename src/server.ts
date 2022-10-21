import App from '@/app';
import validateEnv from '@utils/validateEnv';
import MarketRoute from './routes/market.route';

validateEnv();

const app = new App([new MarketRoute()]);

app.listen();
