import ReactDOM from 'react-dom/client'
import { useState } from 'react'
import { BrowserRouter as Router } from 'react-router-dom'
import App from './App'

import { NotificationProvider } from './features/notification/notificationContext'
import { LoginProvider } from './features/login/loginContext'
import { BlogProvider } from './features/blog/blogContext'
import { UserProvider } from './features/users/userContext'

ReactDOM.createRoot(document.getElementById('root')).render(

    <UserProvider>
        <BlogProvider>
            <LoginProvider>
                <NotificationProvider>
                    <App />
                </NotificationProvider>
            </LoginProvider>
        </BlogProvider>
    </UserProvider>
)