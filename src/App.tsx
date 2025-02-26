import { Outlet } from "react-router-dom";
import Navbar from "./components/shared/Navbar";

const App = () => {
  return (
    <div className="container mx-auto">
      <Navbar />
      <Outlet />
    </div>
  );
};

export default App;
