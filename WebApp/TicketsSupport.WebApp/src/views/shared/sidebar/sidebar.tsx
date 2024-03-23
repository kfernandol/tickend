import React, { useRef } from "react";
//css
import "./sidebar.css"
//Components
import { Ripple } from "primereact/Ripple";
import { StyleClass } from "primereact/StyleClass";
import { Button } from "primereact/button";
import { useDispatch } from "react-redux";
import { logout } from "../../../redux/AuthSlice";
import { Link } from "react-router-dom";
import { paths } from "../../../routes/paths";
//hooks
import { useTranslation } from "react-i18next";

function Sidebar() {
  const btnRef1 = useRef(null);
  const dispatch = useDispatch();
  const sidebar = document.querySelector("#app-sidebar-2");
  const { t } = useTranslation();

  const hideSidebar = () => {
    sidebar?.classList.add("hidden");
  }



  const Logout = () => {
    dispatch(logout());
  }

  return (
    <div style={{ width: "auto", position: "relative" }} className="h-full">
      <div id="app-sidebar-container" className="min-h-screen h-full flex relative" >
        <div
          id="app-sidebar-2"
          className="hidden flex-shrink-0 absolute left-0 top-0 z-1 surface-border select-none"
          style={{ width: "280px" }}
        >
          <div className="flex flex-column h-full relative">
            <div className="flex align-items-center justify-content-between p-3">
              <span className="inline-flex align-items-center gap-2 ">
                <span className="font-semibold text-2xl text-primary">Your Logo</span>
                <Button id="btnMenuSidebar" className="absolute right-0 mr-2" icon="pi pi-bars" severity="info" aria-label="Bookmark" onClick={hideSidebar} />
              </span>
            </div>
            {/* Menu List */}
            <div className="overflow-y-auto">
              <ul className="list-none p-3 m-0">
                <li>
                  <Link to={paths.home} className="p-ripple no-underline flex align-items-center cursor-pointer p-3 border-round text-700 hover:surface-100 transition-duration-150 transition-colors w-full">
                    <i className="pi pi-home mr-2"></i>
                    <span className="font-medium">Dashboard</span>
                    <Ripple />
                  </Link>
                  <StyleClass
                    nodeRef={btnRef1}
                    selector="@next"
                    enterClassName="hidden"
                    enterActiveClassName="slidedown"
                    leaveToClassName="hidden"
                    leaveActiveClassName="slideup"
                  >
                    <div ref={btnRef1} className="p-ripple p-3 flex align-items-center justify-content-between text-600 cursor-pointer">
                      <span className="font-medium">Security</span>
                      <i className="pi pi-chevron-down"></i>
                      <Ripple />
                    </div>
                  </StyleClass>
                  <ul className="list-none p-0 m-0 overflow-hidden">
                    <li>
                      <Link to={paths.users} className="p-ripple no-underline flex align-items-center cursor-pointer p-3 border-round text-700 hover:surface-100 transition-duration-150 transition-colors w-full">
                        <i className="pi pi-bookmark mr-2"></i>
                        <span className="font-medium">Users</span>
                        <Ripple />
                      </Link>
                    </li>
                    <li>
                      <Link to={paths.roles} className="p-ripple no-underline flex align-items-center cursor-pointer p-3 border-round text-700 hover:surface-100 transition-duration-150 transition-colors w-full">
                        <i className="pi pi-bookmark mr-2"></i>
                        <span className="font-medium">Roles</span>
                        <Ripple />
                      </Link>
                    </li>
                  </ul>
                </li>
              </ul>

            </div>
            <div className="mt-auto">
              <hr className="mb-3 mx-3 border-top-1 border-none surface-border" />
              <div className="flex justify-content-center">
                <Button label={t("sidebarLogout")} className="w-7" severity="info" text icon="pi pi-sign-out" onClick={Logout} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Sidebar;
