import { NavLink } from "react-router-dom"
import { getAllUsers, useUser } from "./userContext"
import { useEffect } from "react"

const Users = () => {
    const { state, dispatch } = useUser()

    useEffect(() => {
        getAllUsers(dispatch)
    }, [state.usersList]);

    const users = state?.usersList
    return (
        <div>
            <h1>Users</h1>
            <table>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Blogs</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map(user => (
                        <tr key={user.id}>
                            <td>
                                <NavLink to={`/users/${user.id}`}>{user.name}</NavLink>
                            </td>
                            <td>{user.blogs.length}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )

}

export default Users