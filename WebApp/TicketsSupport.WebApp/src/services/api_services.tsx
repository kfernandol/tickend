import axios, { AxiosError, AxiosRequestConfig } from "axios";
//redux
import { RootState } from "../redux/store";
import { login, logout } from "../redux/Slices/AuthSlice";
//hooks
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import useTokenData from "../hooks/useTokenData";
//Models
import { AuthResponse } from "../models/responses/auth.response";
import { AuthToken } from "../models/tokens/token.model";
import { RefreshTokenRequest } from "../models/requests/refreshToken.request";
import { ErrorResponse, ErrorsDetail, ErrorsResponse } from "../models/responses/basic.response";

const useApiClient = () => {
    const authenticated = useSelector((state: RootState) => state.auth);
    const language = useSelector((state: RootState) => state.language);
    const getTokenData = useTokenData<AuthToken>(authenticated?.token);
    const dispatch = useDispatch();

    const apiClient = axios.create({
        baseURL: import.meta.env.VITE_API_URL,
    });

    //Add token in header - interceptor request
    if (authenticated) {
        apiClient.interceptors.request.use(config => {
            config.headers.Authorization = `${authenticated.tokenType} ${authenticated.token}`
            config.headers['Accept-Language'] = language.code;
            return config;
        })
    }

    //Refresh token - interceptor response
    apiClient.interceptors.response.use((response) => response, async (error) => {

        const originalRequest = error.config;
        if (error.response.status === 401 && !originalRequest._retry) {
            try {
                originalRequest._retry = true;

                //create request
                const requestRefreshToken: RefreshTokenRequest = {
                    username: getTokenData !== null ? getTokenData.sub : "",
                    refreshToken: authenticated.refreshToken
                }

                //send request
                const response = await apiClient.post('v1/auth/refresh-token', requestRefreshToken);
                const AuthResponse = response.data as AuthResponse;
                dispatch(login(AuthResponse));

                originalRequest.headers.Authorization = `${AuthResponse.tokenType} ${AuthResponse.token}`;
                return axios(originalRequest);
            } catch (error) {
                console.error(error);
                console.log("no se puido we")
                dispatch(logout());
            }

        }
        else {
            return Promise.reject(error);
        }
    })

    return apiClient;
};

function useAuthAPI() {
    const apiClient = useApiClient();
    const [authResponse, setAuthResponse] = useState<AuthResponse | null>(null);
    const [loadingAuth, setLoadingAuth] = useState(false);
    const [errorAuth, setErrorAuth] = useState<ErrorResponse | ErrorsResponse | null>(null);
    const [httpCodeAuth, setHttpCodeAuth] = useState(0);

    const SendAuthRequest = (url: string, dataSend = {}) => {
        setLoadingAuth(true);

        apiClient.post(url, dataSend)

            .then((response) => {
                setAuthResponse(response.data);
                setHttpCodeAuth(response.status);
            })
            .catch((error: unknown) => {
                if (axios.isAxiosError(error)) {
                    error as AxiosError;

                    //Save HTTP Code
                    const HttpCode = error.response?.status;
                    if (HttpCode) {
                        setHttpCodeAuth(HttpCode);
                    } else {
                        setHttpCodeAuth(-1);
                    }

                    if (HttpCode == 400) {
                        const errorResponse: ErrorResponse = error.response?.data as ErrorResponse;
                        setErrorAuth(errorResponse);
                        if (errorResponse) {
                            const errorsJson: ErrorsDetail = JSON.parse(errorResponse.details);
                            //ErrorResponse with list errors
                            if (errorsJson) {
                                const ErrorsResp: ErrorsResponse = {
                                    code: errorResponse.code,
                                    message: errorResponse.message,
                                    errors: errorsJson
                                }

                                setErrorAuth(ErrorsResp);
                            } else {
                                setErrorAuth(errorResponse);
                            }
                        }
                    }
                    else {
                        const errorResponse: ErrorResponse = error.response?.data as ErrorResponse;
                        setErrorAuth(errorResponse);
                    }
                }
            })
            .finally(() => {
                setLoadingAuth(false);
            })
    }

    return { SendAuthRequest, authResponse, loadingAuth, errorAuth, httpCodeAuth };
}

function useGet<T>() {
    const apiClient = useApiClient();
    const [getResponse, setGetResponse] = useState<T | null>(null);
    const [loadingGet, setLoadingGet] = useState(false);
    const [errorGet, setErrorGet] = useState<ErrorResponse | ErrorsResponse | null>();
    const [httpCodeGet, setHttpCodeGet] = useState(0);

    function SendGetRequest(url: string, config?: AxiosRequestConfig) {
        setLoadingGet(true);
        setErrorGet(null);

        return apiClient.get(url, config)
            .then((response) => {
                setGetResponse(response.data!);
                setHttpCodeGet(response.status);
                return { data: response.data, url: url }
            })
            .catch((error: unknown) => {
                if (axios.isAxiosError(error)) {
                    error as AxiosError;

                    //Save HTTP Code
                    const HttpCode = error.response?.status;
                    if (HttpCode) {
                        setHttpCodeGet(HttpCode);
                    } else {
                        setHttpCodeGet(-1);
                    }

                    if (HttpCode == 400) {
                        const errorResponse: ErrorResponse = error.response?.data as ErrorResponse;
                        setErrorGet(errorResponse);
                        if (errorResponse) {
                            const errorsJson: ErrorsDetail = JSON.parse(errorResponse.details);
                            //ErrorResponse with list errors
                            if (errorsJson) {
                                const ErrorsResp: ErrorsResponse = {
                                    code: errorResponse.code,
                                    message: errorResponse.message,
                                    errors: errorsJson
                                }

                                setErrorGet(ErrorsResp);
                            } else {
                                setErrorGet(errorResponse);
                            }
                        }
                    }
                    else {
                        const errorResponse: ErrorResponse = error.response?.data as ErrorResponse;
                        setErrorGet(errorResponse);
                    }
                }
                return Promise.reject(error);
            })
            .finally(() => {
                setLoadingGet(false);
            });
    }

    return { SendGetRequest, getResponse, loadingGet, errorGet, httpCodeGet };
}

function usePost<T>() {
    const apiClient = useApiClient();
    const [postResponse, setPostResponse] = useState<T | null>(null);
    const [loadingPost, setLoadingPost] = useState(false);
    const [errorPost, setErrorPost] = useState<ErrorResponse | ErrorsResponse | null>();
    const [httpCodePost, setHttpCodePost] = useState(0);

    const SendPostRequest = (url: string, dataSend = {}, config?: AxiosRequestConfig) => {
        setLoadingPost(true);
        setErrorPost(undefined); // Resetea el error antes de cada solicitud

        apiClient.post(url, dataSend, config)

            .then((response) => {
                setPostResponse(response.data);
                setHttpCodePost(response.status);
            })
            .catch((error: unknown) => {
                if (axios.isAxiosError(error)) {
                    error as AxiosError;

                    //Save HTTP Code
                    const HttpCode = error.response?.status;
                    if (HttpCode) {
                        setHttpCodePost(HttpCode);
                    } else {
                        setHttpCodePost(-1);
                    }

                    if (HttpCode == 400) {
                        const errorResponse: ErrorResponse = error.response?.data as ErrorResponse;
                        setErrorPost(errorResponse);
                        if (errorResponse) {
                            const errorsJson: ErrorsDetail = JSON.parse(errorResponse.details);
                            //ErrorResponse with list errors
                            if (errorsJson) {
                                const ErrorsResp: ErrorsResponse = {
                                    code: errorResponse.code,
                                    message: errorResponse.message,
                                    errors: errorsJson
                                }

                                setErrorPost(ErrorsResp);
                            } else {
                                setErrorPost(errorResponse);
                            }
                        }
                    }
                    else {
                        const errorResponse: ErrorResponse = error.response?.data as ErrorResponse;
                        setErrorPost(errorResponse);
                    }
                }
            })
            .finally(() => {
                setLoadingPost(false);
            })
    }


    return { SendPostRequest, postResponse, loadingPost, errorPost, httpCodePost };
}

function usePut<T>() {
    const apiClient = useApiClient()
    const [putResponse, setPutResponse] = useState<T | null>(null);
    const [loadingPut, setLoadingPut] = useState(false);
    const [errorPut, setErrorPut] = useState<ErrorResponse | ErrorsResponse | null>();
    const [httpCodePut, setHttpCodePut] = useState(0);

    const SendPutRequest = (url: string, dataSend = {}, config?: AxiosRequestConfig) => {
        setErrorPut(undefined); // Resetea el error antes de cada solicitud
        setLoadingPut(true);

        apiClient.put(url, dataSend, config)

            .then((response) => {
                setPutResponse(response.data);
                setHttpCodePut(response.status);
            })
            .catch((error: unknown) => {
                if (axios.isAxiosError(error)) {
                    error as AxiosError;

                    //Save HTTP Code
                    const HttpCode = error.response?.status;
                    if (HttpCode) {
                        setHttpCodePut(HttpCode);
                    } else {
                        setHttpCodePut(-1);
                    }

                    if (HttpCode == 400) {
                        const errorResponse: ErrorResponse = error.response?.data as ErrorResponse;
                        setErrorPut(errorResponse);
                        if (errorResponse) {
                            const errorsJson: ErrorsDetail = JSON.parse(errorResponse.details);
                            //ErrorResponse with list errors
                            if (errorsJson) {
                                const ErrorsResp: ErrorsResponse = {
                                    code: errorResponse.code,
                                    message: errorResponse.message,
                                    errors: errorsJson
                                }

                                setErrorPut(ErrorsResp);
                            } else {
                                setErrorPut(errorResponse);
                            }
                        }
                    }
                    else {
                        const errorResponse: ErrorResponse = error.response?.data as ErrorResponse;
                        setErrorPut(errorResponse);
                    }
                }
            })
            .finally(() => {
                setLoadingPut(false);
            })
    }

    return { SendPutRequest, putResponse, loadingPut, errorPut, httpCodePut };
}

function useDelete<T>() {
    const apiClient = useApiClient()
    const [deleteResponse, setDeleteResponse] = useState<T | null>(null);
    const [loadingDelete, setLoadingDelete] = useState(false);
    const [errorDelete, setErrorDelete] = useState<ErrorResponse | ErrorsResponse | null>();
    const [httpCodeDelete, setHttpDeleteCode] = useState(0);

    function SendDeleteRequest (url: string, config?: AxiosRequestConfig) {
        setLoadingDelete(true);
        setErrorDelete(undefined);

        return apiClient.delete(url, config)
            .then((response) => {
                setDeleteResponse(response.data);
                setHttpDeleteCode(response.status)
                return { data: response.data, url: url }
            })
            .catch((error: unknown) => {
                if (axios.isAxiosError(error)) {
                    error as AxiosError;

                    //Save HTTP Code
                    const HttpCode = error.response?.status;
                    if (HttpCode) {
                        setHttpDeleteCode(HttpCode);
                    } else {
                        setHttpDeleteCode(-1);
                    }

                    if (HttpCode == 400) {
                        const errorResponse: ErrorResponse = error.response?.data as ErrorResponse;
                        setErrorDelete(errorResponse);
                        if (errorResponse) {
                            const errorsJson: ErrorsDetail = JSON.parse(errorResponse.details);
                            //ErrorResponse with list errors
                            if (errorsJson) {
                                const ErrorsResp: ErrorsResponse = {
                                    code: errorResponse.code,
                                    message: errorResponse.message,
                                    errors: errorsJson
                                }

                                setErrorDelete(ErrorsResp);
                            } else {
                                setErrorDelete(errorResponse);
                            }
                        }
                    }
                    else {
                        const errorResponse: ErrorResponse = error.response?.data as ErrorResponse;
                        setErrorDelete(errorResponse);
                    }
                }
                return Promise.reject(error);
            })
            .finally(() => {
                setLoadingDelete(false);
            });
    }

    return { SendDeleteRequest, deleteResponse, loadingDelete, errorDelete, httpCodeDelete };
}

export { useGet, usePost, usePut, useDelete, useAuthAPI };
