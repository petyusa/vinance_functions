import { Transaction } from './transaction';

export class Transfer extends Transaction {
  constructor(
    id: string,
    date: any,
    amount: number,
    comment: string,
    from: string,
    fromId: string,
    to: string,
    toId: string,
    category: string
  ) {
    super(id, date, amount, comment);
    this.from = from;
    this.fromId = fromId;
    this.to = to;
    this.toId = toId;
    this.category = category;
  }

  from: string;
  fromId: string;
  to: string;
  toId: string;
  category: string;
}
