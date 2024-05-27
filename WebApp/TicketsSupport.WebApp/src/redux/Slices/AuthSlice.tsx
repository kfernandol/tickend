import { createSlice } from "@reduxjs/toolkit";
import { AuthResponse } from "../../models/responses/auth.response";

const initialState: AuthResponse = {
    token: "",
    refreshToken: "",
    expirationMin: 0,
    tokenType: "",
};

export const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        login: (state, action) => {
            const { token, refreshToken, expirationMin, tokenType } = action.payload;
            state.token = token;
            state.expirationMin = expirationMin;
            state.tokenType = tokenType;
            state.refreshToken = refreshToken;
        },
        logout: (state) => {
            window.location.replace("/");
            (state.token = ""), (state.refreshToken = ""), (state.expirationMin = 0), (state.tokenType = "");
        },
    },
});



export const { login, logout } = authSlice.actions;
export default authSlice.reducer;
