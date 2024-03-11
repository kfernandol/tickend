import React from "react";
import { createBrowserRouter } from "react-router-dom";
import { paths } from "./paths";
//components
import ProtectedRoute from "../components/routesProtected/routesProtected";
import Home from "../views/home/home";
import _Layout from "../views/shared/layout/_layout";
import _LayoutLogin from "../views/shared/layoutLogin/layoutLogin";
import Users from "../views/users/users";
import NewUsers from "../views/users/newUsers";


//Routes with login
export const routesAuthorized = () => {
  return createBrowserRouter([
    {
      path: "/",
      element: <_Layout />,
      children: [
        {
          path: "",
          element: <Home />,
        },
        {
          path: paths.users,
          element:
            <ProtectedRoute>
              <Users />
            </ProtectedRoute>,
        },
        {
          path: paths.newUser,
          element:
            <ProtectedRoute>
              <NewUsers />
            </ProtectedRoute>
        }
      ],
    },
  ]);
};


//Routes without login
export const routesUnauthorized = () => {
  return createBrowserRouter([
    {
      path: "/",
      element: <_LayoutLogin />,
    },
    {
      path: "*",
      element: <_LayoutLogin />
    }
  ]);
};
