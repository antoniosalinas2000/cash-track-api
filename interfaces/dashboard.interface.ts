export interface IExpense {
    expense_id?: string;
    name: string;
    date: Date;
    amount: number;
    expense_category_id: number;
    user_id?: string;
}

export interface IIncome {
    income_id?: string;
    name: string;
    date: Date;
    amount: number;
    income_category_id: number;
    user_id?: string;
}

export interface ICategory {
    category_id: number;
    name: string;
}

export interface IDashboardData {
    expense_categories: ICategory[];
    income_categories: ICategory[];
    expense_data: IExpense[];
    income_data: IIncome[];
}