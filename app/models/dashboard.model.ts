import { nanoid } from "nanoid";
import { IExpense, IIncome } from "../../interfaces/dashboard.interface";
import db from "./db";

interface ResultData<T = any> {
    status: number;
    message: string;
    data?: T;
}

export async function getDashboardData(user_id : string): Promise<ResultData> {
    let expense_categories = "SELECT * FROM expense_category";
    let income_categories = "SELECT * FROM income_category";

    let expense_data = "SELECT * FROM expense WHERE user_id = ?";

    let income_data = "SELECT * FROM income WHERE user_id = ?";

    try {
        const [expense_categories_results] = await db.promise().query(expense_categories);
        const [income_categories_results] = await db.promise().query(income_categories);
        const [expense_data_results] = await db.promise().query(expense_data, [user_id]);
        const [income_data_results] = await db.promise().query(income_data, [user_id]);

        return {
            status: 200,
            message: "Data retrieved",
            data: {
                expense_categories: expense_categories_results,
                income_categories: income_categories_results,
                expense_data: expense_data_results,
                income_data: income_data_results
            }
        }
    } catch (error) {
        return { status: 500, message: "Failed to retrieve data" };
    }
}


export async function addTransaction(transaction: IExpense | IIncome, type: 'income' | 'expense'): Promise<ResultData> {
    const transaction_id = nanoid(21);
    let category_id: number;

    if (type === 'income' && 'income_category_id' in transaction) {
        category_id = transaction.income_category_id;
    } else if (type === 'expense' && 'expense_category_id' in transaction) {
        category_id = transaction.expense_category_id;
    } else {
        throw new Error("Invalid transaction type or missing category ID");
    }

    const sql = `INSERT INTO ${type} (${type}_id, name, date, amount, ${type}_category_id, user_id) VALUES (?, ?, ?, ?, ?, ?)`;

    try {
        await db.promise().query(sql, [
            transaction_id,
            transaction.name,
            transaction.date,
            transaction.amount,
            category_id,
            transaction.user_id
        ]);
        return {
            status: 200,
            message: `${type} added successfully`,
            data: { ...transaction, transaction_id, [`${type}_category_id`]: category_id }
        };
    } catch (err: any) {
        console.error(err);
        return { status: 500, message: "Failed to add transaction", data: err };
    }
}

export async function updateTransaction(transaction: IExpense | IIncome, type: 'income' | 'expense', id: string): Promise<ResultData> {
    let category_id: number;

    if (type === 'income' && 'income_category_id' in transaction) {
        category_id = transaction.income_category_id;
    } else if (type === 'expense' && 'expense_category_id' in transaction) {
        category_id = transaction.expense_category_id;
    } else {
        throw new Error("Invalid transaction type or missing category ID");
    }

    const sql = `UPDATE ${type} SET name = ?, date = ?, amount = ?, ${type}_category_id = ? WHERE ${type}_id = ?`;
    try {
        await db.promise().query(sql, [
            transaction.name,
            transaction.date,
            transaction.amount,
            category_id,
            id
        ]);

        return {
            status: 200,
            message: `${type} updated successfully`,
            data: { ...transaction, [`${type}_category_id`]: category_id }
        };
    } catch (err: any) {
        console.error(err);
        return { status: 500, message: "Failed to update transaction", data: err };
    }
};

export async function deleteTransaction(transaction_id: string, type: 'income' | 'expense'): Promise<ResultData> {
    const sql = `DELETE FROM ${type} WHERE ${type}_id = ?`;

    try {
        await db.promise().query(sql, [transaction_id]);
        return { status: 200, message: `${type} deleted successfully` };
    } catch (err: any) {
        console.error(err);
        return { status: 500, message: "Failed to delete transaction", data: err };
    }
}