import App from "../App";
import SignIn from "../components/authForm/login";
import SignUp from "../components/authForm/register";
import Home from "../pages/Home";
import PendingApproval from "../pages/PendingApproval";
import PrivateRoute from "./PrivateRoute";
import { createBrowserRouter } from "react-router-dom";
const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <PrivateRoute>
        <App />
      </PrivateRoute>
    ),
    children: [
      {
        index: true,
        path: "/home",
        element: (
          <div>
            <Home />
          </div>
        ),
      },
    ],
  },
  {
    path: "/login",
    element: <SignIn />,
  },
  {
    path: "/register",
    element: <SignUp />,
  },
  {
    path: "/approval",
    element: <PendingApproval />,
  },
  {
    path: "/*",
    element: (
      <h1 className="text-red-800 flex h-screen w-full justify-center items-center font-bold">
        Not Found
      </h1>
    ),
  },
]);

export default router;
