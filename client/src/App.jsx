import "./App.css";
import { useState } from "react";
import ExpenseForm from "./components/ExpenseForm";
import CategorySection from "./components/CategorySection";
import {
  getCurrentMonthExpenses,
  getTotalAmount,
  groupExpensesByCategory,
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
  const [editingExpense, setEditingExpense] = useState(null);

  const handleSubmit = async (expenseData) => {
    let success;

    if (editingExpense) {
      success = await editExpense(editingExpense._id, expenseData);

      if (success) {
        setEditingExpense(null);
      }
    } else {
      success = await addExpense(expenseData);
    }
    return success;
  };

  const currentMonthExpenses = getCurrentMonthExpenses(expenses);

  const handleEdit = (expense) => {
    setEditingExpense(expense);
  };

  const totalAmount = getTotalAmount(currentMonthExpenses);

  const groupedExpenses = groupExpensesByCategory(currentMonthExpenses);

  return (
    <div className="container">
      <h1>Monthly Expense Tracker</h1>
      {apiErrorMessage && <p className="error-message">{apiErrorMessage}</p>}
      {successMessage && <p className="success-message">{successMessage}</p>}
      <ExpenseForm
        key={editingExpense?._id ?? "new"}
        editingExpense={editingExpense}
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
