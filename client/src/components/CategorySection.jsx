import ExpenseItem from "./ExpenseItem";
import { getTotalAmount } from "../utils/expenseUtils";

function CategorySection({ category, expenses, handleEdit, handleDelete }) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <h3 className="text-base font-semibold text-slate-900">{category}</h3>

        <span className="text-base font-semibold text-slate-900">
          ₪{getTotalAmount(expenses)}
        </span>
      </div>

      <div className="divide-y divide-slate-100">
        {expenses.map((expense) => (
          <ExpenseItem
            key={expense._id}
            expense={expense}
            handleEdit={handleEdit}
            handleDelete={handleDelete}
          />
        ))}
      </div>
    </section>
  );
}

export default CategorySection;
