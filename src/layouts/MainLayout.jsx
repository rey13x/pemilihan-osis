import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import TopBar from "../components/TopBar";

export default function MainLayout() {
  return (
    <>
      <TopBar />
      <Navbar />
      <Hero />
      <Outlet />
    </>
  );
}
