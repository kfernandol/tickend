/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
import { ReactNode, useEffect, useRef, useState } from "react";
//css
import "./Sidebar.css"
//Components
import { Ripple } from "primereact/ripple";
import { StyleClass } from "primereact/styleclass";
import { Button } from "primereact/button";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../../../redux/Slices/AuthSlice";
import { Link } from "react-router-dom";
import { paths } from "../../../../routes/paths";
//redux
import { RootState } from "../../../../redux/store";
import { AuthToken } from "../../../../models/tokens/token.model";
//hooks
import { useTranslation } from "react-i18next";
import { useGet } from "../../../../services/api_services";
import useTokenData from "../../../../hooks/useTokenData";
//models
import { MenusResponse } from "../../../../models/responses/menus.response";

function Sidebar() {
    const sidebar = document.querySelector("#app-sidebar-2");
    //Translation
    const { t } = useTranslation();
    const Dashboard = t("navigation.Dashboard");
    const [MenusTranslation, setMenusTranslation] = useState<{ name: string, value: string }[]>([]);
    const LogoutTxt = t("sidebar.logout");

    //Redux Data
    const dispatch = useDispatch();
    const authenticated = useSelector((state: RootState) => state.auth);
    const getTokenData = useTokenData<AuthToken>(authenticated?.token);

    //Api Request
    const { SendGetRequest, getResponse } = useGet<MenusResponse[]>();
    const [Menus, setMenus] = useState<MenusResponse[]>([]);

    //Menu ref
    const menuRef = useRef<HTMLDivElement[]>([]);

    //Request Data
    useEffect(() => {
        SendGetRequest("v1/menus/byuser/" + getTokenData?.id);
    }, [])

    //Process response
    useEffect(() => {
        if (getResponse) {
            const response = getResponse as MenusResponse[];
            setMenus(response);
        }
    }, [getResponse])

    //load translation
    useEffect(() => {
        if (Menus) {
            setMenusTranslation(Menus.map(x => ({ name: x.name, value: t("navigation." + x.name) })));
        }
    }, [Menus, t])

    const hideSidebar = () => {
        sidebar?.classList.add("hidden");
    }

    const Logout = () => {
        dispatch(logout());
    }

    return (
        <div style={{ width: "auto", position: "relative" }} className="h-full">
            <div id="app-sidebar-container" className="min-h-screen h-full flex relative w-full" >
                <div
                    id="app-sidebar-2"
                    className="hidden flex-shrink-0 absolute left-0 top-0 z-1 surface-border select-none w-full"
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
                                        <span className="font-medium">{Dashboard}</span>
                                        <Ripple />
                                    </Link>

                                    {Menus.filter(x => x.parentId === null && x.show === true).sort((a, b) => a.position - b.position).map((menu, index) => {
                                        return (
                                            <div key={menu.name + index}>
                                                <StyleClass
                                                    nodeRef={menuRef[index as keyof ReactNode]}
                                                    selector="@next"
                                                    enterClassName="hidden"
                                                    enterActiveClassName="slidedown"
                                                    leaveToClassName="hidden"
                                                    leaveActiveClassName="slideup"
                                                >
                                                    <div ref={(element) => (menuRef[index as keyof ReactNode] as HTMLDivElement) = element as HTMLDivElement} className="p-ripple p-3 flex align-items-center justify-content-between text-600 cursor-pointer">
                                                        <span className="font-medium">{MenusTranslation.find(x => x.name == menu.name)?.value}</span>
                                                        <i className={`pi pi-chevron-down`}></i>
                                                        <Ripple />
                                                    </div>
                                                </StyleClass>
                                                <ul className="list-none py-0 pl-3 pr-0 m-0 hidden overflow-y-hidden transition-all transition-duration-400 transition-ease-in-out">
                                                    {Menus.filter(x => x.parentId === menu.id && x.show === true).sort((a, b) => a.position - b.position).map((submenu, index) => (
                                                        <li key={submenu.name + index}>
                                                            <Link to={submenu.url} className="p-ripple no-underline flex align-items-center cursor-pointer p-3 border-round text-700 hover:surface-100 transition-duration-150 transition-colors w-full">
                                                                <i className={`mr-2 pi ${submenu.icon}`}></i>
                                                                <span className="font-medium">{MenusTranslation.find(x => x.name == submenu.name)?.value}</span>
                                                                <Ripple />
                                                            </Link>
                                                        </li>
                                                    ))}
                                                </ul>

                                            </div>
                                        );
                                    })}
                                </li>
                            </ul>

                        </div>
                        <div className="mt-auto">
                            <hr className="mb-3 mx-3 border-top-1 border-none surface-border" />
                            <div className="flex justify-content-center">
                                <Button label={LogoutTxt} className="w-7" severity="info" text icon="pi pi-sign-out" onClick={Logout} />
                            </div>
                        </div>
                    </div>
                </div >
            </div >
        </div >
    );
}

export default Sidebar;
