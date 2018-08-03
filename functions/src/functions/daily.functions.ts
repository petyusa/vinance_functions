import { db } from '../index';
import * as utils from './util.functions';
import * as Constants from '../constants';

export const add = function(amount: number, date) {
  return db.runTransaction((transaction) => {
    return utils.getOrCreateDailyValue(date).then((dailyRef) => {
      return transaction.get(dailyRef).then((daily) => {
        const newBalance = daily.data().balance + amount;
        return transaction.update(dailyRef, { balance: newBalance });
      });
    });
  });
};

export const substract = function(amount: number, date) {
  return db.runTransaction((transaction) => {
    return utils.getOrCreateDailyValue(date).then((dailyRef) => {
      return transaction.get(dailyRef).then((daily) => {
        const newBalance = daily.data().balance - amount;
        return transaction.update(dailyRef, { balance: newBalance });
      });
    });
  });
};

export const createDailyValues = function() {
  const date = new Date();
  const dateString = utils.getDateString(date);
  const dateAfter = new Date(date.getTime() + 86400000);
  const dateAfterString = utils.getDateString(dateAfter);

  db.collection(Constants.DailyValues)
    .doc(dateAfterString)
    .get()
    .then((doc) => {
      if (!doc.exists) {
        db.collection(Constants.DailyValues)
          .doc(dateString)
          .get()
          .then((today) => {
            db.collection(Constants.DailyValues)
              .doc(dateAfterString)
              .set({ balance: today.data().balance });
          });
      }
    });
};
