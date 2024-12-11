import React, { useState, useEffect } from "react";
import axios from "axios";

const AddPostPage = () => {
  const [posts, setPosts] = useState([]); // Stores the list of posts
  const [newPost, setNewPost] = useState({
    name: "",
    description: "",
  });
  const [postImage, setPostImage] = useState(null); // Stores the new post image
  const [isEditing, setIsEditing] = useState(false); // Editing mode flag
  const [editPostId, setEditPostId] = useState(null); // Stores post ID being edited

  useEffect(() => {
    fetchPosts();
  }, []);

  // Fetch posts from the server
  const fetchPosts = async () => {
    try {
      const token = localStorage.getItem("token");
      const userId = localStorage.getItem("userId");
      const response = await axios.get(
        `http://localhost:5000/api/posts/${userId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setPosts(response.data);
    } catch (error) {
      console.error("Error fetching posts:", error);
    }
  };

  // Handle form input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewPost({ ...newPost, [name]: value });
  };

  // Handle image upload change
  const handleImageChange = (e) => {
    setPostImage(e.target.files[0]);
  };

  // Handle new post submission
  const handlePostSubmit = async (e) => {
    e.preventDefault();
    if (!newPost.name || !newPost.description) {
      alert("Please fill in all fields");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const userId = localStorage.getItem("userId");

      const formData = new FormData();
      formData.append("name", newPost.name);
      formData.append("description", newPost.description);
      formData.append("userId", userId);
      if (postImage) formData.append("image", postImage);

      const url = isEditing
        ? `http://localhost:5000/api/posts/${editPostId}`
        : `http://localhost:5000/api/posts`;

      const method = isEditing ? "put" : "post";

      const response = await axios[method](url, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      alert(
        isEditing ? "Post updated successfully!" : "Post created successfully!"
      );
      setIsEditing(false);
      setEditPostId(null);
      setNewPost({ name: "", description: "" });
      setPostImage(null);
      fetchPosts();
    } catch (error) {
      console.error("Error submitting post:", error);
      alert("Something went wrong while submitting the post.");
    }
  };

  // Handle post deletion
  const handleDelete = async (postId) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:5000/api/posts/${postId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("Post deleted successfully!");
      fetchPosts();
    } catch (error) {
      console.error("Error deleting post:", error);
      alert("Error deleting post.");
    }
  };

  // Handle edit post
  const handleEdit = (post) => {
    setNewPost({ name: post.name, description: post.description });
    setPostImage(null); // Reset image input for editing
    setIsEditing(true);
    setEditPostId(post._id); // Store post ID for editing
  };

  return (
    <div style={{ padding: "20px", maxWidth: "800px", margin: "0 auto" }}>
      <h1>Add Post</h1>
      {/* Form for creating/updating a post */}
      <form onSubmit={handlePostSubmit} style={{ marginBottom: "30px" }}>
        <div style={{ marginBottom: "15px" }}>
          <label>Post Name:</label>
          <input
            type="text"
            name="name"
            value={newPost.name}
            onChange={handleInputChange}
            required
          />
        </div>

        <div style={{ marginBottom: "15px" }}>
          <label>Post Description:</label>
          <textarea
            name="description"
            value={newPost.description}
            onChange={handleInputChange}
            required
          ></textarea>
        </div>

        <div style={{ marginBottom: "15px" }}>
          <label>Post Image:</label>
          <input type="file" onChange={handleImageChange} />
        </div>

        <button type="submit">
          {isEditing ? "Update Post" : "Create Post"}
        </button>
      </form>

      {/* Table view for displaying posts */}
      <h2>Previous Posts</h2>
      {posts.length > 0 ? (
        <table
          border="1"
          cellPadding="10"
          style={{ width: "100%", textAlign: "left" }}
        >
          <thead>
            <tr>
              <th>Name</th>
              <th>Description</th>
              <th>Image</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {posts.map((post) => (
              <tr key={post._id}>
                <td>{post.name}</td>
                <td>{post.description}</td>
                <td>
                  {post.image && (
                    <img
                      src={`http://localhost:5000/${post.image}`}
                      alt={post.name}
                      style={{
                        width: "50px",
                        height: "50px",
                        objectFit: "cover",
                      }}
                    />
                  )}
                </td>
                <td>
                  <button onClick={() => handleEdit(post)}>Edit</button>
                  <button onClick={() => handleDelete(post._id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No posts available.</p>
      )}
    </div>
  );
};

export default AddPostPage;
