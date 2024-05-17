import { useState, useEffect } from 'react';
import axios from 'axios';
import './Board.css'; // 별도의 CSS 파일로 분리

function Board() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [editingPostId, setEditingPostId] = useState(null);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = () => {
    axios.get('https://projectsinabro.store/code-server-04ad78a4-55ce-441c-9a37-f8b250706be7/proxy/8080/api/boards')
      .then(response => {
        setPosts(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error('There was an error fetching the posts!', error);
        setLoading(false);
      });
  };

  const handleCreatePost = () => {
    axios.post('https://projectsinabro.store/code-server-04ad78a4-55ce-441c-9a37-f8b250706be7/proxy/8080/api/boards', { title, body })
      .then(response => {
        setPosts([...posts, response.data]);
        setTitle('');
        setBody('');
      })
      .catch(error => {
        console.error('There was an error creating the post!', error);
      });
  };

  const handleUpdatePost = () => {
    axios.put(`https://projectsinabro.store/code-server-04ad78a4-55ce-441c-9a37-f8b250706be7/proxy/8080/api/boards/${editingPostId}`, { title, body })
      .then(response => {
        setPosts(posts.map(post => post.id === editingPostId ? response.data : post));
        setEditingPostId(null);
        setTitle('');
        setBody('');
      })
      .catch(error => {
        console.error('There was an error updating the post!', error);
      });
  };

  const handleEditPost = (post) => {
    setEditingPostId(post.id);
    setTitle(post.title);
    setBody(post.body);
  };

  const handleDeletePost = (postId) => {
    axios.delete(`https://projectsinabro.store/code-server-04ad78a4-55ce-441c-9a37-f8b250706be7/proxy/8080/api/boards/${postId}`)
      .then(() => {
        setPosts(posts.filter(post => post.id !== postId));
      })
      .catch(error => {
        console.error('There was an error deleting the post!', error);
      });
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div className="board">
      <h2>게시판</h2>
      <div className="form">
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <textarea
          placeholder="Body"
          value={body}
          onChange={(e) => setBody(e.target.value)}
        />
        <button onClick={editingPostId ? handleUpdatePost : handleCreatePost}>
          {editingPostId ? 'Update Post' : 'Create Post'}
        </button>
      </div>
      <div className="posts">
        {posts.map(post => (
          <div className="post-card" key={post.id}>
            {editingPostId === post.id ? (
              <>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
                <textarea
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                />
                <button onClick={handleUpdatePost}>Save</button>
                <button onClick={() => setEditingPostId(null)}>Cancel</button>
              </>
            ) : (
              <>
                <h3>{post.title}</h3>
                <p>{post.body}</p>
                <button onClick={() => handleEditPost(post)}>Edit</button>
                <button onClick={() => handleDeletePost(post.id)}>Delete</button>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Board;
