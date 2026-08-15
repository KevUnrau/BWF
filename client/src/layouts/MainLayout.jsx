import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";

function MainLayout() {
  return (
    <>
      <header>
        <h1 className="py-4 font-bold text-5xl">Bet with Friends</h1>
        <Navbar></Navbar>
      </header>
      <main>
        <Outlet></Outlet>
      </main>
    </>
  );
}

export default MainLayout;
