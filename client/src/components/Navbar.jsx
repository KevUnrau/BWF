import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useApi } from "../api/client";
import { useEffect, useState } from "react";

function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { apiFetch } = useApi();

  const [unreadInvitations, setUnreadInvitations] = useState(0);

  useEffect(() => {
    async function fetchUnreadInvitations() {
      try {
        const { _count: count } = await apiFetch("/invitations/unread/count");
        setUnreadInvitations(count);
      } catch (error) {
        console.error(error);
      }
    }
    if (user) {
      fetchUnreadInvitations();
    }
  }, [user]);

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
        {user.role_id === 1 && (
          <li className="navbar-item">
            <Link to={"/admin"}>Admin</Link>
          </li>
        )}
        <li
          id="mail"
          className="navbar-item ml-auto"
          onClick={() => {
            setUnreadInvitations(0);
          }}
        >
          <Link to={"/notifications"}>
            📥<sup>{unreadInvitations}</sup>
          </Link>
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
