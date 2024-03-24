import React, { useEffect, useState } from 'react';
//hooks
import { useDispatch, useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import useTokenData from '../../hooks/utils/useTokenData';
import { useGet } from '../../services/api_services';
//model
import { AuthToken } from '../../models/tokens/token.model';
import { MenusResponse } from '../../models/responses/menus.response';
import { RootState } from '../../redux/store';


function ProtectedRoute({ children, name }) {

    //Redux Data
    const dispatch = useDispatch();
    const language = useSelector((state: RootState) => state.language);
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
        console.log(Menus)
        if (!Menus.find(x => x.name == name) && (name === "Home" && authenticated.token === "")) {
            return <Navigate to="/unauthorized" replace />;
        }

        return children;
    }

}

export default ProtectedRoute;