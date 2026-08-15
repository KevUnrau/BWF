import { useState } from "react";
import { fetchApiWithoutRetry } from "../api/client.js";
import { useAuth } from "../context/AuthContext";
import { redirect, useNavigate } from "react-router-dom";

function SignIn() {
  const [user, setUser] = useState({ mail: "", password: "" });
  const { login } = useAuth();
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  async function handleSubmit(event) {
    try {
      event.preventDefault();
      const body = user;
      const response = await fetchApiWithoutRetry("/auth/signin", {
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
      <h2>Sign in </h2>{" "}
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
        <label htmlFor="password">Password:</label>
        <input
          id="password"
          type="password"
          value={user.password}
          onChange={(event) => {
            setUser({ ...user, password: event.target.value });
          }}
        ></input>
        <button type="submit">Login</button>
      </form>
      {error ? <p className="error">{error}</p> : undefined}
    </>
  );
}

export default SignIn;
