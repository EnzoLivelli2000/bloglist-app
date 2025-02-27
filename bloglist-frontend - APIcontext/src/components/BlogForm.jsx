import { useState } from "react";
import { createBlog, useBlogDispatch } from "../features/blog/blogContext";
import { useNotification } from "../features/notification/notificationContext";

const BlogForm = () => {
    const { dispatch: dispatchNotification } = useNotification();
    const dispatchBlog = useBlogDispatch();

    const [newTitle, setNewTitle] = useState('')
    const [newAuthor, setnewAuthor] = useState('')
    const [newUrl, setnewUrl] = useState('')
    const [newLikes, setnewLikes] = useState('')

    const addBlog = async (event) => {
        event.preventDefault()
        const newBlog = {
            title: newTitle,
            author: newAuthor,
            url: newUrl,
            likes: newLikes
        }

        await createBlog(newBlog, dispatchBlog);

        setNewTitle('')
        setnewAuthor('')
        setnewUrl('')
        setnewLikes('')

        dispatchNotification({ type: 'SET_NOTIFICATION', payload: `The blog "${newBlog.title}" was successfully added.` })
    }
    return (
        <div>
            <h2>Create a new blog</h2>

            <form onSubmit={addBlog}>
                <input
                    placeholder="title"
                    value={newTitle}
                    onChange={event => setNewTitle(event.target.value)}
                />
                <input
                    placeholder="author"
                    value={newAuthor}
                    onChange={event => setnewAuthor(event.target.value)}
                />
                <input
                    placeholder="url"
                    value={newUrl}
                    onChange={event => setnewUrl(event.target.value)}
                />
                <input
                    placeholder="likes"
                    value={newLikes}
                    onChange={event => setnewLikes(event.target.value)}
                />
                <button type="submit">Save</button>
            </form>
        </div>
    )
}

export default BlogForm