import { db } from '../index';
import * as Constants from '../constants';
import { Timestamp } from '@google-cloud/firestore';

export const createDailyBalanceIfNotExists = function(date: Timestamp) {
  const dateString = getDateString(date);
  const dateBefore = new Date(
    new Date(date.toDate()).getMilliseconds() - 86400000
  );
  const dateBeforeString = getDateString(dateBefore);

  return db
    .collection(Constants.DailyBalance)
    .doc(dateString)
    .get()
    .then((doc) => {
      if (!doc.exists) {
        db.collection(Constants.DailyBalance)
          .doc(dateBeforeString)
          .get()
          .then((before) => {
            return before.data().amount;
          })
          .then((balanceBefore) => {
            return db
              .collection(Constants.DailyBalance)
              .doc(dateString)
              .set({
                balance: balanceBefore,
                date: new Date()
              })
              .then(() => {
                return db.collection(Constants.DailyBalance).doc(dateString);
              });
          });
      }
      return db.collection(Constants.DailyBalance).doc(dateString);
    });
};

export const getDateString = function<T>(date: T) {
  if (date instanceof Timestamp) {
    return new Date(date.toDate()).toISOString().split('T')[0];
  } else if (date instanceof Date) {
    return new Date(date).toISOString().split('T')[0];
  }
  return null;
};
