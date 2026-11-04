import { useContext, useState } from "react";
import ExpenseForm from "./ExpenseForm";
import AuthContext from "../context/AuthContext";
import CategorySection from "./CategorySection";
import {
  getCurrentMonthExpenses,
  getTotalAmount,
  groupExpensesByCategory,
} from "../utils/expenseUtils";
import useExpenses from "../hooks/useExpenses";
import Button from "./ui/Button";

function ExpenseTracker() {
  const {
    expenses,
    errorMessage: apiErrorMessage,
    successMessage,
    loadError,
    isLoading,
    retryExpenses,
    addExpense,
    editExpense,
    removeExpense,
  } = useExpenses();
  const { logout } = useContext(AuthContext);
  const [editingExpense, setEditingExpense] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

  const handleSubmit = async (expenseData) => {
    let success;

    if (editingExpense) {
      success = await editExpense(editingExpense._id, expenseData);
    } else {
      success = await addExpense(expenseData);
    }

    if (success) {
      setEditingExpense(null);
      setIsFormOpen(false);
    }

    return success;
  };

  const currentMonthExpenses = getCurrentMonthExpenses(expenses);

  const handleEdit = (expense) => {
    setEditingExpense(expense);
    setIsFormOpen(true);
  };

  const handleOpenForm = () => {
    setEditingExpense(null);
    setIsFormOpen(true);
  };

  const handleCancel = () => {
    setEditingExpense(null);
    setIsFormOpen(false);
  };

  const totalAmount = getTotalAmount(currentMonthExpenses);
  const monthLabel = new Intl.DateTimeFormat("en-US", {
    month: "long",
    year: "numeric",
  }).format(new Date());

  const groupedExpenses = groupExpensesByCategory(currentMonthExpenses);

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
          <h1 className="text-xl font-bold text-slate-900">Expense Tracker</h1>

          <Button variant="secondary" onClick={logout}>
            Logout
          </Button>
        </div>
      </header>

      <main className="mx-auto max-w-6xl space-y-6 px-4 py-6 sm:px-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">
            Monthly expenses
          </h2>
          <p className="mt-1 text-sm text-slate-500">{monthLabel}</p>
        </div>

        <div className="grid grid-cols-1 gap-5 lg:grid-cols-5">
          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm lg:col-span-2">
            <h2 className="text-sm font-medium text-slate-500">
              Total spent this month
            </h2>

            <p className="mt-3 text-3xl font-bold text-slate-900">
              ₪{totalAmount}
            </p>

            <p className="mt-2 text-sm text-slate-500">
              Across {currentMonthExpenses.length} expenses
            </p>
          </section>

          <div className="lg:col-span-3">
            <div className="lg:hidden">
              <Button
                onClick={isFormOpen ? handleCancel : handleOpenForm}
                className="w-full"
                aria-expanded={isFormOpen}
                aria-controls="expense-form-panel"
              >
                {isFormOpen ? "Close form" : "+ Add expense"}
              </Button>
            </div>

            <section
              id="expense-form-panel"
              className={`rounded-2xl border border-slate-200 bg-white p-6 shadow-sm ${
                isFormOpen ? "mt-4 lg:mt-0" : "hidden lg:block"
              }`}
            >
              <h2 className="mb-5 text-lg font-semibold text-slate-900">
                {editingExpense ? "Edit expense" : "Add an expense"}
              </h2>

              <ExpenseForm
                key={editingExpense?._id ?? "new"}
                editingExpense={editingExpense}
                handleSubmit={handleSubmit}
                onCancel={handleCancel}
              />
            </section>
          </div>
        </div>

        {apiErrorMessage && (
          <p className="error-message text-sm" role="alert">
            {apiErrorMessage}
          </p>
        )}

        {successMessage && (
          <p className="success-message text-sm" role="status">
            {successMessage}
          </p>
        )}

        <section>
          <h2 className="mb-5 text-xl font-semibold text-slate-900">
            Expenses by category
          </h2>

          {isLoading ? (
            <div
              className="rounded-2xl border border-slate-200 bg-white p-8 text-center text-slate-500"
              role="status"
            >
              Loading expenses...
            </div>
          ) : loadError ? (
            <div
              className="rounded-2xl border border-red-200 bg-red-50 p-6"
              role="alert"
            >
              <p className="mb-4 text-sm text-red-700">{loadError}</p>

              <Button variant="secondary" onClick={retryExpenses}>
                Try again
              </Button>
            </div>
          ) : currentMonthExpenses.length === 0 ? (
            <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center text-slate-500">
              No expenses recorded this month. Add your first expense above.
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
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
          )}
        </section>
      </main>
    </div>
  );
}

export default ExpenseTracker;
