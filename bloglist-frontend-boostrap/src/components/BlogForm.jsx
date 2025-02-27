import { useState } from "react";

const BlogForm = ({ createBlog }) => {
    const [newTitle, setNewTitle] = useState('')
    const [newAuthor, setnewAuthor] = useState('')
    const [newUrl, setnewUrl] = useState('')
    const [newLikes, setnewLikes] = useState('')

    const addBlog = (event) => {
        event.preventDefault()
        createBlog({
            title: newTitle,
            author: newAuthor,
            url: newUrl,
            likes: newLikes
        })

        setNewTitle('')
        setnewAuthor('')
        setnewUrl('')
        setnewLikes('')
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