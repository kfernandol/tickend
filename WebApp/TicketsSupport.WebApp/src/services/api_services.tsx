import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios";
//redux
import { RootState } from "../redux/store";
import { useDispatch, useSelector } from "react-redux";
import { login, logout } from "../redux/Slices/AuthSlice";
import { isRefresh, retry } from "../redux/Slices/ApiServiceSlice";
//hooks
import { useState } from "react";
import useTokenData from "../hooks/useTokenData";
//Models
import { AuthResponse } from "../models/responses/auth.response";
import { AuthToken } from "../models/tokens/token.model";
import { RefreshTokenRequest } from "../models/requests/refreshToken.request";
import { ErrorResponse, ErrorsDetail, ErrorsResponse } from "../models/responses/basic.response";


const useApiClient = (organizacionId?: number) => {
    const authenticated = useSelector((state: RootState) => state.auth);
    const language = useSelector((state: RootState) => state.language);
    const apiService = useSelector((state: RootState) => state.apiService);
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

    // Refresh token - interceptor response
    apiClient.interceptors.response.use(
        (response) => response,
        async (error) => {
            const originalRequest = error.config;
            if (error.response.status === 401 && !originalRequest._retry && !apiService.isRefresh) {
                if (apiService.retry <= 3) {
                    dispatch(retry(apiService.retry++))
                    dispatch(isRefresh(true));
                    originalRequest._retry = true;

                    try {

                        // Crear solicitud de refresco
                        const requestRefreshToken: RefreshTokenRequest = {
                            username: getTokenData ? getTokenData.sub : "",
                            refreshToken: authenticated.refreshToken
                        };

                        if (organizacionId)
                            requestRefreshToken.organizationId = organizacionId;

                        // Enviar solicitud de refresco
                        const response = await apiClient.post('v1/auth/refresh-token', requestRefreshToken);
                        const AuthResponse = response.data;

                        // Actualizar estado con el nuevo token
                        dispatch(login(AuthResponse));

                        // Modificar cabecera y reintentar la solicitud original
                        originalRequest.headers.Authorization = `${AuthResponse.tokenType} ${AuthResponse.token}`;

                        dispatch(isRefresh(false));
                        return apiClient(originalRequest);
                    } catch (error) {
                        dispatch(isRefresh(false));
                        dispatch(logout());
                        return Promise.reject(error); // Asegúrate de rechazar la promesa en caso de error
                    }
                } else {
                    dispatch(retry(0));
                    dispatch(logout());
                }

            }

            return Promise.reject(error); // Asegúrate de rechazar la promesa para otros errores
        }
    );

    return apiClient;
}


function useAuthAPI() {
    const apiClient = useApiClient();
    const [authResponse, setAuthResponse] = useState<AuthResponse | null>(null);
    const [loadingAuth, setLoadingAuth] = useState(false);
    const [errorAuth, setErrorAuth] = useState<AxiosResponse<ErrorResponse | ErrorsResponse> | ErrorResponse | ErrorsResponse | undefined | null>(null);
    const [httpCodeAuth, setHttpCodeAuth] = useState(0);

    const SendAuthRequest = (url: string, dataSend = {}) => {
        setLoadingAuth(true);

        return apiClient.post(url, dataSend)
            .then((response) => {
                setAuthResponse(response.data);
                setHttpCodeAuth(response.status);
                return { data: response.data, url: url }
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

                    if (error.response?.status === 400) {
                        const errorResponse = error.response as AxiosResponse<ErrorResponse | ErrorsResponse> | undefined;

                        if (errorResponse && errorResponse.data) {
                            let errorsJson: ErrorsDetail | null = null;

                            // Intentar parsear el campo "details" como JSON
                            if (typeof errorResponse.data.details === 'string') {
                                try {
                                    errorsJson = JSON.parse(errorResponse.data.details);
                                } catch (e) { console.warn("details field is not a valid JSON string:", e) }
                            }

                            // Verificar si el parseo resultó en un objeto válido
                            if (errorsJson) {
                                const errorsResp: ErrorsResponse = {
                                    code: errorResponse.data.code,
                                    message: errorResponse.data.message,
                                    details: errorsJson
                                };

                                setErrorAuth(errorsResp);
                            } else {
                                // Si "details" no es un JSON válido, utilizar la respuesta de error original
                                const errorResp: ErrorResponse = {
                                    code: errorResponse.data.code,
                                    message: errorResponse.data.message,
                                    details: errorResponse.data.details as string
                                };
                                setErrorAuth(errorResp);
                            }
                        }
                    } else {
                        setErrorAuth(error.response?.data);
                    }

                }
                return Promise.reject(error);
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
    const [errorGet, setErrorGet] = useState<AxiosResponse<ErrorResponse | ErrorsResponse> | ErrorResponse | ErrorsResponse | undefined | null>(null);
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

                    if (error.response?.status === 400) {
                        const errorResponse = error.response as AxiosResponse<ErrorResponse | ErrorsResponse> | undefined;

                        if (errorResponse && errorResponse.data) {
                            let errorsJson: ErrorsDetail | null = null;

                            // Intentar parsear el campo "details" como JSON
                            if (typeof errorResponse.data.details === 'string') {
                                try {
                                    errorsJson = JSON.parse(errorResponse.data.details);
                                } catch (e) { console.warn("details field is not a valid JSON string:", e) }
                            }

                            // Verificar si el parseo resultó en un objeto válido
                            if (errorsJson) {
                                const errorsResp: ErrorsResponse = {
                                    code: errorResponse.data.code,
                                    message: errorResponse.data.message,
                                    details: errorsJson
                                };

                                setErrorGet(errorsResp);
                            } else {
                                // Si "details" no es un JSON válido, utilizar la respuesta de error original
                                const errorResp: ErrorResponse = {
                                    code: errorResponse.data.code,
                                    message: errorResponse.data.message,
                                    details: errorResponse.data.details as string
                                };
                                setErrorGet(errorResp);
                            }
                        }
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
    const [errorPost, setErrorPost] = useState<AxiosResponse<ErrorResponse | ErrorsResponse> | ErrorResponse | ErrorsResponse | undefined | null>(null);
    const [httpCodePost, setHttpCodePost] = useState(0);

    const SendPostRequest = (url: string, dataSend = {}, config?: AxiosRequestConfig) => {
        setLoadingPost(true);
        setErrorPost(undefined); // Resetea el error antes de cada solicitud

        return apiClient.post(url, dataSend, config)
            .then((response) => {
                setPostResponse(response.data);
                setHttpCodePost(response.status);
                return { data: response.data, url: url }
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

                    if (error.response?.status === 400) {
                        const errorResponse = error.response as AxiosResponse<ErrorResponse | ErrorsResponse> | undefined;

                        if (errorResponse && errorResponse.data) {
                            let errorsJson: ErrorsDetail | null = null;

                            // Intentar parsear el campo "details" como JSON
                            if (typeof errorResponse.data.details === 'string') {
                                try {
                                    errorsJson = JSON.parse(errorResponse.data.details);
                                } catch (e) { console.warn("details field is not a valid JSON string:", e) }
                            }

                            // Verificar si el parseo resultó en un objeto válido
                            if (errorsJson) {
                                const errorsResp: ErrorsResponse = {
                                    code: errorResponse.data.code,
                                    message: errorResponse.data.message,
                                    details: errorsJson
                                };

                                setErrorPost(errorsResp);
                            } else {
                                // Si "details" no es un JSON válido, utilizar la respuesta de error original
                                const errorResp: ErrorResponse = {
                                    code: errorResponse.data.code,
                                    message: errorResponse.data.message,
                                    details: errorResponse.data.details as string
                                };
                                setErrorPost(errorResp);
                            }
                        }
                    }
                }
                return Promise.reject(error);
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
    const [errorPut, setErrorPut] = useState<AxiosResponse<ErrorResponse | ErrorsResponse> | ErrorResponse | ErrorsResponse | undefined | null>(null);
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

                    if (error.response?.status === 400) {
                        const errorResponse = error.response as AxiosResponse<ErrorResponse | ErrorsResponse> | undefined;

                        if (errorResponse && errorResponse.data) {
                            let errorsJson: ErrorsDetail | null = null;

                            // Intentar parsear el campo "details" como JSON
                            if (typeof errorResponse.data.details === 'string') {
                                try {
                                    errorsJson = JSON.parse(errorResponse.data.details);
                                } catch (e) { console.warn("details field is not a valid JSON string:", e) }
                            }

                            // Verificar si el parseo resultó en un objeto válido
                            if (errorsJson) {
                                const errorsResp: ErrorsResponse = {
                                    code: errorResponse.data.code,
                                    message: errorResponse.data.message,
                                    details: errorsJson
                                };

                                setErrorPut(errorsResp);
                            } else {
                                // Si "details" no es un JSON válido, utilizar la respuesta de error original
                                const errorResp: ErrorResponse = {
                                    code: errorResponse.data.code,
                                    message: errorResponse.data.message,
                                    details: errorResponse.data.details as string
                                };
                                setErrorPut(errorResp);
                            }
                        }
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
    const [errorDelete, setErrorDelete] = useState<AxiosResponse<ErrorResponse | ErrorsResponse> | ErrorResponse | ErrorsResponse | undefined | null>(null);
    const [httpCodeDelete, setHttpDeleteCode] = useState(0);

    function SendDeleteRequest(url: string, config?: AxiosRequestConfig) {
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

                    if (error.response?.status === 400) {
                        const errorResponse = error.response as AxiosResponse<ErrorResponse | ErrorsResponse> | undefined;

                        if (errorResponse && errorResponse.data) {
                            let errorsJson: ErrorsDetail | null = null;

                            // Intentar parsear el campo "details" como JSON
                            if (typeof errorResponse.data.details === 'string') {
                                try {
                                    errorsJson = JSON.parse(errorResponse.data.details);
                                } catch (e) { console.warn("details field is not a valid JSON string:", e) }
                            }

                            // Verificar si el parseo resultó en un objeto válido
                            if (errorsJson) {
                                const errorsResp: ErrorsResponse = {
                                    code: errorResponse.data.code,
                                    message: errorResponse.data.message,
                                    details: errorsJson
                                };

                                setErrorDelete(errorsResp);
                            } else {
                                // Si "details" no es un JSON válido, utilizar la respuesta de error original
                                const errorResp: ErrorResponse = {
                                    code: errorResponse.data.code,
                                    message: errorResponse.data.message,
                                    details: errorResponse.data.details as string
                                };
                                setErrorDelete(errorResp);
                            }
                        }
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
