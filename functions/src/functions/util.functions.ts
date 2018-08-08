import { db } from '../index';
import * as Constants from '../constants';

export const getDateString = function(date) {
  if (!(date instanceof Date)) {
    date = new Date(date.toDate());
  }
  return new Date(date).toISOString().split('T')[0];
};

export const getMonth = function(date, isPrevious) {
  if (!(date instanceof Date)) {
    date = new Date(date.toDate());
  }

  let monthNumber;
  if (isPrevious) {
    monthNumber = date.getMonth();
  } else {
    monthNumber = date.getMonth() + 1;
  }

  const month = monthNumber < 10 ? `0${monthNumber}` : `${monthNumber}`;

  const year = date.getFullYear();

  return [year, month].join('-');
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
