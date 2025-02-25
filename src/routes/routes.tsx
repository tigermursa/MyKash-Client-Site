import App from "../App";
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
        element: <div>I am nothing</div>,
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
    path: "/*",
    element: (
      <h1 className="text-red-800 flex h-screen w-full justify-center items-center font-bold">
        Not Found
      </h1>
    ),
  },
]);

export default router;
