import { ReactNode, useEffect } from 'react';
import i18next from 'i18next';
//hooks
import { initReactI18next, useTranslation } from 'react-i18next';
//redux
import { RootState } from './redux/store';
import { useSelector } from 'react-redux';

//Resources Files
import enTranslations from './locales/en.json';
import esTranslations from './locales/es.json';

interface props {
    children: ReactNode
}
function LanguageComponent(props: props) {
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

    useEffect(() => {
        if (language) {
            i18next.changeLanguage(language.code)
        }
    }, [language]);


    return props.children;
}

export { LanguageComponent, i18next, useTranslation };
