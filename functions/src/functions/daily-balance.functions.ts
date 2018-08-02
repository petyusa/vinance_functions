import { db } from '../index';
import * as utils from './util.functions';
import { Timestamp } from '@google-cloud/firestore';

export const add = function(amount: number, date: Timestamp) {
  let dailyRef: FirebaseFirestore.DocumentReference;

  return db.runTransaction((transaction) => {
    return utils
      .createDailyBalanceIfNotExists(date)
      .then((ref) => {
        dailyRef = ref;
      })
      .then(() => {
        return transaction.get(dailyRef).then((daily) => {
          const newBalance = daily.data().balance + amount;
          return transaction.update(dailyRef, { balance: newBalance });
        });
      });
  });
};

export const substract = function(amount: number, date: Timestamp) {
  let dailyRef: FirebaseFirestore.DocumentReference;

  return db.runTransaction((transaction) => {
    return utils
      .createDailyBalanceIfNotExists(date)
      .then((ref) => {
        dailyRef = ref;
      })
      .then(() => {
        return transaction.get(dailyRef).then((daily) => {
          const newBalance = daily.data().balance - amount;
          return transaction.update(dailyRef, { balance: newBalance });
        });
      });
  });
};
