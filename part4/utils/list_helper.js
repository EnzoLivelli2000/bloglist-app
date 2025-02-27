const dummy = (blogs) => {
    return 1; 
}
 
const totalLikes = (blogs) => {
    return blogs.reduce((sum, blog) => sum + blog.likes, 0);  
}

const mostBlogs = (blogs) => {
    const authorBlogCounts = blogs.reduce((counts, blog) => {
      counts[blog.author] = (counts[blog.author] || 0) + 1;
      return counts;
    }, {});
  
    let maxBlogs = 0;
    let authorWithMostBlogs = null;
  
    for (const author in authorBlogCounts) {
      if (authorBlogCounts[author] > maxBlogs) {
        maxBlogs = authorBlogCounts[author];
        authorWithMostBlogs = author;
      }
    }
  
    return {
      author: authorWithMostBlogs,
      blogs: maxBlogs
    };
}

const mostLikes = (blogs) => {
    // Objeto para contar la cantidad total de likes por autor
    const authorLikesCounts = blogs.reduce((counts, blog) => {
      counts[blog.author] = (counts[blog.author] || 0) + blog.likes;
      return counts;
    }, {});
  
    // Identificar el autor con más likes
    let maxLikes = 0;
    let authorWithMostLikes = null;
  
    for (const author in authorLikesCounts) {
      if (authorLikesCounts[author] > maxLikes) {
        maxLikes = authorLikesCounts[author];
        authorWithMostLikes = author;
      }
    }
  
    return {
      author: authorWithMostLikes,
      likes: maxLikes
    };
}

module.exports = {
    dummy,
    totalLikes,
    mostBlogs,
    mostLikes
}
  