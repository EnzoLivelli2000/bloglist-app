import { useDispatch, useSelector } from "react-redux"
import { getAllBlog } from "./blogReducer"
import { useEffect, useRef } from "react"
import { NavLink } from "react-router-dom"


const BlogTitle = ({ title, id }) => {
    return (
        <p><NavLink to={`/blogs/${id}`}>{title}</NavLink></p>
    )
}

const Blogs = () => {
    const dispatch = useDispatch()
    const blogs = useSelector((state) => state.blog.blogsList)

    useEffect(() => {
        dispatch(getAllBlog())
    }, [])

    return (
        <div>
            {blogs.map(blog =>
                <BlogTitle key={blog.id} title={blog.title} id={blog.id}/>
            )}
        </div>
    )
}

export default Blogs