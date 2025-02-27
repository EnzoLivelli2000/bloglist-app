import { useEffect, useRef, useState } from "react"
import LoginForm from "../components/LoginForm"
import { handleLogin, handleLogout, handleLogged } from '../features/login/loginReducer'
import { useDispatch, useSelector } from "react-redux"
import Toggleable from "../components/Togglable"
import BlogForm from "../components/BlogForm"
import Notification from "../features/notification/notification"

const LoginPage = () => {

    const [loginVisible, setLoginVisible] = useState(false)
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')

    useEffect(() => {
        dispatch(handleLogged())
    }, [])

    const user = useSelector((state) => state.login)
    const blogFormRef = useRef()

    const hideWhenVisible = { display: loginVisible ? 'none' : '' }
    const showWhenVisible = { display: loginVisible ? '' : 'none' }

    const dispatch = useDispatch()

    const loginFunction = async (event) => {
        event.preventDefault()
        dispatch(handleLogin(username, password))
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