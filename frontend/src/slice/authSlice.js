import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
    name: "auth",
    initialState: { token: localStorage.getItem("token") || null, user: null },
    reducers: {
        login: (state, action) => {
            state.token = action.payload.token;
            state.user = action.payload.user;
            localStorage.setItem("token", action.payload.token);
        },
        logout: (state) => {
            state.token = null;
            state.user = null;
            localStorage.removeItem("token");
        },
    },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;


// import { createSlice } from "@reduxjs/toolkit";

// const initialState = {
//     token: localStorage.getItem("access") || null,
//     refreshToken: localStorage.getItem("refresh") || null,
//     user: null,
// };

// const authSlice = createSlice({
//     name: "auth",
//     initialState,
//     reducers: {
//         login: (state, action) => {
//             state.token = action.payload.token;
//             state.refreshToken = action.payload.refresh;
//             state.user = action.payload.user;
//             localStorage.setItem("access", action.payload.token);
//             localStorage.setItem("refresh", action.payload.refresh);
//         },
//         logout: (state) => {
//             state.token = null;
//             state.refreshToken = null;
//             state.user = null;
//             localStorage.removeItem("access");
//             localStorage.removeItem("refresh");
//         },
//     },
// });

// export const { login, logout } = authSlice.actions;
// export default authSlice.reducer;
