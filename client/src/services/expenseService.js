import axios from "axios";

const API_URL = `${import.meta.env.VITE_API_URL}/api/expenses`;

export const getExpenses = () => {
  return axios.get(API_URL);
};

export const createExpense = (expenseData) => {
  return axios.post(API_URL, expenseData);
};

export const updateExpense = (id, expenseData) => {
  return axios.put(`${API_URL}/${id}`, expenseData);
};

export const deleteExpense = (id) => {
  return axios.delete(`${API_URL}/${id}`);
};