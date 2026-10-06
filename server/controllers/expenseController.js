const Expense = require("../models/Expense");

const getExpenses = async (req, res, next) => {
  try {
    const expenses = await Expense.find({
      user: req.userId,
    });

    res.status(200).json(expenses);
  } catch (error) {
    next(error);
  }
};

const createExpense = async (req, res, next) => {
  try {
    const { title, amount, category, date } = req.body;
    const expense = await Expense.create({
      title,
      amount,
      category,
      date,
      user: req.userId,
    });

    res.status(201).json(expense);
  } catch (error) {
    next(error);
  }
};

const deleteExpense = async (req, res, next) => {
  try {
    const expense = await Expense.findOneAndDelete({
      _id: req.params.id,
      user: req.userId,
    });
    if (!expense) {
      return res.status(404).json({
        message: "Expense not found",
      });
    }

    res.status(200).json({
      message: "Expense deleted",
    });
  } catch (error) {
    next(error);
  }
};

const updateExpense = async (req, res, next) => {
  try {
    const { title, amount, category, date } = req.body;
    const expense = await Expense.findOneAndUpdate(
      {
        _id: req.params.id,
        user: req.userId,
      },
      {
        title,
        amount,
        category,
        date,
      },
      {
        returnDocument: "after",
        runValidators: true,
      },
    );

    if (!expense) {
      return res.status(404).json({
        message: "Expense not found",
      });
    }

    res.status(200).json(expense);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getExpenses,
  createExpense,
  deleteExpense,
  updateExpense,
};
