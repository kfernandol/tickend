import { Dropdown } from 'primereact/dropdown';
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
//icons
import { ChevronDownIcon, ChevronDownIconProps } from 'primereact/icons/chevrondown';
//css
import '../../assets/css/flags.css'
//models
import { Languages } from '../../models/combobox/languages';
import { changeLanguage } from '../../redux/Slices/LanguageSlice';
import { i18next } from "../../i18n";

//List Languages
const languages: Array<Languages> = [
    {
        name: 'Español',
        code: 'es',
        flag: 'gt'
    },
    {
        name: "Ingles",
        code: 'en',
        flag: 'us'
    }
]

function LenguajeSelect() {
    const language = useSelector((state: RootState) => state.language);
    const [selectedLanguage, setSelectedLanguage] = useState<Languages>({ name: language.name, code: language.code, flag: language.flag });
    const dispatch = useDispatch();

    useEffect(() => {
        if (selectedLanguage) {
            i18next.changeLanguage(selectedLanguage.code)
            dispatch(changeLanguage(selectedLanguage));
        }

    }, [selectedLanguage]);

    useEffect(() => {
        i18next.changeLanguage(language.code)
    }, [language, selectedLanguage])

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
            <Dropdown value={selectedLanguage} onChange={(e) => setSelectedLanguage(e.value)} options={languages} optionLabel="name" placeholder="Select a Country"
                itemTemplate={languageOptionTemplate} className="w-full md:w-14rem"
                dropdownIcon={(opts: { iconProps: ChevronDownIconProps }) => {
                    return <ChevronDownIcon {...opts.iconProps} />;
                }}
            />
        </div>

    )
}

export default LenguajeSelect