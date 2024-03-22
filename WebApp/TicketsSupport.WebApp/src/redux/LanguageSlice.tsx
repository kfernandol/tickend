import { createSlice } from "@reduxjs/toolkit";
import { Languages } from "../models/combobox/languages";

const initialState: Languages = {
    name: "Español",
    code: "es",
    flag: 'gt'
}

export const languageSlice = createSlice({
    name: "laguage",
    initialState,
    reducers: {
        changeLanguage: (state, action) => {
            const payload: Languages = action.payload;
            state.name = payload.name;
            state.flag = payload.flag;
            state.code = payload.code;
        },
    },
});

export const { changeLanguage } = languageSlice.actions;
export default languageSlice.reducer;





