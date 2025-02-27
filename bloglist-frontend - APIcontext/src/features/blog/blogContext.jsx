import blogService from "../../services/blogs";
import commentService from "../../services/comments";
import { createContext, useContext, useEffect, useReducer } from "react";

const initialState = {
    blogsList: [],
    selectedBlog: JSON.parse(localStorage.getItem("selectedBlog")) || null
};

const blogReducer = (state, action) => {
    switch (action.type) {
        case 'GET_BLOGS':
            return { ...state, blogsList: action.payload }
        case 'SET_BLOG':
            return { ...state, blogsList: [...state.blogsList, action.payload] }; // Agrega un nuevo blog
        case 'UPDATE_BLOG':
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
        case 'DROP_BLOG':
            return {
                ...state,
                blogsList: state.blogsList.filter(blog => blog.id !== action.payload.id),
            };
        case 'GET_BLOG':
            const blogFound = action.payload;
            const foundBlog = state.blogsList.find(blog => blog.id === blogFound.id);
            return {
                ...state,
                selectedBlog: foundBlog || null,
            };
        case 'CLEAR_SELECTED_BLOG':
            return {
                ...state,
                selectedBlog: null,
            };
        case 'CREATE_COMMENT':
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

const BlogContext = createContext();
const BlogDispatchContext = createContext();

export const BlogProvider = ({ children }) => {
    const [state, dispatch] = useReducer(blogReducer, initialState)

    useEffect(() => {
        getAllBlogs(dispatch);
    }, []);

    return (
        <BlogContext.Provider value={state}>
            <BlogDispatchContext.Provider value={dispatch}>
                {children}
            </BlogDispatchContext.Provider>
        </BlogContext.Provider>
    )
}

export const useBlog = () => useContext(BlogContext);
export const useBlogDispatch = () => useContext(BlogDispatchContext)

export const createBlog = async (objectBlog, dispatchBlog) => {
    try {
        const newBlog = await blogService.create(objectBlog);
        dispatchBlog({ type: 'SET_BLOG', payload: newBlog });
    } catch (error) {
        console.error("Error in createBlog:", error);
    }
};

export const getAllBlogs = async (dispatchBlog) => {
    try {
        const blogs = await blogService.getAll();
        dispatchBlog({ type: 'GET_BLOGS', payload: blogs });
    } catch (error) {
        console.error("Error in getAllBlogs:", error);
    }
};

export const toggleLikesOf = async (blog, dispatchBlog) => {
    try {
        const updatedBlog = {
            ...blog,
            likes: blog.likes + 1
        };
        const returnedBlog = await blogService.update(updatedBlog);
        dispatchBlog({ type: 'UPDATE_BLOG', payload: returnedBlog });
    } catch (error) {
        console.error("Error in toggleLikesOf:", error);
    }
};

export const deleteBlog = async (blog, dispatchBlog) => {
    try {
        await blogService.remove(blog.id);
        dispatchBlog({ type: 'DROP_BLOG', payload: { id: blog.id } });
    } catch (error) {
        console.error("Error in deleteBlog:", error);
    }
};

export const getBlogById = async (dispatchBlog, id) => {
    try {
        const blog = await blogService.getById(id)
        dispatchBlog({
            type: 'GET_BLOG', payload: blog
        })
        if (blog) {
            localStorage.setItem("selectedBlog", JSON.stringify(blog));
        }
    } catch (error) {
        console.error("Error in getBlogById", error)
    }
}

export const clearSelectedBlog = (dispatchBlog) => {
    try {
        dispatchBlog({
            type: 'CLEAR_SELECTED_BLOG'
        })
        localStorage.removeItem("selectedBlog");
    } catch (error) {
        console.error("Error in clearSelectedBlog", error)
    }
}

export const createComment = async (blogId, comment, dispatchBlog) => {
    try {
        const updatedBlog = await commentService.create(comment, blogId);
        dispatchBlog({ type: 'CREATE_COMMENT', payload: { blogId, comment } });
    } catch (error) {
        console.error("Error in createComment:", error);
    }
};
