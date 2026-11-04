import { useState } from "react";
import {
  normalizeCategory,
  normalizeExpenseTitle,
} from "../utils/expenseUtils";
import Input from "./ui/Input";
import Button from "./ui/Button";

function ExpenseForm({ editingExpense, handleSubmit, onCancel }) {
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
    <form onSubmit={onSubmit} className="space-y-5">
      {validationError && (
        <p className="error-message text-sm" role="alert">
          {validationError}
        </p>
      )}

      <Input
        id="expense-title"
        name="title"
        label="Expense title"
        type="text"
        placeholder="e.g. Groceries"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Input
          id="expense-amount"
          name="amount"
          label="Amount (₪)"
          type="number"
          placeholder="0.00"
          min="0.01"
          step="0.01"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          required
        />

        <Input
          id="expense-category"
          name="category"
          label="Category"
          type="text"
          placeholder="e.g. Food"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          required
        />
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <Button type="submit" className="w-full sm:w-auto">
          {editingExpense ? "Save changes" : "Add expense"}
        </Button>

        {editingExpense && (
          <Button
            type="button"
            variant="secondary"
            onClick={onCancel}
            className="w-full sm:w-auto"
          >
            Cancel
          </Button>
        )}
      </div>
    </form>
  );
}

export default ExpenseForm;
