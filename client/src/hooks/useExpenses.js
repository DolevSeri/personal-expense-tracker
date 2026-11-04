import { useEffect, useState } from "react";
import {
  getExpenses,
  createExpense,
  updateExpense,
  deleteExpense,
} from "../services/expenseService";

function useExpenses() {
  const [expenses, setExpenses] = useState([]);
  const [loadError, setLoadError] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    const controller = new AbortController();

    const loadExpenses = async () => {
      try {
        const response = await getExpenses({
          signal: controller.signal,
        });

        if (controller.signal.aborted) return;

        setExpenses(response.data);
        setLoadError("");
      } catch (error) {
        if (controller.signal.aborted) return;

        console.error(error);
        setLoadError("Failed to load expenses");
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      }
    };

    loadExpenses();

    return () => {
      controller.abort();
    };
  }, []);

  const retryExpenses = async () => {
    setIsLoading(true);
    setLoadError("");

    try {
      const response = await getExpenses();

      setExpenses(response.data);
    } catch (error) {
      console.error(error);
      setLoadError("Failed to load expenses");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!successMessage) return;

    const timeoutId = setTimeout(() => {
      setSuccessMessage("");
    }, 4000);

    return () => clearTimeout(timeoutId);
  }, [successMessage]);

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
    loadError,
    isLoading,
    retryExpenses,
    addExpense,
    editExpense,
    removeExpense,
  };
}

export default useExpenses;
