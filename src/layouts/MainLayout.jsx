import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import TopBar from "../components/TopBar";
import ChatBubble from "../components/ChatBubble";

export default function MainLayout() {
  return (
    <>
      <TopBar />
      <Navbar />
      <Hero />
      <Outlet />
      <ChatBubble />
    </>
  );
}
