import { useState } from "react";
import { useApi } from "../api/client";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useToast } from "../context/ToastContext";

function SignUp() {
  const [user, setUser] = useState({ mail: "", name: "", password: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const { apiFetch } = useApi();
  const { toast } = useToast();

  async function handleSubmit(event) {
    event.preventDefault();
    setIsSubmitting(true);
    const body = user;
    try {
      const response = await apiFetch("/auth/signup", {
        method: "POST",
        body: JSON.stringify(body),
        credentials: "include",
      });
      login(response.user, response.token);
      navigate("/profile", { replace: true });
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsSubmitting(false);
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
        <button disabled={isSubmitting} type="submit">
          {isSubmitting ? "Signing up..." : "Sign up"}
        </button>
      </form>
    </>
  );
}

export default SignUp;
