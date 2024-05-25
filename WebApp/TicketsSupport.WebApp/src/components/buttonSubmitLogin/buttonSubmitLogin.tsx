import { Button } from "primereact/button";
import "./buttonSubmitLogin.css";

interface props {
    label: string;
    loading: boolean;
    className?: string;
}

function ButtonSubmitLogin(props: props) {
    return (
        <>
            <Button className={`btnSubmitLogin ${props.className}`} label={props.label} type="submit" icon="pi pi-send" loading={props.loading} />
        </>
    );
}

export default ButtonSubmitLogin;
