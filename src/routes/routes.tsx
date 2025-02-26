import App from "../App";
import SignIn from "../components/authForm/login";
import SignUp from "../components/authForm/register";
import AdminHomePage from "../pages/admin/AdminHomePage";
import History from "../pages/History";
import Home from "../pages/Home";

import PendingApproval from "../pages/PendingApproval";
import AdminRoute from "./AdminRoute";
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
          <PrivateRoute>
            <Home />,
          </PrivateRoute>
        ),
      },
      {
        path: "/history",
        element: (
          <PrivateRoute>
            <History />,
          </PrivateRoute>
        ),
      },
      {
        path: "/admin/home",
        element: (
          <AdminRoute>
            <AdminHomePage />
          </AdminRoute>
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
    path: "/history",
    element: <History />,
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
