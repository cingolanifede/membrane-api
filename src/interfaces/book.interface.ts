export interface Book {
  psnap?: ICRC;
  bids?: IBookDetail;
  asks?: IBookDetail;
  mcnt?: number;
  side?: string;
}

export interface IBookDetail {
  price: number;
  cnt: number;
  amount: number;
  timestamp?: Date;
}

export interface ICRC {
  bids: string[];
  asks: string[];
}
