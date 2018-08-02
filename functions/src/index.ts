import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';
admin.initializeApp(functions.config().firebase);

export const db = admin.firestore();

import * as Constants from './constants';
import { Income, Cost, Transfer } from './models';

import * as dailyBalanceFunctions from './functions/daily-balance.functions';
import * as costCategoryFunctions from './functions/cost-category.functions';
import * as accountFunctions from './functions/account-balance.functions';

export const onAddIncome = functions.firestore
  .document(Constants.IncomeDoc)
  .onCreate((snap, context) => {
    const income = snap.data() as Income;
    return accountFunctions.add(income.toId, income.amount).then(() => {
      return dailyBalanceFunctions.add(income.amount, income.date);
    });
  });

export const onDeleteIncome = functions.firestore
  .document(Constants.IncomeDoc)
  .onDelete((snap, context) => {
    const income = snap.data() as Income;
    return accountFunctions.substract(income.toId, income.amount).then(() => {
      return dailyBalanceFunctions.substract(income.amount, income.date);
    });
  });

export const onEditIncome = functions.firestore
  .document(Constants.IncomeDoc)
  .onUpdate((snap, context) => {
    const originalIncome = snap.before.data() as Income;
    const newIncome = snap.after.data() as Income;

    return accountFunctions
      .substract(originalIncome.toId, originalIncome.amount)
      .then(() => {
        return dailyBalanceFunctions
          .substract(originalIncome.amount, originalIncome.date)
          .then(() => {
            return accountFunctions
              .add(newIncome.toId, newIncome.amount)
              .then(() => {
                return dailyBalanceFunctions.add(
                  newIncome.amount,
                  newIncome.date
                );
              });
          });
      });
  });

export const onAddCost = functions.firestore
  .document(Constants.CostDoc)
  .onCreate((snap, context) => {
    const cost = snap.data() as Cost;
    return accountFunctions.substract(cost.fromId, cost.amount).then(() => {
      return costCategoryFunctions
        .add(cost.categoryId, cost.amount)
        .then(() => {
          return dailyBalanceFunctions.substract(cost.amount, cost.date);
        });
    });
  });

export const onDeleteCost = functions.firestore
  .document(Constants.CostDoc)
  .onDelete((snap, context) => {
    const cost = snap.data() as Cost;
    return accountFunctions.add(cost.fromId, cost.amount).then(() => {
      return costCategoryFunctions
        .substract(cost.categoryId, cost.amount)
        .then(() => {
          return dailyBalanceFunctions.add(cost.amount, cost.date);
        });
    });
  });

export const onEditCost = functions.firestore
  .document(Constants.CostDoc)
  .onUpdate((snap, context) => {
    const originalCost = snap.before.data() as Cost;
    const newCost = snap.after.data() as Cost;

    return accountFunctions
      .add(originalCost.fromId, originalCost.amount)
      .then(() => {
        return costCategoryFunctions
          .substract(originalCost.categoryId, originalCost.amount)
          .then(() => {
            return dailyBalanceFunctions
              .add(originalCost.amount, originalCost.date)
              .then(() => {
                return accountFunctions
                  .substract(newCost.fromId, newCost.amount)
                  .then(() => {
                    return costCategoryFunctions
                      .add(newCost.categoryId, newCost.amount)
                      .then(() => {
                        return dailyBalanceFunctions.substract(
                          newCost.amount,
                          newCost.date
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
    const transfer = snap.data() as Transfer;
    return accountFunctions
      .substract(transfer.fromId, transfer.amount)
      .then(() => {
        return accountFunctions.add(transfer.toId, transfer.amount);
      });
  });

export const onDeleteTransfer = functions.firestore
  .document(Constants.TransferDoc)
  .onDelete((snap, context) => {
    const transfer = snap.data() as Transfer;
    return accountFunctions.add(transfer.fromId, transfer.amount).then(() => {
      return accountFunctions.substract(transfer.toId, transfer.amount);
    });
  });

export const onEditTransfer = functions.firestore
  .document(Constants.TransferDoc)
  .onUpdate((snap, context) => {
    const originalTransfer = snap.before.data() as Transfer;
    const newTransfer = snap.after.data() as Transfer;

    return accountFunctions
      .add(originalTransfer.fromId, originalTransfer.amount)
      .then(() => {
        return accountFunctions
          .substract(originalTransfer.toId, originalTransfer.amount)
          .then(() => {
            return accountFunctions
              .substract(newTransfer.fromId, newTransfer.amount)
              .then(() => {
                return accountFunctions.add(
                  newTransfer.toId,
                  newTransfer.amount
                );
              });
          });
      });
  });
