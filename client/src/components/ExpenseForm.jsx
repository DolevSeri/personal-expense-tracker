import { useState } from "react";
import {
  normalizeCategory,
  normalizeExpenseTitle,
} from "../utils/expenseUtils";

function ExpenseForm({ editingExpense, handleSubmit }) {
  const [title, setTitle] = useState(editingExpense?.title ?? "");
  const [amount, setAmount] = useState(editingExpense?.amount ?? "");
  const [category, setCategory] = useState(editingExpense?.category ?? "");
  const [validationError, setValidationError] = useState("");
  const onSubmit = async (e) => {
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

    const expenseData = {
      title: normalizeExpenseTitle(title),
      amount: Number(amount),
      category: normalizeCategory(category),
    };

    const success = await handleSubmit(expenseData);

    if (success) {
      setTitle("");
      setAmount("");
      setCategory("");
    }
  };

  return (
    <form onSubmit={onSubmit}>
      {validationError && <p className="error-message">{validationError}</p>}
      <input
        id="title"
        name="title"
        type="text"
        placeholder="Expense title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <input
        id="amount"
        name="amount"
        type="number"
        placeholder="Amount"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />

      <input
        id="category"
        name="category"
        type="text"
        placeholder="Category"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
      />

      <button type="submit">
        {editingExpense ? "Update Expense" : "Add Expense"}
      </button>
    </form>
  );
}

export default ExpenseForm;
