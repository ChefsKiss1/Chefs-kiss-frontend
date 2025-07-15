import { Outlet } from "react-router";
import Navbar from "./Navbar";
import Footer from "./Footer";

export default function Layout() {
  return (
    <>
    <div className="app-container">
      <Navbar />
      <main className="content">
        <Outlet />
      </main>
      <Footer />
      </div>
    </>
  );
}
