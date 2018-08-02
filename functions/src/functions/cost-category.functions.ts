import { db } from '../index';
import * as utils from './util.functions';
import * as Constants from '../constants';

export const add = function(catTo: string, amount: number) {
  const catRef = db.collection(Constants.CostCategoriesCollection).doc(catTo);

  return db.runTransaction((transaction) => {
    return transaction.get(catRef).then((catDoc) => {
      const newBalance = catDoc.data().balance + amount;
      return transaction.update(catRef, { balance: newBalance });
    });
  });
};

export const substract = function(catFrom: string, amount: number) {
  const catRef = db.collection(Constants.CostCategoriesCollection).doc(catFrom);

  return db.runTransaction((transaction) => {
    return transaction.get(catRef).then((catDoc) => {
      const newBalance = catDoc.data().balance - amount;
      return transaction.update(catRef, { balance: newBalance });
    });
  });
};
