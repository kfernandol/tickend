import React from "react";
import { Navigate, createBrowserRouter, redirect } from "react-router-dom";
import { paths } from "./paths";
//components
import ProtectedRoute from "../components/routesProtected/routesProtected";
import Home from "../views/home/home";
import _Layout from "../views/shared/layout/_layout";
import _LayoutLogin from "../views/shared/layoutLogin/layoutLogin";
import Users from "../views/users/users.tsx";
import NewUsers from "../views/users/newUsers.tsx";
import EditUsers from "../views/users/editUsers.tsx";
import Roles from "../views/roles/roles";
import NewRol from "../views/roles/newRol";
import EditRoles from "../views/roles/editRol";


//Routes with login
export const routesAuthorized = () => {
  return createBrowserRouter([
    {
      path: "/",
      element: <_Layout />,
      children: [
        {
          path: "",
          element:
            <ProtectedRoute>
              <Home />,
            </ProtectedRoute>
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
        },
        {
          path: paths.editUser,
          element:
            <Navigate to={paths.users}></Navigate>
        },
        {
          path: paths.editUserWithId,
          element:
            <ProtectedRoute>
              <EditUsers />
            </ProtectedRoute>
        },
        {
          path: paths.roles,
          element:
            <ProtectedRoute>
              <Roles />
            </ProtectedRoute>,
        },
        {
          path: paths.newRol,
          element:
            <ProtectedRoute>
              <NewRol />
            </ProtectedRoute>
        },
        {
          path: paths.editRol,
          element:
            <Navigate to={paths.roles}></Navigate>
        },
        {
          path: paths.editRolWithId,
          element:
            <ProtectedRoute>
              <EditRoles />
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
