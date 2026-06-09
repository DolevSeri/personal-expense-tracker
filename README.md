# MERN Expense Tracker

A simple expense tracking application built with React, Node.js, Express, MongoDB Atlas, and Mongoose.

## Features

* Add expenses
* Edit expenses
* Delete expenses
* Group expenses by category
* Display category totals
* Display monthly spending total
* Frontend and backend validation
* Error handling

## Tech Stack

Frontend:

* React
* Vite
* Axios

Backend:

* Node.js
* Express
* MongoDB Atlas
* Mongoose

## Run Locally

Backend:

```bash
cd server
npm install
npm run dev
```

Frontend:

```bash
cd client
npm install
npm run dev
```

Create a `.env` file in the `server` folder:

```env
MONGO_URI=your_mongodb_connection_string
PORT=5000
```

Create a `.env` file in the `client` folder:

```env
VITE_API_URL=http://localhost:5000
```
