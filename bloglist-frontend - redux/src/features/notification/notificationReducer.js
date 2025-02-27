import { createSlice } from "@reduxjs/toolkit";


export const notificationSlice = createSlice({
    name: 'notification',
    initialState: null,
    reducers: {
        setNotification: (state, action) => {
            return action.payload
        },
        clearNotification: (state, action) => {
            return null
        }
    }
})

export const { setNotification, clearNotification} = notificationSlice.actions

export default notificationSlice.reducer
