import { useBlog } from "./blogContext"
import { Navigate, NavLink, useNavigate } from "react-router-dom"

const BlogTitle = ({ title, id }) => {
    return (
        <p><NavLink to={`/blogs/${id}`}>{title}</NavLink></p>
    )
}


const Blogs = () => {

    const state = useBlog()

    return (
        <div>
            {state.blogsList.map(blog =>
                <BlogTitle key={blog.id} title={blog.title} id={blog.id} />
            )}
        </div>
    )
}

export default Blogs