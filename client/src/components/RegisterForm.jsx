import { useContext, useState } from "react";
import AuthContext from "../context/AuthContext";

function RegisterForm({ onSuccess }) {
  const { register } = useContext(AuthContext);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    try {
      await register({ name, email, password });
      onSuccess();
    } catch (error) {
      setErrorMessage(error.response?.data?.message || "Registration failed");
    }
  };
  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />

      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      {errorMessage && (<p className="error-message">{errorMessage}</p>)}
      <button type="submit">Register</button>
    </form>
  );
}

export default RegisterForm;
