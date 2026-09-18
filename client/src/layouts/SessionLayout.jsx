import { Outlet, Link } from "react-router";

function SessionLayout() {
  return (
    <>
      <ul className="navbar">
        <li className="navbar-item">
          <Link to={"standings"}>Standings</Link>
        </li>
        <li className="navbar-item">
          <Link to={"matches"}>Matches</Link>
        </li>
        <li className="navbar-item">
          <Link to={"settings"}>Settings</Link>
        </li>
      </ul>
      <Outlet></Outlet>
    </>
  );
}

export default SessionLayout;
