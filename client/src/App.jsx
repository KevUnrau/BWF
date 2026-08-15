import reactLogo from "./assets/react.svg";
import viteLogo from "./assets/vite.svg";
import heroImg from "./assets/hero.png";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import Group from "./pages/Group";
import Homepage from "./pages/Homepage";
import Auth from "./pages/Auth";
import Profile from "./pages/Profile";
import { Children, useEffect } from "react";
import { fetchApiWithoutRetry } from "./api/client.js";
import { useAuth } from "./context/AuthContext.jsx";

function App() {
  const { login } = useAuth();
  useEffect(() => {
    async function auth() {
      try {
        const response = await fetchApiWithoutRetry("/auth/refresh", {
          method: "POST",
          credentials: "include",
        });

        login(response.user, response.token);
      } catch (error) {
        console.error(error.message);
      }
    }
    auth();
  }, []);
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout></MainLayout>}>
          <Route path="/" element={<Homepage></Homepage>}></Route>
          <Route path="/group" element={<Group></Group>}></Route>
          <Route path="/auth" element={<Auth signUp={false}></Auth>}></Route>
          <Route path="/profile" element={<Profile></Profile>}></Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
