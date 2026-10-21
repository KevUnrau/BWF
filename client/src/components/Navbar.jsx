import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useApi } from "../api/client";
import { useEffect, useState } from "react";
import Button from "./Button";
import { Mail, MailDot } from "lucide-react";

function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { apiFetch } = useApi();

  const [unreadInvitations, setUnreadInvitations] = useState(0);
  const [isOpen, setIsOpen] = useState(false);

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

  return (
    <nav className="bg-navbar">
      <div className="mx-auto max-w-7xl px-4 py-2">
        <div className="justify-baseline md:hidden">
          <Button
            type="button"
            variant="navbar"
            onClick={() => setIsOpen(!isOpen)}
            className="flex flex-col gap-1.5 p-2"
          >
            <span className="h-0.5 w-6 bg-white"></span>
            <span className="h-0.5 w-6 bg-white"></span>
            <span className="h-0.5 w-6 bg-white"></span>
          </Button>
        </div>
        <ul
          className={`${
            isOpen ? "flex" : "hidden"
          } flex-col gap-4 py-3 md:h-10 md:flex md:flex-row md:items-center md:gap-6 md:py-0`}
        >
          {user ? (
            <>
              <li>
                <Link className="primary-navbar-link" to={"/"}>
                  Home
                </Link>
              </li>
              <li>
                <Link className="primary-navbar-link" to={"/profile"}>
                  Profile
                </Link>
              </li>
              <li>
                <Link className="primary-navbar-link" to={"/group"}>
                  Groups
                </Link>
              </li>
              {user.role_id === 1 && (
                <li>
                  <Link className="primary-navbar-link" to={"/admin"}>
                    Admin
                  </Link>
                </li>
              )}
              <li>
                <Link className="primary-navbar-link" to={"/about"}>
                  About
                </Link>
              </li>
              <li
                className="md:ml-auto"
                onClick={() => {
                  setUnreadInvitations(0);
                }}
              >
                <Link
                  className="primary-navbar-link flex"
                  to={"/notifications"}
                >
                  {unreadInvitations > 0 ? <MailDot></MailDot> : <Mail></Mail>}
                </Link>
              </li>
              <div>
                <Button
                  variant="navbar"
                  onClick={async () => {
                    logout();
                    try {
                      await apiFetch("/auth/signout", {
                        method: "POST",
                        credentials: "include",
                      });
                    } catch (error) {
                      console.error(error.message);
                    }

                    navigate("/auth");
                  }}
                >
                  Sign Out
                </Button>
              </div>
            </>
          ) : (
            <>
              <li>
                <Link className="primary-navbar-link" to={"/"}>
                  Home
                </Link>
              </li>
              <li>
                <Link className="primary-navbar-link" to={"/about"}>
                  About
                </Link>
              </li>
              <li className="md:ml-auto">
                <Link className="primary-navbar-link" to={"/auth"}>
                  Sign in
                </Link>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;
