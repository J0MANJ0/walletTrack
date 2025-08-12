import { Router } from 'express';
import {
  createTransaction,
  deleteTransaction,
  getUserSummary,
  getUserTransactions,
} from '../controllers/transactions.controller.js';

const transactionRouter = Router();
transactionRouter.post('/', createTransaction);
transactionRouter.get('/:userId', getUserTransactions);
transactionRouter.delete('/:id', deleteTransaction);
transactionRouter.get('/summary/:userId', getUserSummary);

export default transactionRouter;
