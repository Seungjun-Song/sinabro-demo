import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import './Board.css';

const BASE_URL = 'https://projectsinabro.store/code-server-02bf6410-8172-45d8-8565-42302050df9e/proxy/8080/';

function Board() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [editingPostId, setEditingPostId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState('');
  const [selectedPost, setSelectedPost] = useState(null);

  const modalRef = useRef(null);

  useEffect(() => {
    fetchPosts();
  }, []);

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        closeModal();
        closeDetailModal();
      }
    };
    if (isModalOpen || selectedPost) {
      document.addEventListener('mousedown', handleOutsideClick);
    } else {
      document.removeEventListener('mousedown', handleOutsideClick);
    }
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [isModalOpen, selectedPost]);

  const fetchPosts = () => {
    axios.get(`${BASE_URL}api/boards`)
      .then(response => {
        setPosts(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error('There was an error fetching the posts!', error);
        setLoading(false);
      });
  };

  const openModal = (post = null) => {
    setError('');
    if (post) {
      setEditingPostId(post.id);
      setTitle(post.title);
      setBody(post.body);
      setIsEditing(true);
    } else {
      setEditingPostId(null);
      setTitle('');
      setBody('');
      setIsEditing(false);
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingPostId(null);
    setTitle('');
    setBody('');
    setError('');
  };

  const openDetailModal = (post) => {
    setSelectedPost(post);
    setIsModalOpen(false);
  };

  const closeDetailModal = () => {
    setSelectedPost(null);
  };

  const handleCreateOrUpdatePost = () => {
    if (!title || !body) {
      setError('제목과 내용을 입력해 주세요.');
      return;
    }

    if (isEditing) {
      axios.put(`${BASE_URL}api/boards/${editingPostId}`, { title, body })
        .then(response => {
          setPosts(posts.map(post => post.id === editingPostId ? response.data : post));
          closeModal();
        })
        .catch(error => {
          console.error('There was an error updating the post!', error);
        });
    } else {
      axios.post(`${BASE_URL}api/boards`, { title, body })
        .then(response => {
          setPosts([...posts, response.data]);
          closeModal();
        })
        .catch(error => {
          console.error('There was an error creating the post!', error);
        });
    }
  };

  const handleDeletePost = (postId) => {
    if (window.confirm('정말 삭제하시겠습니까?')) {
      axios.delete(`${BASE_URL}api/boards/${postId}`)
        .then(() => {
          setPosts(posts.filter(post => post.id !== postId));
        })
        .catch(error => {
          console.error('There was an error deleting the post!', error);
        });
    }
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div className="board">
      <h2>게시판</h2>
      <button className="create-post-button" onClick={() => openModal()}>게시글 생성하기</button>
      <div className="posts">
        {posts.map(post => (
          <div className="post-card" key={post.id} onClick={() => openDetailModal(post)}>
            <div className="post-header">
              <h3>{post.title}</h3>
            </div>
            <p>{post.body}</p>
            <div className="post-footer">
              <button className="edit-button" onClick={(e) => { e.stopPropagation(); openModal(post); }}>Edit</button>
              <button className="delete-button" onClick={(e) => { e.stopPropagation(); handleDeletePost(post.id); }}>Delete</button>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="modal">
          <div className="modal-content" ref={modalRef}>
            <span className="close" onClick={closeModal}>&times;</span>
            <h2>{isEditing ? '게시글 수정' : '게시글 생성'}</h2>
            {error && <p className="error">{error}</p>}
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
            <button onClick={handleCreateOrUpdatePost}>
              {isEditing ? 'Update Post' : 'Create Post'}
            </button>
          </div>
        </div>
      )}

      {selectedPost && (
        <div className="modal">
          <div className="modal-content" ref={modalRef}>
            <span className="close" onClick={closeDetailModal}>&times;</span>
            <h2>{selectedPost.title}</h2>
            <p>{selectedPost.body}</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default Board;
