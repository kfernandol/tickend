import { createSlice } from "@reduxjs/toolkit";

interface ApiServiceSlice {
    isRefresh: boolean,
    retry: number,
    organization: number | undefined
}

const initialState: ApiServiceSlice = {
    isRefresh: false,
    retry: 0,
    organization: undefined
};

export const apiServiceSlice = createSlice({
    name: "apiService",
    initialState,
    reducers: {
        isRefresh: (state, action) => {
            const isRefresh = action.payload;
            state.isRefresh = isRefresh;
        },
        retry: (state, action) => {
            const retryNumber = action.payload;
            state.retry = retryNumber;
        },
        changeOrganization: (state, action) => {
            const organizationId = action.payload;
            state.organization = organizationId;
        }
    },
});



export const { isRefresh, retry, changeOrganization } = apiServiceSlice.actions;
export default apiServiceSlice.reducer;
