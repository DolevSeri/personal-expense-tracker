import api from "./api";

const API_URL = "/api/expenses";

export const getExpenses = (config = {}) => {
  return api.get(API_URL, config);
};

export const createExpense = (expenseData) => {
  return api.post(API_URL, expenseData);
};

export const updateExpense = (id, expenseData) => {
  return api.put(`${API_URL}/${id}`, expenseData);
};

export const deleteExpense = (id) => {
  return api.delete(`${API_URL}/${id}`);
};