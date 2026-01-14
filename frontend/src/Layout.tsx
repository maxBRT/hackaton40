import { Outlet } from "react-router-dom";
import Header from "./components/Header";

export default function Layout() {
  return (
    <div>
      <Header />
      <div style={{ padding: 24 }}>
        <Outlet />
      </div>
    </div>
  );
}
