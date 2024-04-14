import React from 'react';
import i18next from 'i18next';
//hooks
import { initReactI18next, useTranslation } from 'react-i18next';
//redux
import { RootState } from './redux/store';
import { useSelector } from 'react-redux';

//Resources Files
import enTranslations from './locales/en.json';
import esTranslations from './locales/es.json';


function LanguageComponent({ children }) {
    const language = useSelector((state: RootState) => state.language);
    i18next
        .use(initReactI18next)
        .init({
            lng: "es",
            fallbackLng: 'en',
            resources: {
                en: {
                    translation: enTranslations,
                },
                es: {
                    translation: esTranslations,
                },
            },
            supportedLngs: ["en", "es"],
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
