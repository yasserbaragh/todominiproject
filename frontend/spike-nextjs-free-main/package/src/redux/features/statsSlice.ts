import { createSlice, PayloadAction } from "@reduxjs/toolkit"

type InitialState = {
    value: StatState[]
}

type StatState = {
    all: number,
    edited: number,
    deleted: number,
}

const initialState = {
    value: {
        all: 0,
        edited: 0,
        deleted: 0
    } as StatState
}

export const stat = createSlice({
    name: "stat",
    initialState,
    reducers: {
        addStat: (
            state,
            action: PayloadAction<{ all: number, edited: number, deleted: number }>
        ) => {
            return {
                value: {
                    all: action.payload.all,
                    edited: action.payload.edited,
                    deleted: action.payload.deleted
                }
            }
        },
    }
})

export const { addStat } = stat.actions
export default stat.reducer
