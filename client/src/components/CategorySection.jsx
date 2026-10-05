import ExpenseItem from "./ExpenseItem";
import { getTotalAmount } from "../utils/expenseUtils";

function CategorySection({ category, expenses, handleEdit, handleDelete }) {
  return (
    <div className="category-section">
      <h2>
        {category} - ₪{getTotalAmount(expenses)}
      </h2>

      {expenses.map((expense) => (
        <ExpenseItem
          key={expense._id}
          expense={expense}
          handleEdit={handleEdit}
          handleDelete={handleDelete}
        />
      ))}
    </div>
  );
}

export default CategorySection;
