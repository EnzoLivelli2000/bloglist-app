import { createContext, useContext, useEffect, useReducer } from "react"
import userService from "../../services/user"

const initialState = {
    usersList: [],
    selectedUser: JSON.parse(localStorage.getItem("selectedUser")) || null
};

const userReducer = (state, action) => {
    switch (action.type) {
        case 'GET_USERS':
            return { ...state, usersList: action.payload };
        case 'GET_USER':
            const userFound = action.payload;
            const foundUser = state.usersList.find(user => user.id === userFound.id);
            return {
                ...state,
                selectedUser: foundUser || null,
            };
        case 'CLEAR_SELECTED_USER':
            return {
                ...state,
                selectedUser: null,
            };
    }
}

const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [state, dispatch] = useReducer(userReducer, initialState)

    useEffect(() => {
        getAllUsers((dispatch))
    }, [])

    return (
        <UserContext.Provider value={{ state: state, dispatch }}>
            {children}
        </UserContext.Provider>
    )
}

export const useUser = () => useContext(UserContext);

export const getAllUsers = async (dispatchUser) => {
    try {
        const users = await userService.getAll();
        dispatchUser({
            type: 'GET_USERS', payload: users
        })
    } catch (error) {
        console.error("Error in getAllUsers", error);
    }
}

export const getUserById = async (dispatchUser, id) => {
    try {
        const user = await userService.getById(id)
        dispatchUser({
            type: 'GET_USER', payload: user
        })
        if (user) {
            localStorage.setItem("selectedUser", JSON.stringify(user));
        }
    } catch (error) {
        console.error("Error in getUserById", error)
    }
}

export const clearSelectedUser = (dispatchUser) =>{
    try{
        dispatchUser({
            type: 'CLEAR_SELECTED_USER'
        })
        localStorage.removeItem("selectedUser");
    }catch (error) {
        console.error("Error in clearSelectedUser", error)
    }
}