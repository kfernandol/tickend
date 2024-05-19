import { useEffect, useRef, useState } from "react";
//css
import "./Sidebar.css"
//imgs
import logoBlack from "../../../../../src/assets/logo-black.svg";
import logoBlackCrop from "../../../../../src/assets/logo-black-crop.svg";
//Components
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Menu } from "primereact/menu";
import { MenuItem } from "primereact/menuitem";
//redux
import { RootState } from "../../../../redux/store";
import { AuthToken } from "../../../../models/tokens/token.model";
//hooks
import { useTranslation } from "react-i18next";
import { useGet } from "../../../../services/api_services";
import useTokenData from "../../../../hooks/useTokenData";
//models
import { MenusResponse } from "../../../../models/responses/menus.response";
import { Tooltip } from "primereact/tooltip";
import { Button } from "primereact/button";

function Sidebar() {
    //Translation
    const { t } = useTranslation();
    const Dashboard = t("navigation.Dashboard");
    const HomeTxt = t("navigation.Home");
    const [MenusTranslation, setMenusTranslation] = useState<{ name: string, value: string }[]>([]);
    //Redux Data
    const authenticated = useSelector((state: RootState) => state.auth);
    const getTokenData = useTokenData<AuthToken>(authenticated?.token);
    //Api Request
    const { SendGetRequest } = useGet<MenusResponse[]>();
    const [Menus, setMenus] = useState<MenusResponse[] | null>(null);
    const [MenuItems, setMenusItems] = useState<MenuItem[] | undefined>();
    //Hooks
    const navigate = useNavigate();
    const tooltipRef = useRef<Tooltip | null>(null);

    //Request Data
    useEffect(() => {
        SendGetRequest("v1/menus/byuser/" + getTokenData?.id).then((response) => {
            setMenus(response.data as MenusResponse[]);
        });
    }, [])

    //load translation
    useEffect(() => {
        if (Menus) {
            setMenusTranslation(Menus.map(x => ({ name: x.name, value: t("navigation." + x.name) })));
        }
    }, [Menus, t])

    //Process data
    useEffect(() => {
        if (Menus && MenusTranslation) {
            //Create home menu
            const menuHome: MenuItem = {
                label: Dashboard,
                items: [
                    {
                        label: HomeTxt,
                        "icon": "pi pi-home",
                        command: () => { navigate("/"); }
                    }
                ]
            }

            //create all menus
            const menus: MenuItem[] = Menus.filter(x => x.parentId === null && x.show === true).sort((a, b) => a.position - b.position).map((menu) => ({
                label: MenusTranslation.find(x => x.name == menu.name)?.value,
                items: Menus?.filter(x => x.parentId === menu.id && x.show === true).sort((a, b) => a.position - b.position).map((submenu) => ({
                    icon: submenu.icon,
                    label: MenusTranslation.find(x => x.name == submenu.name)?.value,
                    command: () => { navigate(submenu.url); }
                }))
            }));

            const combinedMenuItems: MenuItem[] = [menuHome, ...menus];
            setMenusItems(combinedMenuItems);
        }
    }, [Menus, MenusTranslation]);

    //Add Events
    useEffect(() => {
        const menuBtn = document.getElementById("MenuBtn");
        const menuBtnSidebar = document.getElementById("menuBtnInSidebar");
        const sideBar: HTMLDivElement | null = document.querySelector(".Sidebar");

        //Add event closed sidebar onclick menu
        if (sideBar) {
            const menuItems = sideBar.querySelectorAll(".p-menuitem");

            if (menuItems)
                menuItems.forEach((item) => {
                    item.addEventListener("click", () => {
                        sideBar.style.display = "none";
                    })
                });
        }

        //addEvent onclick menuBtn
        if (menuBtn)
            menuBtn.addEventListener("click", HandlerOnClickBtnMenu);
        if (menuBtnSidebar)
            menuBtnSidebar.addEventListener("click", HandlerOnClickBtnMenu);

        // Limpieza del event listener al desmontar el componente
        return () => {
            if (menuBtn)
                menuBtn.removeEventListener("click", HandlerOnClickBtnMenu);
            if (menuBtnSidebar)
                menuBtnSidebar.removeEventListener("click", HandlerOnClickBtnMenu);

        };
    }, []);


    const HandlerOnClickBtnMenu = () => {
        const container: HTMLDivElement | null = document.querySelector(".container");
        const sideBar: HTMLDivElement | null = document.querySelector(".Sidebar");
        const logoImg: HTMLImageElement | null = document.querySelector("#sidebarLogo");
        const logoContainer: HTMLDivElement | null = document.querySelector("#sidebarLogoContainer");
        const tagsHeaderSidebar: NodeListOf<HTMLLIElement> = document.querySelectorAll(".p-menu .p-menu-list .p-submenu-header");
        const menuItemContainerSidebar: NodeListOf<HTMLLIElement> = document.querySelectorAll(".p-menu .p-menu-list .p-menuitem");
        const menuItemContentSidebar: NodeListOf<HTMLLIElement> = document.querySelectorAll(".p-menu .p-menu-list .p-menuitem .p-menuitem-content");
        const menuItemTextSidebar: NodeListOf<HTMLSpanElement> = document.querySelectorAll(".p-menu .p-menu-list .p-menuitem .p-menuitem-text");
        const menuItemIconSidebar: NodeListOf<HTMLSpanElement> = document.querySelectorAll(".p-menu .p-menu-list .p-menuitem .p-menuitem-icon");

        if (container && sideBar && window.innerWidth > 576) //Tablet and PC
        {
            container.offsetHeight;
            if (container.style.gridTemplateColumns === '300px calc(100% - 300px)' || container.style.gridTemplateColumns === '') //Contract 
            {
                container.style.gridTemplateColumns = '60px calc(100% - 60px)';
                sideBar.style.width = "60px";
                container.style.transition = "grid-template-columns 0.50s ease-in-out";

                if (logoImg) {
                    logoImg.src = logoBlackCrop
                    logoImg.style.maxHeight = "40px";
                }


                if (logoContainer) {
                    logoContainer.style.setProperty('padding-left', '.75rem', 'important');
                    logoContainer.style.setProperty('padding-right', '.75rem', 'important');
                }

                //hidden title menus
                if (tagsHeaderSidebar) {
                    tagsHeaderSidebar.forEach((tag) => {
                        tag.style.display = "none";
                    })
                }

                //hidden name menus
                if (menuItemTextSidebar) {
                    menuItemTextSidebar.forEach((text) => {
                        text.style.display = "none";
                    })
                }

                //Center Icon
                if (menuItemIconSidebar) {
                    menuItemIconSidebar.forEach((icon) => {
                        icon.style.margin = ".25rem auto";

                    });
                }

                //add Tooltip
                if (menuItemContainerSidebar) {
                    menuItemContainerSidebar.forEach((item) => {
                        const tooltipText = item.querySelector(".p-menuitem-content")?.querySelector(".p-menuitem-link")?.querySelector(".p-menuitem-text")?.textContent;
                        const tooltipIcon = item.querySelector(".p-menuitem-content")?.querySelector(".p-menuitem-link")?.querySelector(".p-menuitem-icon");

                        if (tooltipIcon) {
                            tooltipIcon.setAttribute("data-pr-tooltip", tooltipText ?? "")
                            tooltipIcon.setAttribute("data-pr-position", "right");
                        }
                        if (tooltipRef.current) {
                            tooltipRef.current.updateTargetEvents();
                        }
                    });
                }

                //Menu item remove margin
                if (menuItemContainerSidebar) {
                    menuItemContainerSidebar.forEach((item) => {
                        item.style.setProperty('margin-left', '0px', 'important');
                    })
                }

            }
            else //Sidebar Expand
            {
                container.style.gridTemplateColumns = '300px calc(100% - 300px)';
                sideBar.style.width = "300px";
                container.style.transition = "grid-template-columns 0.10s ease-in-out";

                if (logoImg)
                    logoImg.src = logoBlack;

                //show title menus
                if (tagsHeaderSidebar) {
                    tagsHeaderSidebar.forEach((tag) => {
                        tag.style.display = "block";
                    })
                }

                //show name menus
                if (menuItemTextSidebar) {
                    menuItemTextSidebar.forEach((text) => {
                        text.style.display = "block";
                    })
                }

                //default margin
                if (menuItemIconSidebar) {
                    menuItemIconSidebar.forEach((icon) => {
                        icon.style.margin = "0";
                    });
                }

                //Menu item add default margin
                if (menuItemContainerSidebar) {
                    menuItemContainerSidebar.forEach((item) => {
                        item.style.setProperty('margin-left', '2rem', 'important');
                    })
                }

                //remove Tooltip
                if (menuItemContentSidebar) {
                    menuItemContentSidebar.forEach((itemContent) => {
                        itemContent.removeAttribute("data-pr-tooltip")
                        itemContent.removeAttribute("data-pr-position");
                        if (tooltipRef.current) {
                            tooltipRef.current.updateTargetEvents();
                        }
                    });
                }
            }
        }
        else if (container && sideBar && window.innerWidth < 576) // Mobile Sidebar
        {
            const sidebarStyle = sideBar.style.display;
            if (sidebarStyle !== "" && sidebarStyle === "block")
                sideBar.style.display = "none";
            else
                sideBar.style.display = "block";
        }
    };

    return (
        <>
            <div className="flex flex-column justify-content-start align-items-start h-full bg-white">
                <div id="sidebarLogoContainer" className="flex w-full py-3 px-5 bg-white">
                    <img id="sidebarLogo" className="w-full" alt="logo.png" src={logoBlack} ></img>
                </div>
                <div className="w-full relative bg-white h-full">
                    <Menu
                        model={MenuItems}
                        pt={{
                            root: { className: "w-full h-full" },
                            submenuHeader: { className: "layout-menuitem-root-text text-sm py-1 text-gray-400 font-semibold" },
                            menuitem: { className: "ml-5" },
                            action: { className: "px-0 py-2 mt-2 mb-3" },
                            icon: { className: "text-2xl mr-4" }
                        }} />
                    <Button id="menuBtnInSidebar" className="absolute top-0 ml-5 bg-white hidden" icon="pi pi-angle-double-left" rounded text raised style={{ right: "-20px" }} />
                    <Tooltip ref={tooltipRef} target=".p-menuitem-icon" content="" position={"top"} event={"both"} className="ml-4" />
                </div>

            </div>
        </>

    );
}

export default Sidebar;
