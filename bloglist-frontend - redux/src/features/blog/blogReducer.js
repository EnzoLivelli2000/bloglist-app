import { createSlice } from "@reduxjs/toolkit";
import blogService from "../../services/blogs";
import commentService from "../../services/comments"

const initialState = {
    blogsList: [],
    selectedBlog: null
}

const blogSlice = createSlice({
    name: 'blogs',
    initialState: initialState,
    reducers: {
        setBlogs: (state, action) => {
            return { ...state, blogsList: action.payload };
        },
        addBlog: (state, action) => {
            return { ...state, blogsList: [...state.blogsList, action.payload] };
        },
        updateBlog: (state, action) => {
            const updatedBlogsList = state.blogsList.map(blog =>
                blog.id === action.payload.id ? action.payload : blog
            );

            const updatedSelectedBlog =
                state.selectedBlog && state.selectedBlog.id === action.payload.id
                    ? action.payload
                    : state.selectedBlog;

            localStorage.setItem("selectedBlog", JSON.stringify(updatedSelectedBlog));

            return {
                ...state,
                blogsList: updatedBlogsList,
                selectedBlog: updatedSelectedBlog
            };// Actualiza el blog específico
        },
        removeBlog: (state, action) => {
            return {
                ...state,
                blogsList: state.blogsList.filter(blog => blog.id !== action.payload.id),
            };
        },
        getById: (state, action) => {
            return { ...state, selectedBlog: action.payload }
        },
        clearSelected: (state, action) => {
            return {
                ...state,
                selectedBlog: null,
            };
        },
        setComment: (state, action) => {
            const { blogId, comment } = action.payload;
            const updatedBlogsWithComment = state.blogsList.map(blog =>
                blog.id === blogId
                    ? { ...blog, comments: [...(blog.comments || []), comment] }
                    : blog
            );

            const updatedSelectedBlogWithComment =
                state.selectedBlog && state.selectedBlog.id === blogId
                    ? { ...state.selectedBlog, comments: [...(state.selectedBlog.comments || []), comment] }
                    : state.selectedBlog;

            localStorage.setItem("selectedBlog", JSON.stringify(updatedSelectedBlogWithComment));

            return {
                ...state,
                blogsList: updatedBlogsWithComment,
                selectedBlog: updatedSelectedBlogWithComment
            };
        }
    }
})

export const { setBlogs, addBlog, updateBlog, removeBlog, getById, clearSelected, setComment } = blogSlice.actions

export const createBlog = objectBlog => {
    return async dispatch => {
        const newBlog = await blogService.create(objectBlog)
        dispatch(addBlog(newBlog))
    }
}

export const getAllBlog = () => {
    return async dispatch => {
        const blogs = await blogService.getAll()
        dispatch(setBlogs(blogs))
    }
}

export const toggleLikesOf = (blog) => {
    return async dispatch => {
        const updatedBlog = {
            ...blog,
            likes: blog.likes + 1
        }
        const returnedBlog = await blogService.update(updatedBlog)
        dispatch(updateBlog(returnedBlog))
    }
}

export const deleteBlog = (blog) => {
    return async dispatch => {
        await blogService.remove(blog.id)
        dispatch(removeBlog(blog))
    }
}

export const getBlogById = (id) => {
    return async dispatch => {
        const returnedBlog = await blogService.getById(id)
        console.log("returnedBlog: ", returnedBlog)
        dispatch(getById(returnedBlog))
    }
}

export const clearSelectedBlog = () => {
    return async dispatch => {
        dispatch(clearSelected())
    }
}

export const createComment = (id, comment) => {
    return async dispatch => {
        const updatedBlog = await commentService.create(comment, id);
        dispatch(setComment(updatedBlog))
    }
}

export default blogSlice.reducer