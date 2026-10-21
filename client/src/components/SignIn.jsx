import Button from "./Button.jsx";
import { useState } from "react";
import { useApi } from "../api/client.js";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useToast } from "../context/ToastContext.jsx";

function SignIn() {
  const [user, setUser] = useState({ mail: "", password: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login } = useAuth();
  const { apiFetch } = useApi();
  const { toast } = useToast();

  const navigate = useNavigate();

  async function handleSubmit(event) {
    try {
      event.preventDefault();
      setIsSubmitting(true);
      const body = user;
      const response = await apiFetch(
        "/auth/signin",
        {
          method: "POST",
          body: JSON.stringify(body),
          credentials: "include",
        },
        false,
      );
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
      <h2>Sign in </h2>
      <form className="simple-form" onSubmit={handleSubmit}>
        <div>
          <label htmlFor="mail">Email:</label>
          <input
            id="mail"
            type="email"
            value={user.mail}
            onChange={(event) => {
              setUser({ ...user, mail: event.target.value });
            }}
          ></input>
        </div>
        <div>
          <label htmlFor="password">Password:</label>
          <input
            id="password"
            type="password"
            value={user.password}
            onChange={(event) => {
              setUser({ ...user, password: event.target.value });
            }}
          ></input>
        </div>
        <Button disabled={isSubmitting} type="submit">
          {isSubmitting ? "Logging in..." : "Login"}
        </Button>
      </form>
    </>
  );
}

export default SignIn;
