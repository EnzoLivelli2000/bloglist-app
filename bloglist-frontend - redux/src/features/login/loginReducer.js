import { createSlice } from "@reduxjs/toolkit";
import loginService from "../../services/login";
import blogService from "../../services/blogs";
import { setNotification } from "../notification/notificationReducer";
const loginSlice = createSlice({
    name: 'user',
    initialState: null,
    reducers: {
        login: (state, action) => {
            state = action.payload;
            blogService.setToken(action.payload.token)
        },
        logout: (state, action) => {
            blogService.setToken(null);
            state = null; 
        },
        logged: (state, action) => {
            blogService.setToken(action.payload.token)
            return action.payload;
        }
    }
})

export const { login, logout , logged} = loginSlice.actions

export const handleLogin = (username, password) => {
    return async dispatch => {
        try {
            const user = await loginService.login({
                username, password
            })

            window.localStorage.setItem(
                'loggedBlogappUser', JSON.stringify(user)
            )
            dispatch(login(user))
            dispatch(setNotification({ payload: 'Login Success' }))
            location.reload()

        } catch {
            dispatch(setNotification({ payload: 'Wrong credentials' }))
        }
    }
}

export const handleLogout = () => {
    return async dispatch => {
        try {
            dispatch(logout());
            window.localStorage.removeItem('loggedBlogappUser');
            dispatch(setNotification({ payload: 'Logged out successfully' }));
            location.reload()
        } catch {
            dispatch(setNotification({ payload: 'Logged out failed' }))
        }
    }
}

export const handleLogged = () => {
    return async dispatch => {
        const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')

        if (loggedUserJSON) {
            const user = JSON.parse(loggedUserJSON)
            dispatch(logged(user))
        }
    }
}

export default loginSlice.reducer