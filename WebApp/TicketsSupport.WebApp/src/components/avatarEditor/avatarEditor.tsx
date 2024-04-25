import { ChangeEvent, useEffect, useRef, useState } from 'react'
//css
import "./avatarEditor.css";
//components
import { Avatar } from 'primereact/avatar'
import { Toast } from 'primereact/toast';
import { useTranslation } from 'react-i18next';

type Props = {
    onChangeAvatar: (file: File) => void;
    PhotoBase64?: string
}

export default function AvatarEditor(props: Props) {
    const SizeLimitBits = 8000000; //5 MB
    //hooks
    const [AvatarIMG, setAvatarIMG] = useState<string | ArrayBuffer | null>("/src/assets/imgs/avatar-default.png");
    const toast = useRef<Toast>(null);
    //translation
    const { t } = useTranslation();
    const errorFileSizeTitle = t("profile.errors.fileSize.title");
    const errorFileSizeMessage = t("profile.errors.fileSize.message");

    const fileUploaded = (event: ChangeEvent<HTMLInputElement>) => {
        const files = event.currentTarget.files;
        if (files && files[0].size <= SizeLimitBits) {
            const file = files[0];
            const reader = new FileReader();
            reader.onloadend = function () {
                setAvatarIMG(reader.result);
                props.onChangeAvatar(file)
            }
            if (file) {
                reader.readAsDataURL(file);
            } else {
                setAvatarIMG("/src/assets/imgs/avatar-default.png");
            }
        } else {
            toast?.current?.show({
                severity: 'error', summary: errorFileSizeTitle, detail: errorFileSizeMessage, life: 3000
            });
        }
    }

    useEffect(() => {
        if (props.PhotoBase64 && props.PhotoBase64 !== "") {
            setAvatarIMG(`data:image/*;base64,${props.PhotoBase64}`);
        }
    }, [props.PhotoBase64])

    return (
        <div className='relative'>
            <Toast ref={toast} />
            <Avatar
                id='AvatarProfileChange'
                image={AvatarIMG !== null ? AvatarIMG as string : ''}
                className="p-1"
                style={{ width: '250px', height: "250px" }}
                shape="circle"
                pt={{ image: { style: { objectFit: "cover", borderRadius: "100%" } } }} />
            <input id='avatarChangeInput' type="file" placeholder='Avatar' accept="image/png, image/jpeg" onChange={(e) => fileUploaded(e)} />
            <label id='labelAvatarChangeInput' htmlFor='avatarChangeInput'></label>
        </div>
    )
}
