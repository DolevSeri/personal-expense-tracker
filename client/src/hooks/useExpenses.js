
import { useCallback, useEffect, useRef, useState } from "react";
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
  const loadControllerRef = useRef(null);

  const loadExpenses = useCallback(async () => {
    loadControllerRef.current?.abort();

    const controller = new AbortController();
    loadControllerRef.current = controller;

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

      if (loadControllerRef.current === controller) {
        loadControllerRef.current = null;
      }
    }
  }, []);

  useEffect(() => {
    // False positive in eslint-plugin-react-hooks@7.1.1:
    // State updates in loadExpenses happen after await, not synchronously.
    // Using .then() avoids the warning, but we keep async/await for consistency.
    // React issue #34905, fixed in source by PR #36734.
    // Remove this suppression when upgrading to a version containing the fix.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadExpenses();

    return () => {
      loadControllerRef.current?.abort();
    };
  }, [loadExpenses]);

  const retryExpenses = () => {
    setIsLoading(true);
    setLoadError("");
    return loadExpenses();
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
      return true;
    } catch (error) {
      console.error(error);
      setErrorMessage("Failed to delete expense");
      return false;
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
