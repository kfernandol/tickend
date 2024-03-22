import React, { useEffect, useState } from "react";
import './_header.css'
//Models
import { AuthToken } from "../../../models/tokens/token.model";
import { RootState } from "../../../redux/store";
import { Languages } from "../../../models/combobox/languages";
//componente
import { Menubar } from "primereact/menubar";
import { Avatar } from "primereact/avatar";
import { TieredMenu } from "primereact/tieredmenu";
import { Button } from "primereact/button";
//hooks
import { useDispatch, useSelector } from "react-redux";
import useTokenData from "../../../hooks/utils/useTokenData";
import { i18next, useTranslation } from "../../../i18n";
import { changeLanguage } from "../../../redux/LanguageSlice";
import { logout } from "../../../redux/AuthSlice";
import useToggle from "../../../hooks/utils/useToggle";

function _Header() {
  const { t } = useTranslation();
  const authenticated = useSelector((state: RootState) => state.auth);
  const getTokenData = useTokenData<AuthToken>(authenticated?.token);
  const language = useSelector((state: RootState) => state.language);
  const [selectedLanguage, setSelectedLanguage] = useState<Languages>({ name: language.name, code: language.code, flag: language.flag });
  const dispatch = useDispatch();
  const { toggleState, toggle } = useToggle();

  const showMenu = () => {
    const menubar = document.querySelector("#app-sidebar-2");
    menubar?.classList.remove("hidden");
  }

  useEffect(() => {
    const avatarMenu = document.querySelector("#headerMenu");

    if (toggleState === false)
      avatarMenu?.classList.remove("hidden");
    else
      avatarMenu?.classList.add("hidden");

  }, [toggleState])

  const languageOptionTemplate = (item) => {
    return (
      <div className="flex align-items-center p-2">
        <img alt={item.label} src="https://primefaces.org/cdn/primereact/images/flag/flag_placeholder.png" className={`mr-2 flag flag-${item.flag.toLowerCase()}`} style={{ width: '18px' }} />
        <div>{item.label}</div>
      </div>
    );
  };

  useEffect(() => {
    document.addEventListener("click", (event: MouseEvent) => {

      const headerMenu = document.getElementById('headerMenu');
      const headerAvatar = document.getElementById('headerAvatar');
      const target = event.target as HTMLElement;

      //click in avatar
      if (headerAvatar && (headerAvatar.contains(target) || target.closest(`#${headerAvatar.id}`))) {
        return;
      }

      //click outsite menu
      if (headerMenu && !headerMenu.contains(target)) {
        toggle();
        return;
      }
    })
  }, [])

  const Logout = () => {
    dispatch(logout());
  }

  const start = (
    <>
      <Button id="btnMenu" icon="pi pi-bars" severity="info" aria-label="Bookmark" onClick={showMenu} />
    </>
  );

  const end = (
    <div className="flex align-items-center gap-2 m-1">
      <span className="text-xl">{getTokenData != null ? getTokenData.name : ""}</span>
      <Avatar id="headerAvatar" className="p-1" size="large" image="https://primefaces.org/cdn/primevue/images/avatar/amyelsner.png" shape="circle" onClick={toggle} />
    </div>
  );

  const languages: Array<Languages> = [
    {
      name: t("languagesSpanish"),
      code: 'es',
      flag: 'gt'
    },
    {
      name: t("languagesEnglish"),
      code: 'en',
      flag: 'us'
    }
  ]

  const Menuitems = [
    {
      label: t("GlobalMenuTextProfile"),
      icon: 'pi pi-user'
    },
    {
      label: t("GlobalMenuTextAvatarLanguages"),
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
      label: t("sidebarLogout"),
      icon: 'pi pi-sign-out',
      command: () => {
        Logout();
      }
    },
  ];

  useEffect(() => {
    if (selectedLanguage) {
      i18next.changeLanguage(selectedLanguage.code)
      dispatch(changeLanguage(selectedLanguage));
    }

  }, [selectedLanguage]);

  return (
    <>
      <div className="card relative">
        <Menubar start={start} end={end} style={{ backgroundColor: "#17212f2D", borderLeft: "none", borderTop: "none", borderRight: "none" }} />
        <div className="absolute right-0 top-50 mt-4 z-1">
          <TieredMenu id="headerMenu" className="hidden" model={Menuitems} breakpoint="767px" />
        </div>
      </div>
    </>
  );
}

export default _Header;
