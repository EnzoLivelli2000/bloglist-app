import { useState } from "react"
import PropTypes from 'prop-types';
import Details from './Details'

const Blog = ({ blog, handleLike, handleRemoveBlog }) => {
  return (
    <div className="blog">
      <h2 className="blog-title">{blog.title}</h2>
      <p className="blog-author">Author: {blog.author}</p>
      <Details buttonLabel='View'>
        <p className="blog-url">Url: {blog.url}</p>
        <p className="blog-likes">Likes: {blog.likes} <button onClick={handleLike}>❤</button></p>
        <p className="blog-user">User: {blog.user.username}</p>
      </Details>
      <button className="remove-button" onClick={handleRemoveBlog}>Remove</button>
    </div>
  )
}

Blog.propTypes = {
  blog: PropTypes.shape({
    title: PropTypes.string.isRequired,
    author: PropTypes.string.isRequired,
    url: PropTypes.string,
    likes: PropTypes.number,
    user: PropTypes.shape({
      username: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
  handleLike: PropTypes.func.isRequired,
  handleRemoveBlog: PropTypes.func.isRequired,
};

export default Blog
