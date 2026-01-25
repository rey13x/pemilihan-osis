import { Outlet } from "react-router-dom";
import TopBar from "../components/TopBar";
import Navbar from "../components/Navbar";
import Hero from "../components/Hero";

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
