import axios from "axios";
//redux
import { RootState } from "../redux/store";
import { login, logout } from "../redux/AuthSlice";
//hooks
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import useTokenData from "../hooks/utils/useTokenData";
//Models
import { AuthResponse } from "../models/responses/auth.response";
import { AuthToken } from "../models/tokens/token.model";
import { RefreshTokenRequest } from "../models/requests/auth/refreshToken.request";

const useApiClient = () => {
  const authenticated = useSelector((state: RootState) => state.auth);
  const getTokenData = useTokenData<AuthToken>(authenticated?.token);
  const dispatch = useDispatch();

  const apiClient = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
  });

  //Add token in header
  if (authenticated) {
    apiClient.interceptors.request.use(config => {
      config.headers.Authorization = `${authenticated.tokenType} ${authenticated.token}`
      return config;
    })
  }

  //Refresh token
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
        dispatch(logout());
      }

    }
  })

  return apiClient;
};

function useAuthAPI() {
  const apiClient = useApiClient();
  const [authResponse, setData] = useState<AuthResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [httpCode, setHttpCode] = useState(0);

  const SendAuthRequest = (url, dataSend = {}) => {
    setLoading(true);

    apiClient.post(url, dataSend)
      .then((response) => {
        const data = response.data as AuthResponse;
        setData(data);
        setHttpCode(response.status);
      })
      .catch((error) => {
        setError(error)
        //Save HttpCode
        if (error.response)
          setHttpCode(error.response.status)
        else if (error.request)
          setHttpCode(0);
        else
          setHttpCode(0);

      })
      .finally(() => {
        setLoading(false);
      });
  }

  return { SendAuthRequest, authResponse, loading, error, httpCode };
}

function useGet<T>() {
  const apiClient = useApiClient();
  const [getResponse, setResponse] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [httpCode, setHttpCode] = useState(0);

  function SendGetRequest(url) {
    setLoading(true);

    apiClient.get(url)
      .then((response) => {
        setResponse(response.data!);
        setHttpCode(response.status)
      })
      .catch((error) => {
        setError(error)
        //Save HttpCode
        if (error.response)
          setHttpCode(error.response.status)
        else if (error.request)
          setHttpCode(0);
        else
          setHttpCode(0);

      })
      .finally(() => {
        setLoading(false);
      });
  }

  return { SendGetRequest, getResponse, loading, error, httpCode };
}

function usePost() {
  const apiClient = useApiClient();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [httpCode, setHttpCode] = useState(0);

  const SendPostRequest = (url, dataSend = {}) => {
    setLoading(true);

    apiClient.post(url, dataSend)
      .then((response) => {
        setData(response.data);
        setHttpCode(response.status)
      })
      .catch((error) => {
        setError(error)
        //Save HttpCode
        if (error.response)
          setHttpCode(error.response.status)
        else if (error.request)
          setHttpCode(0);
        else
          setHttpCode(0);

      })
      .finally(() => {
        setLoading(false);
      });
  }

  return { SendPostRequest, data, loading, error, httpCode };
}

function usePut() {
  const apiClient = useApiClient()
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [httpCode, setHttpCode] = useState(0);

  const SendPutRequest = (url, dataSend = {}) => {
    setLoading(true);

    apiClient.put(url, dataSend)
      .then((response) => {
        setData(response.data);
        setHttpCode(response.status)
      })
      .catch((error) => {
        setError(error)
        //Save HttpCode
        if (error.response)
          setHttpCode(error.response.status)
        else if (error.request)
          setHttpCode(0);
        else
          setHttpCode(0);

      })
      .finally(() => {
        setLoading(false);
      });
  }

  return { SendPutRequest, data, loading, error, httpCode };
}

function useDelete() {
  const apiClient = useApiClient()
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [httpCode, setHttpCode] = useState(0);

  const SendDeleteRequest = (url) => {
    setLoading(true);

    apiClient.delete(url)
      .then((response) => {
        setData(response.data);
        setHttpCode(response.status)
      })
      .catch((error) => {
        setError(error)
        //Save HttpCode
        if (error.response)
          setHttpCode(error.response.status)
        else if (error.request)
          setHttpCode(0);
        else
          setHttpCode(0);

      })
      .finally(() => {
        setLoading(false);
      });
  }

  return { SendDeleteRequest, data, loading, error, httpCode };
}

export { useGet, usePost, usePut, useDelete, useAuthAPI };
