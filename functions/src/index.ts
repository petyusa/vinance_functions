import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';
admin.initializeApp(functions.config().firebase);

export const db = admin.firestore();

import * as Constants from './constants';

import * as dailyBalanceFunctions from './functions/daily-balance.functions';
import * as costCategoryFunctions from './functions/cost-category.functions';
import * as accountFunctions from './functions/account-balance.functions';

export const onAddIncome = functions.firestore
  .document(Constants.IncomeDoc)
  .onCreate((snap, context) => {
    const data = snap.data();
    return accountFunctions.add(data.toId, data.amount).then(() => {
      return dailyBalanceFunctions.add(data.amount, data.date);
    });
  });

export const onDeleteIncome = functions.firestore
  .document(Constants.IncomeDoc)
  .onDelete((snap, context) => {
    const data = snap.data();
    return accountFunctions.substract(data.toId, data.amount).then(() => {
      return dailyBalanceFunctions.substract(data.amount, data.date);
    });
  });

export const onEditIncome = functions.firestore
  .document(Constants.IncomeDoc)
  .onUpdate((snap, context) => {
    const dataBefore = snap.before.data();
    const dataAfter = snap.after.data();

    return accountFunctions
      .substract(dataBefore.toId, dataBefore.amount)
      .then(() => {
        return dailyBalanceFunctions
          .substract(dataBefore.amount, dataBefore.date)
          .then(() => {
            return accountFunctions
              .add(dataAfter.toId, dataAfter.amount)
              .then(() => {
                return dailyBalanceFunctions.add(
                  dataAfter.amount,
                  dataAfter.date
                );
              });
          });
      });
  });

export const onAddCost = functions.firestore
  .document(Constants.CostDoc)
  .onCreate((snap, context) => {
    const data = snap.data();
    return accountFunctions.substract(data.fromId, data.amount).then(() => {
      return costCategoryFunctions
        .add(data.categoryId, data.amount)
        .then(() => {
          return dailyBalanceFunctions.substract(data.amount, data.date);
        });
    });
  });

export const onDeleteCost = functions.firestore
  .document(Constants.CostDoc)
  .onCreate((snap, context) => {
    const data = snap.data();
    return accountFunctions.add(data.fromId, data.amount).then(() => {
      return costCategoryFunctions
        .substract(data.categoryId, data.amount)
        .then(() => {
          return dailyBalanceFunctions.add(data.amount, data.date);
        });
    });
  });

export const onEditCost = functions.firestore
  .document(Constants.CostDoc)
  .onUpdate((snap, context) => {
    const dataBefore = snap.before.data();
    const dataAfter = snap.after.data();

    return accountFunctions
      .add(dataBefore.fromId, dataBefore.amount)
      .then(() => {
        return costCategoryFunctions
          .substract(dataBefore.categoryId, dataBefore.amount)
          .then(() => {
            return dailyBalanceFunctions
              .add(dataBefore.amount, dataBefore.date)
              .then(() => {
                return accountFunctions
                  .substract(dataAfter.fromId, dataAfter.amount)
                  .then(() => {
                    return costCategoryFunctions
                      .add(dataAfter.categoryId, dataAfter.amount)
                      .then(() => {
                        return dailyBalanceFunctions.substract(
                          dataAfter.amount,
                          dataAfter.date
                        );
                      });
                  });
              });
          });
      });
  });

export const onAddTransfer = functions.firestore
  .document(Constants.TransferDoc)
  .onCreate((snap, context) => {
    const data = snap.data();
    return accountFunctions.substract(data.fromId, data.amount).then(() => {
      return accountFunctions.add(data.toId, data.amount0);
    });
  });

export const onDeleteTransfer = functions.firestore
  .document(Constants.TransferDoc)
  .onDelete((snap, context) => {
    const data = snap.data();
    return accountFunctions.add(data.fromId, data.amount).then(() => {
      return accountFunctions.substract(data.toId, data.amount);
    });
  });

export const onEditTransfer = functions.firestore
  .document(Constants.TransferDoc)
  .onUpdate((snap, context) => {
    const dataBefore = snap.before.data();
    const dataAfter = snap.after.data();

    return accountFunctions
      .add(dataBefore.fromId, dataBefore.amount)
      .then(() => {
        return accountFunctions
          .substract(dataBefore.toId, dataBefore.amount)
          .then(() => {
            return accountFunctions
              .substract(dataAfter.fromId, dataAfter.amount)
              .then(() => {
                return accountFunctions.add(dataAfter.toId, dataAfter.amount);
              });
          });
      });
  });
