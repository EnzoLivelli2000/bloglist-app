import { NavLink, useParams } from "react-router-dom";
import { clearSelectedUser, getUserById, useUser } from "../features/users/userContext";
import { useEffect } from "react";

const UserView = () => {
    const { id } = useParams();
    const { state, dispatch } = useUser();

    useEffect(() => {
        if (!state.selectedUser && id) {
            getUserById(dispatch, id)
        }
        return () => {
            clearSelectedUser(dispatch)
        }
    }, [id, dispatch]);

    const user = state?.selectedUser;

    if (!user) {
        return <p>Loading...</p>;
    } else {
        return (
            <div>
                <h2>{user.name}</h2>
                <h3>Added blogs</h3>
                <ul>
                    {user.blogs && user.blogs.map(blog => (
                        <li key={blog.id}>{blog.title}</li>
                    ))}
                </ul>
            </div>
        );
    }
}

export default UserView;
