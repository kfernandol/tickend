import { useEffect, useState } from 'react';
//hooks
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import useTokenData from '../../hooks/useTokenData';
import { useGet } from '../../services/api_services';
//model
import { AuthToken } from '../../models/tokens/token.model';
import { MenusResponse } from '../../models/responses/menus.response';
import { RootState } from '../../redux/store';

interface props {
    name: string,
    children: React.ReactNode
}

function ProtectedRoute(props: props) {

    //Redux Data
    const authenticated = useSelector((state: RootState) => state.auth);
    const getTokenData = useTokenData<AuthToken>(authenticated?.token);

    //Api Request
    const { SendGetRequest, getResponse } = useGet<MenusResponse[]>();
    const [Menus, setMenus] = useState<MenusResponse[]>();

    useEffect(() => {
        SendGetRequest("v1/menus/byuser/" + getTokenData?.id);
    }, [])

    useEffect(() => {
        if (getResponse) {
            setMenus(getResponse);

        }
    }, [getResponse])

    if (Menus) {
        if (!Menus.find(x => x.name == props.name) && ((props.name === "Home" || props.name === "Prifle") && authenticated.token === "")) {
            return <Navigate to="/unauthorized" replace />;
        }

        return props.children;
    }

}

export default ProtectedRoute;