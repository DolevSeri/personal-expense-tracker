export const getCurrentMonthExpenses = (expenses) => {
  const currentDate = new Date();

  return expenses.filter((expense) => {
    const expenseDate = new Date(expense.date);

    return (
      expenseDate.getMonth() === currentDate.getMonth() &&
      expenseDate.getFullYear() === currentDate.getFullYear()
    );
  });
};

export const getTotalAmount = (expenses) => {
  return expenses.reduce((sum, expense) => {
    return sum + expense.amount;
  }, 0);
};

export const groupExpensesByCategory = (expenses) => {
  return expenses.reduce((groups, expense) => {
    const category = expense.category;

    if (!groups[category]) {
      groups[category] = [];
    }

    groups[category].push(expense);

    return groups;
  }, {});
};

export const normalizeCategory = (category) => {
  return category
    .trim()
    .toLowerCase()
    .split(" ")
    .filter((word) => word !== "")
    .map((word) => word[0].toUpperCase() + word.slice(1))
    .join(" ");
};

export const normalizeExpenseTitle = (title) => {
  return title.trim();
};
