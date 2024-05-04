import { useEffect, useRef, useState } from "react";
import './Header.css'
import { paths } from "../../../../routes/paths";
//componente
import { Menubar } from "primereact/menubar";
import { Avatar } from "primereact/avatar";
import { Button } from "primereact/button";
import { TieredMenu } from "primereact/tieredmenu";
import { MenuItem } from "primereact/menuitem";
//hooks
import { useDispatch, useSelector } from "react-redux";
import useTokenData from "../../../../hooks/useTokenData";
import { i18next, useTranslation } from "../../../../i18n";
import { useNavigate } from "react-router-dom";
import { useGet } from "../../../../services/api_services";
//redux
import { changeLanguage } from "../../../../redux/Slices/LanguageSlice";
import { logout } from "../../../../redux/Slices/AuthSlice";
import { RootState } from "../../../../redux/store";
//Models
import { AuthToken } from "../../../../models/tokens/token.model";
import { Languages } from "../../../../models/combobox/languages";
import { UserResponse } from "../../../../models/responses/users.response";

function Header() {
    //Ref
    const AvatarMenu= useRef<TieredMenu>(null);
    //redux
    const language = useSelector((state: RootState) => state.language);
    const authenticated = useSelector((state: RootState) => state.auth);
    const getTokenData = useTokenData<AuthToken>(authenticated?.token);
    const dispatch = useDispatch();

    //hooks
    const navigate = useNavigate();
    const { SendGetRequest, getResponse } = useGet<UserResponse>()

    //translations
    const { t } = useTranslation();
    const SpanishTxt = t("languages.es");
    const EnglishTxt = t("languages.en");
    const ProfileTxt = t("avatarMenu.profile");
    const LanguagesTxt = t("avatarMenu.languages");
    const LogoutTxt = t("sidebar.logout");

    //Variables
    const [selectedLanguage, setSelectedLanguage] = useState<Languages>({ name: language.name, code: language.code, flag: language.flag });
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
    const [AvatarIMG, setAvatarIMG] = useState<string>("/src/assets/imgs/avatar-default.png");
    const [FullName, setFullName] = useState<string>("");

    const showSidebar = () => {
        const menubar = document.querySelector("#app-sidebar-2");
        menubar?.classList.remove("hidden");
    }

    //request user data
    useEffect(() => {
        SendGetRequest("v1/users/" + getTokenData?.id);
    }, [])

    //Load user data

    useEffect(() => {

        if (getResponse) {
            if ('firstName' in getResponse) {
                const response = getResponse as UserResponse;
                setAvatarIMG(`data:image/*;base64,${response.photo}`)
                setFullName(response.firstName + " " + response.lastName);
            } else {
                setAvatarIMG("src/assets/imgs/avatar-default.png")
            }
        }

    }, [getResponse]);

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

    const MenubarStart = (
        <Button id="btnMenu" icon="pi pi-bars" severity="info" aria-label="Bookmark" onClick={showSidebar} />
    );

    const MenubarEnd = (
        <div className="flex align-items-center gap-2 m-1">
            <span className="text-xl">{FullName}</span>
            <Avatar id="headerAvatar" className="p-1" size="large" image={AvatarIMG} shape="circle" onClick={(event) => AvatarMenu != null && AvatarMenu.current != null ? AvatarMenu.current.toggle(event) : ''} />
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
            <div className="card relative">
                <Menubar start={MenubarStart} end={MenubarEnd} style={{ backgroundColor: "#17212f2D", borderLeft: "none", borderTop: "none", borderRight: "none" }} />
                <TieredMenu model={MenuAvatarItems as MenuItem[]} popup ref={AvatarMenu} />
            </div>
        </>
    );
}

export default Header;
