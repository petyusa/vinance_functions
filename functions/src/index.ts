import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';
admin.initializeApp(functions.config().firebase);

export const db = admin.firestore();

import * as Constants from './constants';
import { Income, Cost, Transfer } from './models';

export const onAddIncome = functions.firestore
  .document(Constants.IncomeDoc)
  .onCreate((snap, context) => {});

export const onDeleteIncome = functions.firestore
  .document(Constants.IncomeDoc)
  .onDelete((snap, context) => {
    const income = snap.data() as Income;
  });

export const onEditIncome = functions.firestore
  .document(Constants.IncomeDoc)
  .onUpdate((snap, context) => {});

export const onAddCost = functions.firestore
  .document(Constants.CostDoc)
  .onCreate((snap, context) => {});

export const onDeleteCost = functions.firestore
  .document(Constants.CostDoc)
  .onDelete((snap, context) => {});

export const onEditCost = functions.firestore
  .document(Constants.CostDoc)
  .onUpdate((snap, context) => {});

export const onAddTransfer = functions.firestore
  .document(Constants.TransferDoc)
  .onCreate((snap, context) => {});

export const onDeleteTransfer = functions.firestore
  .document(Constants.TransferDoc)
  .onDelete((snap, context) => {});

export const onEditTransfer = functions.firestore
  .document(Constants.TransferDoc)
  .onUpdate((snap, context) => {});
