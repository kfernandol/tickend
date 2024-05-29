import { useEffect, useRef, useState } from "react";
import './Header.css'
import { paths } from "../../../../routes/paths";
//componente
import { Menubar } from "primereact/menubar";
import { Avatar } from "primereact/avatar";
import { TieredMenu } from "primereact/tieredmenu";
import { MenuItem } from "primereact/menuitem";
import { BreadCrumb } from "primereact/breadcrumb";
import { CascadeSelectChangeEvent } from "primereact/cascadeselect";
//hooks
import { useDispatch, useSelector } from "react-redux";
import useTokenData from "../../../../hooks/useTokenData";
import { i18next, useTranslation } from "../../../../i18n";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useGet } from "../../../../services/api_services";
//redux
import { changeLanguage } from "../../../../redux/Slices/LanguageSlice";
import { logout } from "../../../../redux/Slices/AuthSlice";
import { RootState } from "../../../../redux/store";
//Models
import { AuthToken } from "../../../../models/tokens/token.model";
import { Languages } from "../../../../models/combobox/languages";
import { UserResponse } from "../../../../models/responses/users.response";
import { BreadCrumbModel } from "../../../../models/breadcrumb/breadcrumb.model";
import OrganizationSelect from "../../../../components/organizationSelect/OrganizationSelect";



function Header() {
    //Ref
    const AvatarMenu = useRef<TieredMenu>(null);
    //redux
    const language = useSelector((state: RootState) => state.language);
    const authenticated = useSelector((state: RootState) => state.auth);
    const getTokenData = useTokenData<AuthToken>(authenticated?.token);
    const dispatch = useDispatch();

    //hooks
    const navigate = useNavigate();
    const location = useLocation();
    const { SendGetRequest } = useGet<UserResponse>()
    const [breadcrumbItems, setBreadcrumbItems] = useState<BreadCrumbModel[]>();
    const [selectedLanguage, setSelectedLanguage] = useState<Languages>({ name: language.name, code: language.code, flag: language.flag });
    const [AvatarIMG, setAvatarIMG] = useState<string>("/src/assets/imgs/avatar-default.png");
    const [FullName, setFullName] = useState<string>("");


    //translations
    const { t } = useTranslation();
    const SpanishTxt = t("languages.es");
    const EnglishTxt = t("languages.en");
    const ProfileTxt = t("avatarMenu.profile");
    const LanguagesTxt = t("avatarMenu.languages");
    const LogoutTxt = t("sidebar.logout");

    //Variables
    const languages: Array<Languages> = [
        {
            name: SpanishTxt,
            code: 'es',
            flag: 'gt'
        },
        {
            name: EnglishTxt,
            code: 'en',
            flag: 'us'
        }
    ];
    const home = { icon: 'pi pi-home', url: '/' };

    // load element to BreadCrumb
    useEffect(() => {
        const paths = location.pathname.split('/').filter((path) => path !== '');

        const breadcrumbItems = paths.map((segment, index) => {
            const routePath = `/${paths.slice(0, index + 1).join('/')}`;

            const item: BreadCrumbModel = {
                label: segment,
                template: () => <Link to={routePath} className="no-underline text-gray-900"><span>{segment}</span></Link>
            }
            return item;
        });

        setBreadcrumbItems(breadcrumbItems)
    }, [location])

    const showSidebar = () => {
        const menubar = document.querySelector("#app-sidebar-2");
        menubar?.classList.remove("hidden");
    }

    useEffect(() => {
        const requests = [
            SendGetRequest("v1/users/" + getTokenData?.id),
        ]

        requests.forEach((request) => {
            Promise.resolve(request)
                .then((response) => {
                    let user;
                    switch (response.url) {
                        case "v1/users/" + getTokenData?.id:
                            user = response.data as UserResponse;
                            setFullName(user.firstName + " " + user.lastName);

                            //set Avatar
                            if (user.photo && user.photo !== "")
                                setAvatarIMG(user.photo)
                            else
                                setAvatarIMG("/src/assets/imgs/avatar-default.png")
                            break;
                    }
                })
        })
    }, []);

    //OnChange Language
    useEffect(() => {
        if (selectedLanguage) {
            i18next.changeLanguage(selectedLanguage.code)
            dispatch(changeLanguage(selectedLanguage));
        }

    }, [selectedLanguage]);

    const Logout = () => {
        dispatch(logout());
    }

    const languageOptionTemplate = (item: { label: string, flag: string }) => {
        return (
            <div className="flex align-items-center p-2">
                <img alt={item.label} src="/src/assets/imgs/flags_placeholder.png" className={`mr-2 flag flag-${item.flag.toLowerCase()}`} style={{ width: '18px' }} />
                <div>{item.label}</div>
            </div>
        );
    };



    const handlerOrganizationChange = (e: CascadeSelectChangeEvent) => {
        const currentTarget = e.value;
        console.log(currentTarget)
    }

    const MenubarStart = (
        <div className="w-full flex justify-content-between">
            <div className="flex align-items-center">
                <i id="MenuBtn" className="pi pi-bars mx-3 cursor-pointer" style={{ fontSize: "1.5rem" }} onClick={showSidebar} />
                <BreadCrumb
                    home={home}
                    model={breadcrumbItems}
                    style={{ backgroundColor: "#FFFFFF00" }}
                    pt={{
                        menuitem: { className: "text-gray-900" },
                        label: { className: "text-gray-900 text-xl" },
                        menu: { className: "text-gray-900" },
                        icon: { className: "text-xl" },
                        root: { className: "hidden md:block border-none py-0" }
                    }} />
            </div>
            <OrganizationSelect onChange={(e) => handlerOrganizationChange(e)} />
        </div>
    );

    const MenubarEnd = (
        <div className="flex align-items-center gap-2 m-1">
            <span className="text-xl">{FullName}</span>
            <Avatar id="headerAvatar" className="p-1" size="xlarge" image={AvatarIMG} shape="circle" onClick={(event) => AvatarMenu != null && AvatarMenu.current != null ? AvatarMenu.current.toggle(event) : ''} />
        </div>
    );



    const MenuAvatarItems = [
        {
            label: ProfileTxt,
            icon: 'pi pi-user',
            command: () => { navigate(paths.profile); }
        },
        {
            label: LanguagesTxt,
            icon: 'pi pi-file',
            items: [
                {
                    label: languages[0].name,
                    icon: 'pi pi-plus',
                    flag: languages[0].flag,
                    template: languageOptionTemplate,
                    command: () => {
                        setSelectedLanguage(languages[0])
                    }
                },
                {
                    label: languages[1].name,
                    icon: 'pi pi-print',
                    flag: languages[1].flag,
                    template: languageOptionTemplate,
                    command: () => {
                        setSelectedLanguage(languages[1])
                    }
                }
            ]
        },
        {
            separator: true
        },
        {
            label: LogoutTxt,
            icon: 'pi pi-sign-out',
            command: () => {
                Logout();
            }
        },
    ];



    return (
        <>
            <div className="relative h-full">
                <Menubar
                    className="h-full w-full"
                    start={MenubarStart}
                    end={MenubarEnd}
                    style={{ backgroundColor: "#FFFFFF00" }}
                    pt={{ start: { className: "w-6 flex justify-content-start" } }} />
                <TieredMenu model={MenuAvatarItems as MenuItem[]} popup ref={AvatarMenu} />
            </div>
        </>
    );
}

export default Header;
