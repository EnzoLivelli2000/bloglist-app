import loginService from "../../services/login";
import blogService from "../../services/blogs";
import commentService from "../../services/comments"
import { createContext, useContext, useEffect, useReducer } from "react";

const initialState = null;

const loginReducer = (state, action) => {
    switch (action.type) {
        case 'SET_LOGIN':
            blogService.setToken(action.payload.token);
            commentService.setToken(action.payload.token)
            return action.payload;

        case 'SET_LOGOUT':
            blogService.setToken(null);
            commentService.setToken(null)
            return null;

        case 'SET_LOGGED':
            blogService.setToken(action.payload.token);
            commentService.setToken(action.payload.token)
            return action.payload;

        default:
            return state;
    }
};

const UserContext = createContext();
const UserDispatchContext = createContext();

export const LoginProvider = ({ children }) => {
    const [state, dispatch] = useReducer(loginReducer, initialState);

    useEffect(() => {
        const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser');
        if (loggedUserJSON) {
            const user = JSON.parse(loggedUserJSON);
            dispatch({ type: 'SET_LOGGED', payload: user });
        }
    }, []);

    return (
        <UserContext.Provider value={state}>
            <UserDispatchContext.Provider value={dispatch}>
                {children}
            </UserDispatchContext.Provider>
        </UserContext.Provider>
    );
};

export const useUser = () => useContext(UserContext);
export const useUserDispatch = () => useContext(UserDispatchContext);

export const handleLogin = async (username, password, dispatchNotification, dispatch) => {
    try {
        const user = await loginService.login({ username, password });
        dispatch({ type: 'SET_LOGIN', payload: user });
        window.localStorage.setItem('loggedBlogappUser', JSON.stringify(user));
        dispatchNotification({ type: 'SET_NOTIFICATION', payload: 'Login Success' });
        location.reload()
    } catch {
        dispatchNotification({ type: 'SET_NOTIFICATION', payload: 'Wrong credentials' });
    }
};

export const handleLogout = async (dispatchNotification, dispatch) => {
    try {
        dispatch({ type: 'SET_LOGOUT' });
        window.localStorage.removeItem('loggedBlogappUser');
        dispatchNotification({ type: 'SET_NOTIFICATION', payload: 'Logged out successfully' });
    } catch {
        dispatchNotification({ type: 'SET_NOTIFICATION', payload: 'Logged out failed' });
    }
};

export const handleLogged = async (dispatch) => {
    try {
        const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser');
        if (loggedUserJSON) {
            const user = JSON.parse(loggedUserJSON);
            dispatch({ type: 'SET_LOGGED', payload: user });
        }
    } catch (error) {
        console.error('Error handling logged user:', error);
    }
};
