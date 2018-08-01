import { db } from '../index';
import * as Constants from '../constants';

export const add = function(snap: FirebaseFirestore.DocumentSnapshot) {
  const accRef = db.collection(Constants.AccountCollection).doc(snap.data().id);
  return db.runTransaction((transaction) => {
    return transaction.get(accRef).then((accDoc) => {
      const newBalance = accDoc.data().balance + snap.data().amount;
      return transaction.update(accRef, { balance: newBalance });
    });
  });
};
