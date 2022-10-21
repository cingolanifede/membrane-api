import { IsEnum, IsNotEmpty, IsNumber } from 'class-validator';

export enum TypeEnum {
  buy = 'buy',
  sell = 'sell',
}

export enum PairEnum {
  tBTCUSD = 'tBTCUSD',
  tETHUSD = 'tETHUSD',
}

export class MarketDto {
  @IsEnum(PairEnum)
  @IsNotEmpty()
  pair: PairEnum;

  @IsEnum(TypeEnum)
  @IsNotEmpty()
  type: TypeEnum;

  @IsNumber()
  @IsNotEmpty()
  amount: number;
}
