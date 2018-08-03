import { db } from '../index';
import * as Constants from '../constants';

export const getDateString = function(date) {
  if (date instanceof Date) {
    return new Date(date).toISOString().split('T')[0];
  }
  return new Date(date.toDate()).toISOString().split('T')[0];
};

export const getOrCreateDailyValue = function(date) {
  const dateString = getDateString(date);
  const dateBefore = new Date(date.toDate().getTime() - 86400000);
  const dateBeforeString = getDateString(dateBefore);

  return db
    .collection(Constants.DailyValues)
    .doc(dateString)
    .get()
    .then((doc) => {
      if (!doc.exists) {
        db.collection(Constants.DailyValues)
          .doc(dateBeforeString)
          .get()
          .then((before) => {
            return db
              .collection(Constants.DailyValues)
              .doc(dateString)
              .set({
                balance: before.data().balance,
                date: new Date(dateString)
              })
              .then(() => {
                return db.collection(Constants.DailyValues).doc(dateString);
              });
          });
      }
      return db.collection(Constants.DailyValues).doc(dateString);
    });
};
