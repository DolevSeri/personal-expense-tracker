import axios from "axios";

const API_URL = "http://localhost:5000/api/expenses";

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