import { configureStore } from "@reduxjs/toolkit";
import notificationReducer from '../features/notification/notificationReducer';
import blogReducer from '../features/blog/blogReducer'
import loginReducer from '../features/login/loginReducer'
import userReducer from '../features/users/userReducer'

export const store = configureStore({
    reducer: {
        notification: notificationReducer,
        blog: blogReducer,
        login: loginReducer,
        userReducer: userReducer
    }
})

export default store;