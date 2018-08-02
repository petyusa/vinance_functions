import { db } from '../index';
import * as utils from './util.functions';
import * as Constants from '../constants';
import { Timestamp } from '@google-cloud/firestore';

export const add = function(amount: number, date: Timestamp) {
  const dateString = utils.getDateString(date);
  let dailyRef: FirebaseFirestore.DocumentReference;

  return db.runTransaction((transaction) => {
    return utils
      .createDailyBalanceIfNotExists(dateString)
      .then(() => {
        dailyRef = db.collection(Constants.DailyBalance).doc(dateString);
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
  const dateString = utils.getDateString(date);
  let dailyRef: FirebaseFirestore.DocumentReference;

  return db.runTransaction((transaction) => {
    return utils
      .createDailyBalanceIfNotExists(dateString)
      .then(() => {
        dailyRef = db.collection(Constants.DailyBalance).doc(dateString);
      })
      .then(() => {
        return transaction.get(dailyRef).then((daily) => {
          const newBalance = daily.data().balance - amount;
          return transaction.update(dailyRef, { balance: newBalance });
        });
      });
  });
};