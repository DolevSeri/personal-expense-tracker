import "./App.css";
import { useContext, useState } from "react";
import AuthContext from "./context/AuthContext";
import LoginForm from "./components/LoginForm";
import RegisterForm from "./components/RegisterForm";
import ExpenseTracker from "./components/ExpenseTracker";

function App() {
  const { user, loading } = useContext(AuthContext);
  const [showRegister, setShowRegister] = useState(false);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (!user) {
    return (
      <>
        {showRegister ? (
          <RegisterForm onSuccess={() => setShowRegister(false)} />
        ) : (
          <LoginForm />
        )}

        <button type="button" onClick={() => setShowRegister((prev) => !prev)}>
          {showRegister ? "Back to Login" : "Create an Account"}
        </button>
      </>
    );
  }

  return <ExpenseTracker />;
}

export default App;
