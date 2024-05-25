//redux
import { useDispatch } from "react-redux";
//components
import { ProgressSpinner } from "primereact/progressspinner";
//hooks
import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { usePost } from "../../services/api_services";
import { login } from "../../redux/Slices/AuthSlice";

function ConfirmRegister() {
    //hooks
    const { hash } = useParams();
    const { SendPostRequest } = usePost();
    const dispatch = useDispatch();
    const navegation = useNavigate();

    useEffect(() => {
        if (hash) {
            console.log(hash)
            SendPostRequest("v1/auth/confirm", JSON.stringify(hash), { headers: { "Content-Type": "application/json" } })
                .then((response) => {
                    dispatch(login(response.data));
                    navegation("/");
                })
        }
    }, [hash])

    return (
        <div className="flex justify-content-center align-items-center h-screen">
            <ProgressSpinner />
        </div>
    );
}

export default ConfirmRegister;