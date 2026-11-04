import { useContext, useState } from "react";
import AuthContext from "../context/AuthContext";
import { useNavigate, Link } from "react-router";
import AuthLayout from "./ui/AuthLayout";
import Button from "./ui/Button";
import Input from "./ui/Input";

function LoginForm() {
  const { login } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    try {
      await login({
        email,
        password,
      });

      navigate("/dashboard", { replace: true });
    } catch (error) {
      setErrorMessage(error.response?.data?.message || "Login failed");
    }
  };
  return (
    <AuthLayout title="Welcome back" subtitle="Sign in to your Expense Tracker">
      <form onSubmit={handleSubmit} className="space-y-5">
        <Input
          label="Email address"
          id="login-email"
          name="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          autoComplete="email"
          required
        />

        <Input
          label="Password"
          id="login-password"
          name="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter your password"
          autoComplete="current-password"
          required
        />

        {errorMessage && (
          <p className="error-message text-sm" role="alert">
            {errorMessage}
          </p>
        )}

        <Button type="submit" className="w-full">
          Sign in
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-slate-500">
        Don't have an account?{" "}
        <Link
          to="/register"
          className="font-medium text-primary hover:text-primary-hover hover:underline"
        >
          Create an account
        </Link>
      </p>
    </AuthLayout>
  );
}

export default LoginForm;
