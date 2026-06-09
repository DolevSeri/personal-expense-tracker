import "./App.css";
import { useEffect, useState } from "react";
import ExpenseForm from "./components/ExpenseForm";
import CategorySection from "./components/CategorySection";
import {
  getExpenses,
  createExpense,
  updateExpense,
  deleteExpense,
} from "./services/expenseService";
import {
  getCurrentMonthExpenses,
  getTotalAmount,
  groupExpensesByCategory,
  normalizeCategory,
  normalizeExpenseTitle,
} from "./utils/expenseUtils";

function App() {
  const [expenses, setExpenses] = useState([]);

  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [editingExpenseId, setEditingExpenseId] = useState(null);

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

  const handleSubmit = async (e) => {
    e.preventDefault();

    setErrorMessage("");
    setSuccessMessage("");

    if (!title.trim() || !amount || !category.trim()) {
      setErrorMessage("Please fill in all fields");
      return;
    }

    if (Number(amount) <= 0) {
      setErrorMessage("Amount must be greater than 0");
      return;
    }

    const newExpense = {
      title: normalizeExpenseTitle(title),
      amount: Number(amount),
      category: normalizeCategory(category),
    };

    try {
      if (editingExpenseId) {
        const response = await updateExpense(editingExpenseId, newExpense);

        setExpenses(
          expenses.map((expense) =>
            expense._id === editingExpenseId ? response.data : expense,
          ),
        );

        setEditingExpenseId(null);
        setSuccessMessage("Expense updated successfully");
      } else {
        const response = await createExpense(newExpense);

        setExpenses([...expenses, response.data]);
        setSuccessMessage("Expense added successfully");
      }

      setTitle("");
      setAmount("");
      setCategory("");
    } catch (error) {
      console.error(error);
      setErrorMessage("Failed to save expense");
    }
  };

  const handleDelete = async (id) => {
    setErrorMessage("");
    setSuccessMessage("");

    try {
      await deleteExpense(id);

      setExpenses(expenses.filter((expense) => expense._id !== id));

      setSuccessMessage("Expense deleted successfully");
    } catch (error) {
      console.error(error);
      setErrorMessage("Failed to delete expense");
    }
  };

  const currentMonthExpenses = getCurrentMonthExpenses(expenses);

  const handleEdit = (expense) => {
    setEditingExpenseId(expense._id);
    setTitle(expense.title);
    setAmount(expense.amount);
    setCategory(expense.category);
  };

  const totalAmount = getTotalAmount(currentMonthExpenses);

  const groupedExpenses = groupExpensesByCategory(currentMonthExpenses);

  return (
    <div className="container">
      <h1>Monthly Expense Tracker</h1>
      {errorMessage && <p className="error-message">{errorMessage}</p>}
      {successMessage && <p className="success-message">{successMessage}</p>}
      <ExpenseForm
        title={title}
        setTitle={setTitle}
        amount={amount}
        setAmount={setAmount}
        category={category}
        setCategory={setCategory}
        editingExpenseId={editingExpenseId}
        handleSubmit={handleSubmit}
      />
      <h2>Total This Month: ₪{totalAmount}</h2>
      {Object.keys(groupedExpenses)
        .sort()
        .map((category) => (
          <CategorySection
            key={category}
            category={category}
            expenses={groupedExpenses[category]}
            handleEdit={handleEdit}
            handleDelete={handleDelete}
          />
        ))}
    </div>
  );
}

export default App;
