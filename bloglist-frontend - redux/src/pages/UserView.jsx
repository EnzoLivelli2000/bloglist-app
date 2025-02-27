import { useDispatch, useSelector } from "react-redux"
import { clearSelectedUser, getUserById } from "../features/users/userReducer"
import { useEffect } from "react"
import { useParams } from "react-router-dom"

const UserView = () => {
    const { id } = useParams()
    const dispatch = useDispatch()
    const user = useSelector((state) => state.userReducer.selectedUser)

    useEffect(() => {
        if (!user && id) {
            dispatch(getUserById(id));
        }
        return () => {
            dispatch(clearSelectedUser());
        };
    }, [id]);

    if (!user) {
        return <p>Loading...</p>;
    } else {
        return (
            <div>
                <h2>{user.name}</h2>
                <h3>added blogs</h3>
                <ul>
                    {user.blogs.map(blog => (
                        <li key={blog.id}>{blog.title}</li>
                    ))}
                </ul>
            </div>
        );
    }
}

export default UserView