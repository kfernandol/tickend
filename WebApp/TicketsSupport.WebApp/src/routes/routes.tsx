import React, { useEffect, useState } from "react";
import { Navigate, RouteObject, createBrowserRouter, redirect } from "react-router-dom";
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
import Menus from "../views/menus/menus.tsx";
import NewMenu from "../views/menus/newMenu.tsx";
import EditMenu from "../views/menus/editMenu.tsx";
import TicketTypes from "../views/ticket-types/ticketType.tsx";
import { NewTicketType } from "../views/ticket-types/ticketTypeNew.tsx";
import { EditTicketType } from "../views/ticket-types/ticketTypeEdit.tsx";

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
            <ProtectedRoute name="Home">
              <Home />,
            </ProtectedRoute>
        },
        {
          path: paths.users,
          element:
            <ProtectedRoute name="Users">
              <Users />
            </ProtectedRoute>,
        },
        {
          path: paths.newUser,
          element:
            <ProtectedRoute name="Users">
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
            <ProtectedRoute name="Users">
              <EditUsers />
            </ProtectedRoute>
        },
        {
          path: paths.roles,
          element:
            <ProtectedRoute name="Roles">
              <Roles />
            </ProtectedRoute>,
        },
        {
          path: paths.newRol,
          element:
            <ProtectedRoute name="Roles">
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
            <ProtectedRoute name="Roles">
              <EditRoles />
            </ProtectedRoute>
        },
        {
          path: paths.menus,
          element:
            <ProtectedRoute name="Menus">
              <Menus />
            </ProtectedRoute>,
        },
        {
          path: paths.newMenus,
          element:
            <ProtectedRoute name="Menus">
              <NewMenu />
            </ProtectedRoute>
        },
        {
          path: paths.editMenus,
          element:
            <Navigate to={paths.menus}></Navigate>
        },
        {
          path: paths.editMenusWithId,
          element:
            <ProtectedRoute name="Menus">
              <EditMenu />
            </ProtectedRoute>
        },
        {
          path: paths.ticketTypes,
          element:
            <ProtectedRoute name="TicketTypes">
              <TicketTypes />
            </ProtectedRoute>,
        },
        {
          path: paths.newTicketType,
          element:
            <ProtectedRoute name="TicketTypes">
              <NewTicketType />
            </ProtectedRoute>
        },
        {
          path: paths.EditTicketType,
          element:
            <Navigate to={paths.ticketTypes}></Navigate>
        },
        {
          path: paths.EditTicketTypeWithId,
          element:
            <ProtectedRoute name="TicketTypes">
              <EditTicketType />
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
