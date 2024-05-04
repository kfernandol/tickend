import { Dropdown } from 'primereact/dropdown';
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import { i18next, useTranslation } from "../../i18n";
//icons
import { ChevronDownIcon, ChevronDownIconProps } from 'primereact/icons/chevrondown';
//css
import '../../assets/css/flags.css'
//models
import { Languages } from '../../models/combobox/languages';
import { changeLanguage } from '../../redux/Slices/LanguageSlice';



function LenguajeSelect() {
    const language = useSelector((state: RootState) => state.language);
    const dispatch = useDispatch();

    //Translations
    const { t } = useTranslation();
    const SpanishTxt = t("languages.es");
    const EnglishTxt = t("languages.en");
    const SelectLanguageTxt = t("selects.languages");

    useEffect(() => {
        i18next.changeLanguage(language.code)
        console.log(language)
    }, [language])

    //List Languages
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
    ]

    const HandlerOnChangeLanguage = (languageCode: string) => {
        const languageSelected = languages.find(x => x.code == languageCode)
        dispatch(changeLanguage(languageSelected))
    }

    const languageOptionTemplate = (option: { name: string, flag: string }) => {
        return (
            <div className="flex align-items-center">
                <img alt={option.name} src="/src/assets/imgs/flags_placeholder.png" className={`mr-2 flag flag-${option.flag.toLowerCase()}`} style={{ width: '18px' }} />
                <div>{option.name}</div>
            </div>
        );
    };

    return (
        <div className='absolute bottom-0 right-0'>
            <Dropdown value={language.code} onChange={(e) => HandlerOnChangeLanguage(e.value)} options={languages} optionLabel="name" optionValue="code" placeholder={SelectLanguageTxt}
                itemTemplate={languageOptionTemplate} className="w-full md:w-14rem"
                dropdownIcon={(opts: { iconProps: ChevronDownIconProps }) => {
                    return <ChevronDownIcon {...opts.iconProps} />;
                }}
            />
        </div>

    )
}

export default LenguajeSelect