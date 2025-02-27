import { createSlice } from "@reduxjs/toolkit";
import userService from "../../services/user"

const initialState = {
    usersList: [],
    selectedUser: JSON.parse(localStorage.getItem("selectedUser")) || null
}

const userSlice = createSlice({
    name: 'users',
    initialState: initialState,
    reducers: {
        setUsers: (state, action) => {
            return { ...state, usersList: action.payload }
        },
        getUser: (state, action) => {
            const userFound = action.payload;
            const foundUser = state.usersList.find(user => user.id === userFound.id);
            return { ...state, selectedUser: foundUser || null }
        },
        clearSelected(state, action) {
            return {
                ...state,
                selectedUser: null,
            };
        }
    }
})

export const { setUsers, getUser, clearSelected } = userSlice.actions

export const getAllUser = () => {
    return async dispatch => {
        const users = await userService.getAll()
        dispatch(setUsers(users))
    }
}

export const getUserById = (id) => {
    return async dispatch => {
        const user = await userService.getUserById(id)
        dispatch(getUser(user))
        if (user) {
            localStorage.setItem("selectedUser", JSON.stringify(user));
        }
    }
}

export const clearSelectedUser = () => {
    return dispatch => {
        try {
            dispatch(clearSelected())
            localStorage.removeItem("selectedUser");
        } catch (error) {
            console.error("Error in clearSelectedUser", error)
        }
    }
}

export default userSlice.reducer