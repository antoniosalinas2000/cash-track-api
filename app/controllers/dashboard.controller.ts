// file: controllers/transaction.controller.ts
import { Request, Response } from 'express';
import { addTransaction, deleteTransaction, getDashboardData, updateTransaction } from '../models/dashboard.model';
import { IExpense, IIncome } from '../../interfaces/dashboard.interface';

export const getDashboardDataController = async (req: any, res: Response): Promise<void> => {
    const user_id = req.decoded.user_id;

    try {
        const result = await getDashboardData(user_id);
        if (result.status === 200) {
            res.status(200).json({ message: result.message, data: result.data });
        } else {
            res.status(result.status).json({ message: result.message });
        }
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error" });
    }
};


export const addTransactionController = async (req: any, res: Response): Promise<void> => {
    const { name, date, amount  } = req.body;

    const type = req.params.type as 'income' | 'expense';
    const category_id_key = type === 'income' ? 'income_category_id' : 'expense_category_id';
    const category_id = req.body[category_id_key];

    const user_id = req.decoded.user_id;

    // Ensuring all necessary data is present
    if (!name || !date || !amount || !category_id || !user_id) {
        res.status(400).json({ message: "Missing required fields" });
        return;
    }

    // Explicitly defining transaction object based on type
    let transaction: IExpense | IIncome;
    if (type === 'income') {
        transaction = {
            name,
            date: new Date(date),
            amount,
            user_id,
            income_category_id: category_id  // Using explicit field for income
        } as IIncome;
    } else {
        transaction = {
            name,
            date: new Date(date),
            amount,
            user_id,
            expense_category_id: category_id  // Using explicit field for expense
        } as IExpense;
    }

    try {
        const result = await addTransaction(transaction, type);
        res.status(result.status).json({ message: result.message, data: result.data });
    } catch (error) {
        console.error('Error adding transaction', error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export const updateTransactionController = async (req: any, res: Response): Promise<void> => {
    const { name, date, amount } = req.body;

    const type = req.params.type as 'income' | 'expense';
    const transaction_id = req.params.transaction_id;

    const category_id_key = type === 'income' ? 'income_category_id' : 'expense_category_id';
    const category_id = req.body[category_id_key];

    const user_id = req.decoded.user_id;

    if (!name || !date || !amount || !category_id || !user_id || !transaction_id) {
        res.status(400).json({ message: "Missing required fields" });
        return;
    }

    let transaction: IExpense | IIncome;
    if (type === 'income') {
        transaction = {
            name,
            date: new Date(date),
            amount,
            user_id,
            income_category_id: category_id
        } as IIncome;
    } else {
        transaction = {
            name,
            date: new Date(date),
            amount,
            user_id,
            expense_category_id: category_id
        } as IExpense;
    }

    try {
        const result = await updateTransaction(transaction, type, transaction_id);
        res.status(result.status).json({ message: result.message, data: result.data, status : result.status });
    } catch (error) {
        console.error('Error updating transaction', error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export const deleteTransactionController = async (req: any, res: Response): Promise<void> => {
    const transaction_id = req.body.transaction_id;
    const type = req.body.type;

    if (!transaction_id) {
        res.status(400).json({ message: "Missing transaction ID" });
        return;
    }

    try {
        const result = await deleteTransaction(transaction_id, type);
        res.status(result.status).json({ message: result.message, status : result.status });
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error" });
    }
};