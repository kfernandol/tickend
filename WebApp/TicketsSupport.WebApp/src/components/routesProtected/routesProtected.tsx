import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import useTokenData from '../../hooks/useTokenData';
import { useGet } from '../../services/api_services';
import { AuthToken } from '../../models/tokens/token.model';
import { MenusResponse } from '../../models/responses/menus.response';
import { RootState } from '../../redux/store';
import { paths } from '../../routes/paths';

interface props {
    name: string;
    children: React.ReactNode;
}

export default function ProtectedRoute(props: props) {
    //Redux Data
    const authenticated = useSelector((state: RootState) => state.auth);
    const getTokenData = useTokenData<AuthToken>(authenticated?.token);

    //Api Request
    const { SendGetRequest } = useGet<MenusResponse[]>();
    const [Menus, setMenus] = useState<MenusResponse[]>([]);

    useEffect(() => {
        SendGetRequest("v1/menus/byuser/" + getTokenData?.id).then((response) => {
            setMenus(response.data as MenusResponse[]);
        })
    }, [authenticated]);

    if (Menus && Menus.length > 0) {

        if (!Menus.find(x => x.name === props.name) && (props.name !== "Home" && props.name !== "Profile") || authenticated.token === "") {
            return <Navigate to={paths.unauthorized} replace />;
        }

        return props.children;
    }

    return null;
}