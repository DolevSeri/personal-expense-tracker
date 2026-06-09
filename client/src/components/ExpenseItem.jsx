function ExpenseItem({ expense, handleEdit, handleDelete }) {
  return (
    <div className="expense-item">
      <span>{expense.title}</span>
      <span> - ₪{expense.amount}</span>
      <button onClick={() => handleEdit(expense)}>Edit</button>
      <button onClick={() => handleDelete(expense._id)}>Delete</button>
    </div>
  );
}

export default ExpenseItem;
