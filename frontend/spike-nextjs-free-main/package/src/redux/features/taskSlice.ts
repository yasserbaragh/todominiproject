import { createSlice, PayloadAction } from "@reduxjs/toolkit"

type InitialState = {
    value: TaskState[]
}

type TaskState = {
    id: number
    task: string,
    description: string,
    isDone: boolean,
    isEdited: boolean
}

const initialState: InitialState = {
    value: []
}

export const task = createSlice({
    name: "task",
    initialState,
    reducers: {
        addTask: (state, action: PayloadAction<TaskState>) => {
            state.value.push(action.payload)
            state.value.sort((a, b) => Number(a.isDone) - Number(b.isDone));
        },
        deleteTask: (state, action: PayloadAction<number>) => {
            state.value = state.value.filter(task => task.id !== action.payload);
            state.value.sort((a, b) => Number(a.isDone) - Number(b.isDone));
        },

        editTask: (state, action: PayloadAction<TaskState>) => {
            const updatedTask = action.payload;
            const taskId = updatedTask.id;
            const taskIndex = state.value.findIndex(task => task.id === taskId);

            if (taskIndex !== -1) {
                state.value[taskIndex] = { ...state.value[taskIndex], ...updatedTask };
                state.value.sort((a, b) => Number(a.isDone) - Number(b.isDone));
            }

            state.value.sort((a, b) => Number(a.isDone) - Number(b.isDone));
        },
        deleteManyTask: (state, action: PayloadAction<number[]>) => {
            const indices = [...action.payload].sort((a, b) => b - a);

            for (const index of indices) {
                state.value.splice(index, 1);
            }

            state.value.sort((a, b) => Number(a.isDone) - Number(b.isDone));
        }
    }
})

export const { addTask, deleteTask, editTask, deleteManyTask } = task.actions
export default task.reducer
