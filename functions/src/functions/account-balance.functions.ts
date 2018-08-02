import { db } from '../index';
import * as Constants from '../constants';

export const add = function(accTo: string, amount: number) {
  const accRef = db.collection(Constants.AccountCollection).doc(accTo);

  return db.runTransaction((transaction) => {
    return transaction.get(accRef).then((accDoc) => {
      const newBalance = accDoc.data().balance + amount;
      return transaction.update(accRef, { balance: newBalance });
    });
  });
};

export const substract = function(accFrom: string, amount: number) {
  const accRef = db.collection(Constants.AccountCollection).doc(accFrom);

  return db.runTransaction((transaction) => {
    return transaction.get(accRef).then((accDoc) => {
      const newBalance = accDoc.data().balance - amount;
      return transaction.update(accRef, { balance: newBalance });
    });
  });
};
