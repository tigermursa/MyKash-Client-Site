import App from "../App";
import SignIn from "../components/authForm/login";
import SignUp from "../components/authForm/register";
import AdminHomePage from "../pages/admin/AdminHomePage";
import AdminUserManagementPage from "../pages/admin/AdminUserManagementPage";
import History from "../pages/History";
import Home from "../pages/Home";
import NotFoundPage from "../pages/NotFound";

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
        path: "/admin/dashboard",
        element: (
          <AdminRoute>
            <AdminHomePage />
          </AdminRoute>
        ),
      },
      {
        path: "/admin/user-management",
        element: (
          <AdminRoute>
            <AdminUserManagementPage />
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
    element: <NotFoundPage />,
  },
]);

export default router;
