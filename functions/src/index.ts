import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';
admin.initializeApp(functions.config().firebase);

export const db = admin.firestore();

import * as Constants from './constants';
import * as costFunctions from './functions/cost.functions';

export const onAddCost = functions.firestore
  .document(Constants.CostDoc)
  .onCreate((snap, context) => {
    return costFunctions.add(snap);
  });
