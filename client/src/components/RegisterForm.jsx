import { useContext, useState } from "react";
import AuthContext from "../context/AuthContext";
import { useNavigate, Link } from "react-router";
import AuthLayout from "./ui/AuthLayout";
import Button from "./ui/Button";
import Input from "./ui/Input";

function RegisterForm() {
  const { register } = useContext(AuthContext);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    try {
      await register({ name, email, password });

      navigate("/login", { replace: true });
    } catch (error) {
      setErrorMessage(error.response?.data?.message || "Registration failed");
    }
  };
  return (
    <AuthLayout
      title="Create an account"
      subtitle="Start tracking your monthly expenses"
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        <Input
          label="Full name"
          id="register-name"
          name="name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter your name"
          autoComplete="name"
          required
        />

        <Input
          label="Email address"
          id="register-email"
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
          id="register-password"
          name="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Create a password"
          autoComplete="new-password"
          required
        />

        {errorMessage && (
          <p className="error-message text-sm" role="alert">
            {errorMessage}
          </p>
        )}

        <Button type="submit" className="w-full">
          Create account
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-slate-500">
        Already have an account?{" "}
        <Link
          to="/login"
          className="font-medium text-primary hover:text-primary-hover hover:underline"
        >
          Sign in
        </Link>
      </p>
    </AuthLayout>
  );
}

export default RegisterForm;
