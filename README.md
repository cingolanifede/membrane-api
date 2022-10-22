# membrane-api
public API REST that retrieves market information for trading

To run the api

1- Install all dependencies with npm i

2- Set .env file

3- npm run dev (will run api in port 3000 by default)

To access front views, in the browser go to http://localhost:3000

Swagger file in route "/api-docs"

- Available endpoint:
  - Get order book: GET /market/orderbook?change={tBTCUSD/tETHUSD}
  - Place order: POST /market/place-order?limit={12} (limit optional parameter)
  
    required  body: 
    `{
      "type": {"buy/"sell"},
      "pair": {tBTCUSD/tETHUSD},
      "amount": 20
    }`   

- Unit testing (WIP)
