import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";

function MainLayout() {
  return (
    <div className="min-h-screen bg-app-bg text-text-primary">
      <header>
        <div className="mx-auto max-w-7xl p-4">
          <h1 className="text-3xl font-bold sm:text-4xl">Bet with Friends</h1>
        </div>

        <Navbar></Navbar>
      </header>
      <main className="mx-auto max-w-7xl p-4">
        <Outlet></Outlet>
      </main>
    </div>
  );
}

export default MainLayout;
