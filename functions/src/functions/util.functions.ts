import { db } from '../index';
import * as Constants from '../constants';
import { Timestamp } from '@google-cloud/firestore';

export const createDailyBalanceIfNotExists = function(today: string) {
  return db
    .collection(Constants.DailyBalance)
    .doc(today)
    .get()
    .then((doc) => {
      if (!doc.exists) {
        return db
          .collection(Constants.DailyBalance)
          .doc(today)
          .set({
            balance: 0,
            date: new Date()
          });
      }
      return null;
    });
};

export const getDateString = function(timeStamp: Timestamp) {
  return new Date(timeStamp.toDate()).toISOString().split('T')[0];
};
