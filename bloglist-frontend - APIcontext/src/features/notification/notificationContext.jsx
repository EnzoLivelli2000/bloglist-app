import { createSlice } from "@reduxjs/toolkit";
import { createContext } from "react";
import { useReducer } from "react";
import { useContext } from "react";

const initialState = null

const notificationReducer = (state, action) => {
    switch (action.type) {
        case 'SET_NOTIFICATION':
            return action.payload
        case 'CLEAR_NOTIFICATION':
            return null
        default:
            throw new Error(`Acción no soportada: ${action.type}`);
    }
}

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
    const [state, dispatch] = useReducer(notificationReducer, initialState)

    return (
        <NotificationContext.Provider value={{ notification: state, dispatch }}>
            {children}
        </NotificationContext.Provider>
    )
}

export const useNotification = () => useContext(NotificationContext);