import "./App.css";
import { useState } from "react";
import ExpenseForm from "./components/ExpenseForm";
import CategorySection from "./components/CategorySection";
import {
  getCurrentMonthExpenses,
  getTotalAmount,
  groupExpensesByCategory,
  normalizeCategory,
  normalizeExpenseTitle,
} from "./utils/expenseUtils";

import useExpenses from "./hooks/useExpenses";

function App() {
  const {
    expenses,
    errorMessage: apiErrorMessage,
    successMessage,
    addExpense,
    editExpense,
    removeExpense,
  } = useExpenses();

  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [editingExpenseId, setEditingExpenseId] = useState(null);

  const [validationError, setValidationError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    setValidationError("");
    if (!title.trim() || !amount || !category.trim()) {
      setValidationError("Please fill in all fields");
      return;
    }

    if (Number(amount) <= 0) {
      setValidationError("Amount must be greater than 0");
      return;
    }

    const newExpense = {
      title: normalizeExpenseTitle(title),
      amount: Number(amount),
      category: normalizeCategory(category),
    };

    let success;

    if (editingExpenseId) {
      success = await editExpense(editingExpenseId, newExpense);

      if (success) {
        setEditingExpenseId(null);
      }
    } else {
      success = await addExpense(newExpense);
    }

    if (success) {
      setTitle("");
      setAmount("");
      setCategory("");
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
      {validationError && <p className="error-message">{validationError}</p>}
      {apiErrorMessage && <p className="error-message">{apiErrorMessage}</p>}
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
            handleDelete={removeExpense}
          />
        ))}
    </div>
  );
}

export default App;
