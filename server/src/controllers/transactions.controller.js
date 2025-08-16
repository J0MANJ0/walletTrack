import { sql } from '../config/db.js';

export const getUserTransactions = async (req, res) => {
  try {
    const {
      params: { userId },
    } = req;

    const transactions =
      await sql`SELECT * FROM transactions WHERE user_id = ${userId} ORDER BY created_at DESC`;

    res.status(200).json({ transactions });
  } catch (error) {
    console.log('Error getting user transactions: ', error.message);
    res
      .status(500)
      .json({ message: `Internal server error: ${error.message}` });
  }
};

export const createTransaction = async (req, res) => {
  try {
    const {
      body: { title, amount, category, user_id },
    } = req;
    if (!title || amount === undefined || !category || !user_id)
      return res.status(400).json({ message: 'Missing field(s)' });

    const transaction =
      await sql`INSERT INTO transactions(user_id,title,amount,category) VALUES (${user_id},${title},${amount},${category}) RETURNING *`;

    return res.status(201).json({ transaction: transaction[0] });
  } catch (error) {
    console.log('Error creating transaction: ', error.message);
    res
      .status(500)
      .json({ message: `Internal server error: ${error.message}` });
  }
};

export const getUserSummary = async (req, res) => {
  try {
    const {
      params: { userId },
    } = req;

    const balance =
      await sql`SELECT COALESCE(SUM(amount),0) as balance FROM transactions WHERE user_id = ${userId}`;

    const income =
      await sql`SELECT COALESCE(SUM(amount),0) as income FROM transactions WHERE user_id = ${userId} AND amount > 0`;

    const expenses =
      await sql`SELECT COALESCE(SUM(amount),0) as expenses FROM transactions WHERE user_id = ${userId} AND amount < 0`;

    return res.status(200).json({
      balance: balance[0].balance,
      income: income[0].income,
      expenses: expenses[0].expenses,
    });
  } catch (error) {
    console.log('Error getting user summary: ', error.message);
    res
      .status(500)
      .json({ message: `Internal server error: ${error.message}` });
  }
};

export const deleteTransaction = async (req, res) => {
  try {
    const {
      params: { id },
    } = req;

    if (isNaN(parseInt(id)))
      return res.status(400).json({ message: 'Invalid transaction' });

    const result =
      await sql`DELETE FROM transactions WHERE id = ${id} RETURNING *`;

    if (!result.length)
      return res.status(404).json({ message: 'Transaction not found' });

    return res.status(200).json({ message: 'Transaction deleted' });
  } catch (error) {
    console.log('Error deleting transaction: ', error.message);
    res
      .status(500)
      .json({ message: `Internal server error: ${error.message}` });
  }
};
