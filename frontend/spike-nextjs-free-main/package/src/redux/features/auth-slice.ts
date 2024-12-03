import { createSlice, PayloadAction } from "@reduxjs/toolkit"

type InitialState = {
    value: AuthState
}

type AuthState = {
    isAuth: boolean,
    username: string,
    userId: string,
    isAdmin: boolean,
    token: string
}

const initialState = {
    value: {
        isAuth: false,
        username: "",
        userId: "",
        isAdmin: false,
        token: ""
    } as AuthState
} as InitialState

export const auth = createSlice({
    name: "auth",
    initialState,
    reducers: {
        logOut: () => {
            return initialState;
        },
        logIn: (
            state,
            action: PayloadAction<{ username: string, token: string, userId: string, isAdmin: boolean}>
        ) => {
            return {
                value: {
                    isAuth: true,
                    username: action.payload.username,
                    userId: action.payload.userId,
                    isAdmin: action.payload.isAdmin,
                    token: action.payload.token
                }
            }
        },
    }
})

export const { logIn, logOut } = auth.actions
export default auth.reducer