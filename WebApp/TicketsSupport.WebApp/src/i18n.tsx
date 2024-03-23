import React from 'react';
import { useSelector } from 'react-redux';
import i18next from 'i18next';
import { initReactI18next, useTranslation } from 'react-i18next';
import { RootState } from './redux/store';

//ENG FILES
import GeneralEN from "./locales/en/general.json";
import SidebarEN from "./locales/en/sidebar.json";
import LanguagesEN from "./locales/en/languages.json";
import ErrorsEN from "./locales/en/errors.json";
import loginEN from "./locales/en/login.json";
import UsersEN from "./locales/en/users.json";
import RolesEN from "./locales/en/roles.json";

//ES FILE
import GeneralES from "./locales/es/general.json";
import SidebarES from "./locales/es/sidebar.json";
import LanguagesES from "./locales/es/languages.json";
import ErrorsES from "./locales/es/errors.json";
import loginES from "./locales/es/login.json";
import UsersES from "./locales/es/users.json";
import RolesES from "./locales/es/roles.json";


const resources = {
    en: {
        translation: { ...loginEN, ...UsersEN, ...SidebarEN, ...ErrorsEN, ...GeneralEN, ...LanguagesEN, ...RolesEN }
    },
    es: {
        translation: { ...loginES, ...UsersES, ...SidebarES, ...ErrorsES, ...GeneralES, ...LanguagesES, ...RolesES }
    }
}

function LanguageComponent({ children }) {
    const language = useSelector((state: RootState) => state.language);

    i18next
        .use(initReactI18next)
        .init({
            lng: "es",
            fallbackLng: 'es',
            resources,
            debug: false,
            interpolation: {
                escapeValue: false
            },
        });

    React.useEffect(() => {
        if (language) {
            i18next.changeLanguage(language.code)
        }
    }, [language]);


    return children;
}

export { LanguageComponent, i18next, useTranslation };
