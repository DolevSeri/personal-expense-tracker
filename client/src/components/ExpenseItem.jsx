import Button from "./ui/Button";

function ExpenseItem({ expense, handleEdit, handleDelete }) {
  return (
    <div className="flex flex-col gap-3 py-3 first:pt-0 last:pb-0 sm:flex-row sm:items-center sm:justify-between">
      <div className="min-w-0">
        <p className="break-words text-sm font-medium text-slate-900">
          {expense.title}
        </p>

        <p className="mt-1 text-sm text-slate-500">₪{expense.amount}</p>
      </div>
      <div className="flex shrink-0 gap-2">
        <Button
          variant="secondary"
          onClick={() => handleEdit(expense)}
          size="sm"
        >
          Edit
        </Button>

        <Button
          variant="danger"
          onClick={() => handleDelete(expense._id)}
          size="sm"
        >
          Delete
        </Button>
      </div>
    </div>
  );
}

export default ExpenseItem;
