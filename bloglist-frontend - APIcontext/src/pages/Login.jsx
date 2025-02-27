import { useRef, useState } from "react";
import { useNotification } from "../features/notification/notificationContext";
import { handleLogin, useUser, useUserDispatch } from "../features/login/loginContext";
import LoginForm from "../components/LoginForm";
import BlogForm from "../components/BlogForm";
import Toggleable from "../components/Togglable";
import Notification from "../features/notification/notification";

const LoginPage = () => {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [loginVisible, setLoginVisible] = useState(false)

    const { dispatch: dispatchNotification } = useNotification();
    const loginDispatch = useUserDispatch();

    const user = useUser()
    const blogFormRef = useRef()

    const loginFunction = async (event) => {
        event.preventDefault()
        await handleLogin(username, password, dispatchNotification, loginDispatch);
        setUsername('')
        setPassword('')
    };

    const blogForm = () => (
        <Toggleable buttonLabel='new blog' ref={blogFormRef}>
            <BlogForm />
        </Toggleable>
    )

    const loginForm = () => {
        const hideWhenVisible = { display: loginVisible ? 'none' : '' }
        const showWhenVisible = { display: loginVisible ? '' : 'none' }

        return (
            <div>
                <div style={hideWhenVisible}>
                    <button onClick={() => setLoginVisible(true)}>Log In</button>
                </div>
                <div style={showWhenVisible}>
                    <LoginForm
                        username={username}
                        password={password}
                        handleUsernameChange={({ target }) => setUsername(target.value)}
                        handlePasswordChange={({ target }) => setPassword(target.value)}
                        handleSubmit={loginFunction}
                    />
                    <button onClick={() => setLoginVisible(false)}>Cancel</button>
                </div>
            </div>
        )
    }

    return (
        <div>
            <Notification />
            {!user && loginForm()}
            {user &&
                (<div>
                    {blogForm()}
                </div>)}
        </div>
    )

}

export default LoginPage