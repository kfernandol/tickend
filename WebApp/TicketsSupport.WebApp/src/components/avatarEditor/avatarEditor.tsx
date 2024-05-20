//components
import { useTranslation } from 'react-i18next';
import Avatar from 'react-avatar-edit'

type Props = {
    onChangeAvatar: (avatarBase64: string) => void;
    PhotoBase64?: string
}

export default function AvatarEditor(props: Props) {
    //translation
    const { t } = useTranslation();
    const fileTxt = t("profile.labels.file");

    const handlerAvatarCrop = (imageCropBase64: string) => {
        props.onChangeAvatar(imageCropBase64);
    }

    return (
        <div className='flex gap-5 relative'>
            <div className="absolute">
                <Avatar
                    width={220}
                    height={220}
                    label={fileTxt}
                    backgroundColor="#fff"
                    cropColor="#fff"
                    closeIconColor="#fff"
                    shadingColor="#000"
                    borderStyle={{
                        textAlign: "center",
                        textShadow: "#fff 1px 1px 1px"
                    }}
                    onCrop={handlerAvatarCrop}
                    exportQuality={1}
                />
            </div>
            <img
                width={220}
                height={220}
                src={props.PhotoBase64} />
        </div>
    )
}
