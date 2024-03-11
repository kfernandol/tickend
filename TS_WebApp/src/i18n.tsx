import React from 'react';
import { useSelector } from 'react-redux';
import i18next from 'i18next';
import { initReactI18next, useTranslation } from 'react-i18next';

import loginEN from "./locales/en/login.json";
import UsersEN from "./locales/en/users.json";
import SidebarEN from "./locales/en/sidebar.json";

import loginES from "./locales/es/login.json";
import UsersES from "./locales/es/users.json";
import SidebarES from "./locales/es/sidebar.json";
import { RootState } from './redux/store';

const resources = {
    en: {
        translation: { ...loginEN, ...UsersEN, ...SidebarEN }
    },
    es: {
        translation: { ...loginES, ...UsersES, ...SidebarES }
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
