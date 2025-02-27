import { Route, Routes } from "react-router-dom"
import UserPage from "../pages/Users"
import BlogPage from "../pages/Blogs"
import UserView from "../pages/UserView"
import BlogView from "../pages/BlogsView"

const AppRouter = () => {
    return (
        <Routes>
            <Route path="/users" element={<UserPage />} />
            <Route path="/blogs" element={<BlogPage />} />
            <Route path="/users/:id" element={<UserView />} />
            <Route path="/blogs/:id" element={<BlogView />} />
        </Routes>
    )
}

export default AppRouter