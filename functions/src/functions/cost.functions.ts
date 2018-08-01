import { db } from '../index';
import * as Constants from '../constants';

export const add = function(snap: FirebaseFirestore.DocumentSnapshot) {
  const accRef = db.collection(Constants.AccountCollection).doc(snap.data().id);
  const catRef = db.collection('cost-categories').doc(snap.data().categoryId);

  const today = new Date('2018-08-06').toISOString().split('T')[0];

  let dailyRef: FirebaseFirestore.DocumentReference;

  db.collection('daily-values')
    .doc(today)
    .get()
    .then((doc) => {
      if (!doc.exists) {
        db.collection('daily-values')
          .doc(today)
          .set({
            balance: 0,
            date: new Date()
          });
      }
    })
    .then(() => {
      dailyRef = db.collection('daily-values').doc(today);
    })
    .then(() => {
      return db
        .runTransaction((transaction) => {
          return transaction.get(accRef).then((accDoc) => {
            const newBalance = accDoc.data().balance - snap.data().amount;
            return transaction.update(accRef, { balance: newBalance });
          });
        })
        .then(() => {
          return db.runTransaction((transaction) => {
            return transaction.get(catRef).then((catDoc) => {
              const newBalance = catDoc.data().balance + snap.data().amount;
              return transaction.update(catRef, { balance: newBalance });
            });
          });
        })
        .then(() => {
          return db.runTransaction((transaction) => {
            return transaction.get(dailyRef).then((daily) => {
              const newBalance = daily.data().balance + snap.data().amount;
              return transaction.update(dailyRef, { balance: newBalance });
            });
          });
        });
    });
};
