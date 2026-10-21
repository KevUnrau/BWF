import { useState } from "react";
import SignIn from "../components/SignIn";
import SignUp from "../components/SignUp";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useEffect } from "react";
import Button from "../components/Button";

function Auth({ signUp }) {
  const [isSignUp, setIsSignUp] = useState(signUp);
  const { user } = useAuth();
  const navigate = useNavigate();
  useEffect(() => {
    if (user) {
      navigate("/profile", { replace: true });
    }
  }, [user]);
  return isSignUp ? (
    <>
      <SignUp></SignUp>
      <p>
        Already have an account?{" "}
        <Button
          onClick={() => {
            setIsSignUp(false);
          }}
        >
          Sign in
        </Button>
      </p>
    </>
  ) : (
    <>
      <SignIn></SignIn>
      <p>
        No account yet?{" "}
        <Button
          onClick={() => {
            setIsSignUp(true);
          }}
        >
          Create one
        </Button>
      </p>
    </>
  );
}

export default Auth;
