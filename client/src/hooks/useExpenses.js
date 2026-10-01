import { useEffect, useState } from "react";
import {
  getExpenses,
  createExpense,
  updateExpense,
  deleteExpense,
} from "../services/expenseService";

function useExpenses() {
  const [expenses, setExpenses] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        const response = await getExpenses();
        setExpenses(response.data);
      } catch (error) {
        console.error(error);
        setErrorMessage("Failed to load expenses");
      }
    };

    fetchExpenses();
  }, []);

  const addExpense = async (expenseData) => {
    setErrorMessage("");
    setSuccessMessage("");

    try {
      const response = await createExpense(expenseData);

      setExpenses((prevExpenses) => [...prevExpenses, response.data]);
      setSuccessMessage("Expense added successfully");
      return true;
    } catch (error) {
      console.error(error);
      setErrorMessage("Failed to save expense");
      return false;
    }
  };

  const editExpense = async (id, expenseData) => {
    setErrorMessage("");
    setSuccessMessage("");

    try {
      const response = await updateExpense(id, expenseData);

      setExpenses((prevExpenses) =>
        prevExpenses.map((expense) =>
          expense._id === id ? response.data : expense,
        ),
      );

      setSuccessMessage("Expense updated successfully");
      return true;
    } catch (error) {
      console.error(error);
      setErrorMessage("Failed to save expense");
      return false;
    }
  };
  const removeExpense = async (id) => {
    setErrorMessage("");
    setSuccessMessage("");

    try {
      await deleteExpense(id);

      setExpenses((prevExpenses) =>
        prevExpenses.filter((expense) => expense._id !== id),
      );

      setSuccessMessage("Expense deleted successfully");
    } catch (error) {
      console.error(error);
      setErrorMessage("Failed to delete expense");
    }
  };

  return {
    expenses,
    errorMessage,
    successMessage,
    addExpense,
    editExpense,
    removeExpense,
  };
}

export default useExpenses;
