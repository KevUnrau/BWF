import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useApi } from "../api/client";

function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { apiFetch } = useApi();
  return user ? (
    <>
      <ul className="navbar">
        <li className="navbar-item">
          <Link to={"/"}>Home</Link>
        </li>
        <li className="navbar-item">
          <Link to={"/profile"}>Profile</Link>
        </li>
        <li className="navbar-item">
          <Link to={"/group"}>Groups</Link>
        </li>
        <li id="mail" className="navbar-item ml-auto">
          <a href="">📥</a>
        </li>
        <li id="signout" className="navbar-item">
          <button
            className="cursor-pointer p-1"
            onClick={() => {
              logout();
              apiFetch("/auth/signout", {
                method: "POST",
                credentials: "include",
              });
              navigate("/auth");
            }}
          >
            Sign Out
          </button>
        </li>
      </ul>
    </>
  ) : (
    <>
      <ul className="navbar">
        <li className="navbar-item">
          <Link to={"/"}>Home</Link>
        </li>
        <li id="signin" className="navbar-item">
          <Link to={"/auth"}>Sign in</Link>
        </li>
      </ul>
    </>
  );
}

export default Navbar;
