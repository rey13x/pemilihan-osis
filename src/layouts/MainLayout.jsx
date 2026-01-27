import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import ChatBubble from "../components/ChatBubble";

export default function MainLayout() {
  return (
    <>
      <Navbar />
      <Hero />
      <Outlet />
      <ChatBubble />
    </>
  );
}
