import { Outlet, Link } from "react-router";

function SessionLayout() {
  return (
    <>
      <nav className="my-2">
        <ul className="flex border border-brand rounded-md bg-surface py-3 px-4 ">
          <li>
            <Link className="secondary-navbar-link" to={"standings"}>
              Standings
            </Link>
          </li>
          <li>
            <Link className="secondary-navbar-link" to={"matches"}>
              Matches
            </Link>
          </li>
        </ul>
      </nav>
      <Outlet></Outlet>
    </>
  );
}

export default SessionLayout;
