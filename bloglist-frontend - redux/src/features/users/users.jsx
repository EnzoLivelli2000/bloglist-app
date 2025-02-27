import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { getAllUser } from "./userReducer"
import { NavLink } from "react-router-dom"

const User = ({ user }) => {
    return (
        <div>
            <table>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Blogs</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td><NavLink to={`/users/${user.id}`}>{user.name}</NavLink></td>
                        <td>{user.blogs.length}</td>
                    </tr>
                </tbody>
            </table>
        </div>
    )
}

const Users = () => {
    const dispatch = useDispatch()
    const users = useSelector((state) => state.userReducer.usersList)

    useEffect(() => {
        dispatch(getAllUser())
    }, [])

    if(!users){
        return (<p>Loading...</p>)
    }
    return (
        <div>
            {users.map(user =>
                <User key={user.id} user={user} />
            )}
        </div>
    )
}

export default Users