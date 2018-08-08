import { db } from '../index';
import * as utils from './util.functions';
import * as Constants from '../constants';

export const getOrCreate = function(date) {
  const previousDateString = utils.getMonth(date, true);
  const actualDateString = utils.getMonth(date, true);

  db.collection(Constants.MonthStartCollection)
    .doc(actualDateString)
    .get()
    .then((doc) => {
      if (!doc.exists) {
        db.collection(Constants.MonthStartCollection)
          .doc(previousDateString)
          .get()
          .then((prevDoc) => prevDoc.data().balance)
          .then((previousBalance) => {
            db.collection(Constants.MonthStartCollection)
              .doc(actualDateString)
              .set({ balance: previousBalance })
              .then(() => {
                return doc.ref;
              });
          });
      }
      return doc.ref;
    });
};
