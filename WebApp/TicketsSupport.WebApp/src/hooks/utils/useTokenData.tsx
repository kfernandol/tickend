import { jwtDecode } from "jwt-decode";

export default function useTokenData<Type>(token: string) {
    if (token !== "") {
        const decodeToken = jwtDecode<Type>(token, { header: false });
        return decodeToken;
    } else {
        return null;
    }
}