import { useState } from "react";
import { useApi } from "../api/client";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

function SignUp() {
  const [user, setUser] = useState({ mail: "", name: "", password: "" });
  const [error, setError] = useState(null);
  const { login } = useAuth();
  const navigate = useNavigate();
  const { apiFetch } = useApi();

  async function handleSubmit(event) {
    event.preventDefault();
    const body = user;
    try {
      const response = await apiFetch("/auth/signup", {
        method: "POST",
        body: JSON.stringify(body),
        credentials: "include",
      });
      login(response.user, response.token);
      setError(null);
      navigate("/profile", { replace: true });
    } catch (error) {
      setError(error.message);
    }
  }

  return (
    <>
      <h2>Sign Up</h2>
      <form onSubmit={handleSubmit}>
        <label htmlFor="mail">Email:</label>
        <input
          id="mail"
          type="email"
          value={user.mail}
          onChange={(event) => {
            setUser({ ...user, mail: event.target.value });
          }}
        ></input>
        <label htmlFor="username">Username:</label>
        <input
          id="username"
          type="text"
          value={user.name}
          onChange={(event) => {
            setUser({ ...user, name: event.target.value });
          }}
        ></input>
        <label htmlFor="password">Password:</label>
        <input
          id="password"
          type="password"
          value={user.password}
          onChange={(event) => {
            setUser({ ...user, password: event.target.value });
          }}
        ></input>
        <button type="submit">Sign up</button>
      </form>
      {error ? <p className="error">{error}</p> : undefined}
    </>
  );
}

export default SignUp;
