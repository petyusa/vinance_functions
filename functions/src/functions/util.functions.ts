import { db } from '../index';
import * as Constants from '../constants';

export const getDateString = function(date: any) {
  if (date instanceof Date) {
    return new Date(date).toISOString().split('T')[0];
  }
  return new Date(date.toDate()).toISOString().split('T')[0];
};

export const createDailyBalanceIfNotExists = function(
  date: FirebaseFirestore.Timestamp
) {
  const dateString = getDateString(date);
  const dateBefore = new Date(new Date(date.toDate()).getTime() - 86400000);
  const dateBeforeString = getDateString(dateBefore);

  console.log(dateString);
  console.log(dateBeforeString);

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
