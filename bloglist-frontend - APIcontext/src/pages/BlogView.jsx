import { useNavigate, useParams } from "react-router-dom";
import { clearSelectedBlog, createComment, deleteBlog, getBlogById, toggleLikesOf, useBlog, useBlogDispatch } from "../features/blog/blogContext";
import { useEffect, useState } from "react";
import { useNotification } from "../features/notification/notificationContext";
import Details from "../components/Details";

const BlogView = () => {
    const { id } = useParams();
    const state = useBlog()
    const dispatch = useBlogDispatch()
    const [newComment, setnewComment] = useState('')

    useEffect(() => {
        if (!state.selectedBlog && id) {
            getBlogById(dispatch, id)
        }
        return () => {
            clearSelectedBlog(dispatch)
        }
    }, [id, dispatch]);

    const { dispatch: dispatchNotification } = useNotification()
    const navigate = useNavigate();

    const handleRemoveBlog = async (blog, dispatch) => {
        deleteBlog(blog, dispatch)
        dispatchNotification({ type: 'SET_NOTIFICATION', payload: `The blog "${blog.title}" was successfully removed.` })
        navigate("/blogs");

    }

    const addComment = async (event) => {
        event.preventDefault()
        const commentAdd = { comment: newComment }

        await createComment(id, commentAdd, dispatch)
        setnewComment('')
    }

    const blog = state?.selectedBlog

    if (!blog) {
        return <p>Loading...</p>;
    } else {
        return (
            <div className="blog">
                <h2 className="blog-title">{blog.title}</h2>
                <p className="blog-author">Author: {blog.author}</p>
                <p className="blog-url">Url: {blog.url}</p>
                <p className="blog-likes">Likes: {blog.likes} <button onClick={() => { dispatch(toggleLikesOf(blog)) }}>❤</button></p>
                <h3>Comments</h3>
                <ul>
                    {blog.comments.map((comment, index) => (
                        <li key={index}>{typeof comment === 'object' && comment !== null ? comment.comment : String(comment)}</li>
                    ))}
                </ul>
                <Details buttonLabel='Add Comment'>
                    <form onSubmit={addComment}>
                        <input
                            placeholder="Comment here..."
                            value={newComment}
                            onChange={event => setnewComment(event.target.value)} />
                        <button>Send</button>
                    </form>
                </Details>
                <button className="remove-button" onClick={() => { handleRemoveBlog(blog, dispatch) }}>Remove</button>
            </div>
        );
    }

}

export default BlogView;