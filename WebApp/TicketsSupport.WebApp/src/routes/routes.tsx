import { Navigate, createBrowserRouter } from "react-router-dom";
import { paths } from "./paths";
//components
import ProtectedRoute from "../components/routesProtected/routesProtected";
import Home from "../views/home/home";
import Layout from "../views/shared/layout/Layout.tsx";
import LayoutLogin from "../views/shared/layoutLogin/layoutLogin.tsx";
import Users from "../views/users/User.tsx";
import UsersNew from "../views/users/User.new.tsx";
import UsersEdit from "../views/users/User.edit.tsx";
import Roles from "../views/roles/Rol.tsx";
import RolNew from "../views/roles/Rol.new.tsx";
import RolEdit from "../views/roles/Rol.edit.tsx";
import Menus from "../views/menus/Menus.tsx";
import MenuNew from "../views/menus/Menu.new.tsx";
import MenuEdit from "../views/menus/Menu.edit.tsx";
import TicketTypes from "../views/ticket-types/TicketType.tsx";
import TicketTypeNew from "../views/ticket-types/TicketType.new.tsx";
import TicketTypeEdit from "../views/ticket-types/TicketType.edit.tsx";
import TicketStatus from "../views/ticket-status/TicketStatus.tsx";
import TicketStatusNew from "../views/ticket-status/TicketStatus.new.tsx";
import TicketStatusEdit from "../views/ticket-status/TicketStatus.edit.tsx";
import TicketPriority from "../views/ticket-priority/TicketPriority.tsx";
import TicketPriorityNew from "../views/ticket-priority/TicketPriority.new.tsx";
import TicketPriorityEdit from "../views/ticket-priority/TicketPriority.edit.tsx";
import Profile from "../views/profile/Profile.tsx";
import ResetPassword from "../views/reset-password/reset.password.tsx";
import ChangePassword from "../views/change-password/changePassword.tsx";
import Projects from "../views/projects/Projects.tsx";
import ProjectNew from "../views/projects/Project.new.tsx";
import ProjecEdit from "../views/projects/Project.edit.tsx";
import Tickets from "../views/tickets/Tickets.tsx";
import TicketsNew from "../views/tickets/Tickets.new.tsx";
import AuditLog from "../views/audit/AuditLog.tsx";
import Page404 from "../views/error-pages/Page404.tsx";
import Page401 from "../views/error-pages/Page401.tsx";
import LayoutRegister from "../views/shared/layoutLogin/LayoutRegister.tsx";
import ConfirmRegister from "../views/confirm-register/ConfirmRegister.tsx";

//Routes with login
export const routesAuthorized = () => {

    return createBrowserRouter([
        {
            path: "/",
            element: <Layout />,
            children: [
                {
                    path: "",
                    element:
                        <ProtectedRoute name="Home">
                            <Home />
                        </ProtectedRoute>
                },
                {
                    path: paths.profile,
                    element:
                        <ProtectedRoute name="Profile">
                            <Profile />
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
                            <UsersNew />
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
                            <UsersEdit />
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
                            <RolNew />
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
                            <RolEdit />
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
                            <MenuNew />
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
                            <MenuEdit />
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
                            <TicketTypeNew />
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
                            <TicketTypeEdit />
                        </ProtectedRoute>
                },
                {
                    path: paths.ticketStatus,
                    element:
                        <ProtectedRoute name="TicketStatus">
                            <TicketStatus />
                        </ProtectedRoute>,
                },
                {
                    path: paths.newTicketStatus,
                    element:
                        <ProtectedRoute name="TicketStatus">
                            <TicketStatusNew />
                        </ProtectedRoute>
                },
                {
                    path: paths.EditTicketStatus,
                    element:
                        <Navigate to={paths.ticketStatus}></Navigate>
                },
                {
                    path: paths.EditTicketStatusWithId,
                    element:
                        <ProtectedRoute name="TicketStatus">
                            <TicketStatusEdit />
                        </ProtectedRoute>
                },
                {
                    path: paths.ticketPriorities,
                    element:
                        <ProtectedRoute name="TicketPriority">
                            <TicketPriority />
                        </ProtectedRoute>,
                },
                {
                    path: paths.newTicketPriorities,
                    element:
                        <ProtectedRoute name="TicketPriority">
                            <TicketPriorityNew />
                        </ProtectedRoute>
                },
                {
                    path: paths.EditTicketPriorities,
                    element:
                        <Navigate to={paths.ticketPriorities}></Navigate>
                },
                {
                    path: paths.EditTicketPrioritiesWithId,
                    element:
                        <ProtectedRoute name="TicketPriority">
                            <TicketPriorityEdit />
                        </ProtectedRoute>
                },
                {
                    path: paths.Projects,
                    element:
                        <ProtectedRoute name="Projects">
                            <Projects />
                        </ProtectedRoute>
                },
                {
                    path: paths.newProject,
                    element:
                        <ProtectedRoute name="Projects">
                            <ProjectNew />
                        </ProtectedRoute>
                },
                {
                    path: paths.editProject,
                    element:
                        <Navigate to={paths.Projects}></Navigate>
                },
                {
                    path: paths.editProjectWithId,
                    element:
                        <ProtectedRoute name="Projects">
                            <ProjecEdit />
                        </ProtectedRoute>
                },
                {
                    path: paths.Tickets,
                    element:
                        <ProtectedRoute name="Tickets">
                            <Tickets />
                        </ProtectedRoute>
                },
                {
                    path: paths.newTicket,
                    element:
                        <ProtectedRoute name="Tickets">
                            <TicketsNew />
                        </ProtectedRoute>
                },
                {
                    path: paths.TicketsWithId,
                    element:
                        <ProtectedRoute name="Tickets">
                            <Tickets />
                        </ProtectedRoute>
                },
                {
                    path: paths.Audit,
                    element:
                        <ProtectedRoute name="AuditLogs">
                            <AuditLog />
                        </ProtectedRoute>
                }
            ],
        },
        {
            path: paths.unauthorized,
            element: <Page401 />
        },
        {
            path: "*",
            element: <Page404 />
        }
    ]);
};


//Routes without login
export const routesUnauthorized = () => {
    return createBrowserRouter([
        {
            path: "/",
            element: <LayoutLogin />,
        },
        {
            path: paths.register,
            element: <LayoutRegister />
        },
        {
            path: paths.resetPassword,
            element: <ResetPassword />
        },
        {
            path: paths.changePassword,
            element: <ChangePassword />
        },
        {
            path: paths.confirmRegister,
            element: <ConfirmRegister />
        },
        {
            path: paths.unauthorized,
            element: <Page401 />
        },
        {
            path: "*",
            element: <Page404 />
        }
    ]);
};
