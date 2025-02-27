import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate, useParams } from "react-router-dom"
import { clearSelectedBlog, createComment, deleteBlog, getBlogById, toggleLikesOf } from "../features/blog/blogReducer"
import Details from "../components/Details"
import { setNotification } from "../features/notification/notificationReducer"

const BlogView = () => {
    const { id } = useParams()
    const dispatch = useDispatch()
    const blog = useSelector((state) => state.blog.selectedBlog)
    const navigate = useNavigate();
    const [newComment, setnewComment] = useState('')

    useEffect(() => {
        if (!blog && id) {
            dispatch(getBlogById(id))
        }
        return () => {
            dispatch(clearSelectedBlog())
        }
    }, [])

    const handleRemoveBlog = async (blog) => {
        try {
            await dispatch(deleteBlog(blog))
            await dispatch(setNotification({ payload: `The blog "${blog.title}" was successfully deleted.` }))
            navigate("/blogs");
        } catch (error) {
            console.error('Error al eliminar el blog:', error);
        }

    }

    const addComment = async (event) => {
        event.preventDefault()
        const commentAdd = { comment: newComment }

        await dispatch(createComment(id, commentAdd))
        setnewComment('')
        await dispatch(getBlogById(id))
    }


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
                <button className="remove-button" onClick={() => handleRemoveBlog(blog)}>Remove Blog</button>
            </div>
        );
    }
}

export default BlogView