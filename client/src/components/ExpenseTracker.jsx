import {
  useContext,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
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
import ConfirmDialog from "./ui/ConfirmDialog";

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
  const { user, logout } = useContext(AuthContext);
  const [editingExpense, setEditingExpense] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const submittingRef = useRef(false);
  const [expenseToDelete, setExpenseToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const deletingRef = useRef(false);
  const formDialogRef = useRef(null);

  useEffect(() => {
    const dialog = formDialogRef.current;
    if (!dialog) return;

    const mediaQuery = window.matchMedia("(min-width: 1024px)");

    const updateDialog = () => {
      if (mediaQuery.matches) {
        if (dialog.open) {
          dialog.close();
        }
      } else if (isFormOpen && !dialog.open) {
        dialog.showModal();
        dialog.querySelector("#expense-title")?.focus({ preventScroll: true });
      } else if (!isFormOpen && dialog.open) {
        dialog.close();
      }
    };

    updateDialog();

    mediaQuery.addEventListener("change", updateDialog);

    return () => {
      mediaQuery.removeEventListener("change", updateDialog);
    };
  }, [isFormOpen]);

  useLayoutEffect(() => {
    if (!isFormOpen) return;

    const dialog = formDialogRef.current;
    const titleInput = dialog?.querySelector("#expense-title");

    if (!titleInput || titleInput.disabled) return;

    const isDesktop = window.matchMedia("(min-width: 1024px)").matches;

    if (isDesktop || dialog.open) {
      titleInput.focus({ preventScroll: true });
    }
  }, [isFormOpen, editingExpense]);

  const handleSubmit = async (expenseData) => {
    if (submittingRef.current || isLoading || loadError) return false;

    submittingRef.current = true;
    setIsSubmitting(true);

    try {
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
    } finally {
      submittingRef.current = false;
      setIsSubmitting(false);
    }
  };

  const currentMonthExpenses = getCurrentMonthExpenses(expenses);

  const handleEdit = (expense) => {
    if (submittingRef.current) return;

    setEditingExpense(expense);
    setIsFormOpen(true);
  };

  const handleOpenForm = () => {
    if (submittingRef.current) return;

    setEditingExpense(null);
    setIsFormOpen(true);
  };

  const handleCancel = () => {
    if (submittingRef.current) return;

    setEditingExpense(null);
    setIsFormOpen(false);
  };
  const handleDeleteClick = (expense) => {
    if (submittingRef.current || deletingRef.current) return;

    setExpenseToDelete(expense);
  };

  const handleDeleteCancel = () => {
    if (deletingRef.current) return;

    setExpenseToDelete(null);
  };

  const handleDeleteConfirm = async () => {
    if (!expenseToDelete || deletingRef.current) return;

    deletingRef.current = true;
    setIsDeleting(true);

    try {
      const success = await removeExpense(expenseToDelete._id);

      if (success) {
        setExpenseToDelete(null);
      }
    } finally {
      deletingRef.current = false;
      setIsDeleting(false);
    }
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

      <main className="mx-auto max-w-6xl space-y-6 px-4 py-6 pb-24 sm:px-6 lg:pb-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">
            Welcome back, {user?.name}!
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Your expenses for {monthLabel}
          </p>
        </div>

        <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-5">
          {/* Monthly summary and expenses */}
          <div className="space-y-6 lg:col-span-3">
            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-sm font-medium text-slate-500">
                Total spent this month
              </h2>

              {isLoading ? (
                <p className="mt-3 text-sm text-slate-500" role="status">
                  Loading summary...
                </p>
              ) : loadError ? (
                <p className="mt-3 text-sm text-red-600">Summary unavailable</p>
              ) : (
                <>
                  <p className="mt-3 text-3xl font-bold text-slate-900">
                    ₪{totalAmount}
                  </p>

                  <p className="mt-2 text-sm text-slate-500">
                    Across {currentMonthExpenses.length} expenses
                  </p>
                </>
              )}
            </section>

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
                <div className="space-y-4">
                  {Object.keys(groupedExpenses)
                    .sort()
                    .map((category) => (
                      <CategorySection
                        key={category}
                        category={category}
                        expenses={groupedExpenses[category]}
                        handleEdit={handleEdit}
                        handleDelete={handleDeleteClick}
                      />
                    ))}
                </div>
              )}
            </section>
          </div>

          {/* Shared Add/Edit form */}
          <dialog
            ref={formDialogRef}
            onCancel={(e) => {
              if (isSubmitting) {
                e.preventDefault();
              } else {
                handleCancel();
              }
            }}
            className="
    m-auto w-[calc(100%-2rem)] max-w-lg
    rounded-2xl border border-slate-200
    bg-white p-6 text-slate-900 shadow-xl
    backdrop:bg-slate-900/50
    max-h-[90dvh] overflow-y-auto

    lg:sticky lg:top-6 lg:col-span-2
    lg:m-0 lg:block lg:w-full lg:max-w-none
    lg:max-h-none lg:overflow-visible
    lg:shadow-sm
  "
            aria-labelledby="expense-form-heading"
          >
            <div className="mb-5 flex items-center justify-between gap-3">
              <h2
                id="expense-form-heading"
                className="text-lg font-semibold text-slate-900"
              >
                {editingExpense ? "Edit expense" : "Add an expense"}
              </h2>

              {isFormOpen && (
                <button
                  type="button"
                  onClick={handleCancel}
                  disabled={isSubmitting}
                  className="text-sm text-slate-500 hover:text-slate-900 lg:hidden"
                  aria-label="Close expense form"
                >
                  ✕
                </button>
              )}
            </div>

            <ExpenseForm
              key={editingExpense?._id ?? "new"}
              editingExpense={editingExpense}
              handleSubmit={handleSubmit}
              onCancel={handleCancel}
              isSubmitting={isSubmitting}
              isLoadBlocked={isLoading || Boolean(loadError)}
            />
          </dialog>
        </div>

        {/* Persistent mobile Add button */}
        <div className="fixed inset-x-0 bottom-0 z-30 border-t border-slate-200 bg-white p-4 lg:hidden">
          <div className="mx-auto max-w-6xl">
            <Button
              onClick={handleOpenForm}
              className="w-full"
              disabled={isSubmitting}
              aria-haspopup="dialog"
            >
              + Add expense
            </Button>
          </div>
        </div>
        {expenseToDelete && (
          <ConfirmDialog
            title="Delete expense?"
            message={`Are you sure you want to delete "${expenseToDelete.title}"? This action cannot be undone.`}
            onConfirm={handleDeleteConfirm}
            onCancel={handleDeleteCancel}
            isPending={isDeleting}
          />
        )}
      </main>
    </div>
  );
}

export default ExpenseTracker;
