import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Sidebar from "../../Sidebar"; // Adjust path based on your file structure
import {
  Users,
  MessageSquare,
  ThumbsUp,
  Trash2,
  Image as ImageIcon,
  Plus,
  Bell,
  X,
  Check,
  UserPlus,
  ArrowLeft,
  Send,
  Hash
} from "lucide-react";

const ClubPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [club, setClub] = useState(null);
  const [threads, setThreads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [showAddMember, setShowAddMember] = useState(false);
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [activeCommentPost, setActiveCommentPost] = useState(null);
  const [showRequests, setShowRequests] = useState(false);

  const [postContent, setPostContent] = useState("");
  const [postTags, setPostTags] = useState("");
  const [postImage, setPostImage] = useState(null);

  const [commentText, setCommentText] = useState("");
  const [replyText, setReplyText] = useState("");

  const [allUsers, setAllUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const user = JSON.parse(localStorage.getItem("currentUser"));
  const token = user?.token;

  const config = {
    headers: { Authorization: `Bearer ${token}` },
  };

  /* ================= FETCH DATA (Unchanged Logic) ================= */
  useEffect(() => {
    const fetchClub = async () => {
      try {
        const { data } = await axios.get(`http://localhost:5000/api/bookclub/${id}`, config);
        setClub(data.data);
      } catch {
        setError("Failed to fetch club data");
      } finally {
        setLoading(false);
      }
    };
    fetchClub();
  }, [id]);

  useEffect(() => {
    const fetchThreads = async () => {
      try {
        const { data } = await axios.get(`http://localhost:5000/api/clubpost/club/${id}`, config);
        setThreads(data);
      } catch (err) { console.error(err); }
    };
    fetchThreads();
  }, [id]);

  useEffect(() => {
    if (!showAddMember || !club) return;
    const fetchUsers = async () => {
      try {
        const { data } = await axios.get("http://localhost:5000/api/user/", config);
        const nonMembers = data.users.filter((u) => !club.members.some((m) => m._id === u._id));
        setAllUsers(nonMembers);
      } catch (err) { console.error(err); }
    };
    fetchUsers();
  }, [showAddMember, club]);

  /* ================= ACTIONS (Unchanged Logic) ================= */
  const handleAccept = async (userId) => {
    await axios.post(`http://localhost:5000/api/bookclub/${id}/accept/${userId}`, {}, config);
    setClub((prev) => ({
      ...prev,
      members: [...prev.members, prev.invitedMembers.find((u) => u._id === userId)],
      invitedMembers: prev.invitedMembers.filter((u) => u._id !== userId),
    }));
  };

  const handleDeny = async (userId) => {
    await axios.post(`http://localhost:5000/api/bookclub/${id}/deny/${userId}`, {}, config);
    setClub((prev) => ({
      ...prev,
      invitedMembers: prev.invitedMembers.filter((u) => u._id !== userId),
    }));
  };

  const handleAddMember = async (userId) => {
    await axios.post(`http://localhost:5000/api/bookclub/${id}/add-member`, { userId }, config);
    setClub((prev) => ({
      ...prev,
      members: [...prev.members, allUsers.find((u) => u._id === userId)],
    }));
    setAllUsers((prev) => prev.filter((u) => u._id !== userId));
  };

  const deletePost = async (postId) => {
    if (!window.confirm("Delete this post?")) return;
    await axios.delete(`http://localhost:5000/api/clubpost/${postId}`, config);
    setThreads((prev) => prev.filter((p) => p._id !== postId));
  };

  const createPost = async () => {
    const formData = new FormData();
    formData.append("content", postContent);
    formData.append("tags", postTags);
    if (postImage) formData.append("image", postImage);
    await axios.post(`http://localhost:5000/api/clubpost/club/${id}`, formData, config);
    setShowCreatePost(false);
    window.location.reload();
  };

  const toggleLike = async (postId) => {
    await axios.post(`http://localhost:5000/api/clubpost/like/${postId}`, {}, config);
    window.location.reload();
  };

  const addComment = async (postId) => {
    await axios.post(`http://localhost:5000/api/clubpost/comment/${postId}`, { text: commentText }, config);
    setCommentText("");
    window.location.reload();
  };

  const addReply = async (postId, commentId) => {
    await axios.post(`http://localhost:5000/api/clubpost/reply/${postId}/${commentId}`, { text: replyText }, config);
    setReplyText("");
    window.location.reload();
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center dark:bg-gray-900 text-gray-700 dark:text-white">Loading…</div>;
  if (error) return <div className="min-h-screen p-6 dark:bg-gray-900 text-red-500 text-center">{error}</div>;

  return (
    <div className="w-full min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors font-sans pb-10">
      <Sidebar />
      {/* HEADER (Matching Home Page) */}
      <header className="flex justify-between items-center max-w-7xl mx-auto py-6 px-4 sm:px-8 pl-20">        <div className="flex items-center gap-4">
        <button onClick={() => navigate(-1)} className="p-2 hover:bg-gray-200 dark:hover:bg-gray-800 rounded-full transition-colors">
          <ArrowLeft className="w-6 h-6 text-gray-700 dark:text-gray-300" />
        </button>
        <h1 className="text-3xl font-extrabold text-red-700 dark:text-red-400">BiblioHub</h1>
      </div>

        {club.admin._id === user._id && (
          <button
            onClick={() => setShowRequests(!showRequests)}
            className="relative p-3 rounded-full bg-red-100 text-red-700 hover:bg-red-200 transition-all"
          >
            <Bell className="w-6 h-6" />
            {club.invitedMembers.length > 0 && (
              <span className="absolute top-0 right-0 bg-red-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full border-2 border-white">
                {club.invitedMembers.length}
              </span>
            )}
          </button>
        )}
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-8">

        {/* CLUB HERO SECTION */}
        <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-xl mb-8 flex flex-col md:flex-row items-center gap-8 border border-gray-100 dark:border-gray-700">
          <div className="relative">
            <img
              src={club.avatar || "https://via.placeholder.com/150"}
              alt={club.name}
              className="w-32 h-32 rounded-2xl object-cover shadow-lg border-4 border-red-50"
            />
            <div className="absolute -bottom-2 -right-2 bg-green-500 p-2 rounded-lg text-white shadow-lg">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="flex-1 text-center md:text-left">
            <h2 className="text-4xl font-extrabold text-gray-900 dark:text-white mb-2">{club.name}</h2>
            <div className="flex flex-wrap justify-center md:justify-start gap-4 text-sm font-medium text-gray-500 dark:text-gray-400 mb-4">
              <span className="px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded-full uppercase tracking-wider">{club.privacy}</span>
              <span className="px-3 py-1 bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-full">Admin: {club.admin.name}</span>
            </div>
            <p className="text-gray-600 dark:text-gray-300 max-w-2xl text-lg leading-relaxed">
              {club.description || "Welcome to our book club! Let's dive into some great stories together."}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* FEED COLUMN */}
          <div className="lg:col-span-2 space-y-6">

            {/* START POST BOX */}
            <div
              onClick={() => setShowCreatePost(true)}
              className="bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-md border border-gray-100 dark:border-gray-700 flex items-center gap-4 cursor-pointer hover:border-red-300 transition-all group"
            >
              <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-gray-700 flex items-center justify-center text-red-600">
                <Plus className="w-6 h-6" />
              </div>
              <span className="text-gray-400 font-medium group-hover:text-gray-600">Share something with the club...</span>
            </div>

            {/* THREADS */}
            {threads.map((post) => (
              <div key={post._id} className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden transition-all">
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={
                          post.user.avatar
                            ? (post.user.avatar.startsWith("http") ? post.user.avatar : `http://localhost:5000${post.user.avatar}`)
                            : `https://api.dicebear.com/7.x/avataaars/svg?seed=${post.user.name}`
                        }
                        className="w-10 h-10 rounded-full bg-gray-200 object-cover"
                        alt={post.user.name}
                      />
                      <div>
                        <h4 className="font-bold text-gray-900 dark:text-white">{post.user.name}</h4>
                        <p className="text-xs text-gray-400">{new Date(post.createdAt).toLocaleDateString()}</p>
                      </div>
                    </div>
                    {post.user._id === user._id && (
                      <button onClick={() => deletePost(post._id)} className="text-gray-400 hover:text-red-500 transition-colors">
                        <Trash2 className="w-5 h-5" />
                      </button>
                    )}
                  </div>

                  <div className="text-gray-700 dark:text-gray-300 mb-4 prose dark:prose-invert" dangerouslySetInnerHTML={{ __html: post.content }} />

                  {post.media?.image && (
                    <img src={`http://localhost:5000${post.media.image}`} className="w-full h-auto rounded-xl object-cover mb-4" alt="Post content" />
                  )}

                  <div className="flex flex-wrap gap-2 mb-4">
                    {post.tags.map((t, i) => (
                      <span key={i} className="text-xs font-semibold text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 px-2 py-1 rounded">#{t}</span>
                    ))}
                  </div>

                  <div className="flex gap-6 border-t dark:border-gray-700 pt-4">
                    <button onClick={() => toggleLike(post._id)} className="flex items-center gap-2 text-sm font-bold text-gray-600 dark:text-gray-400 hover:text-red-600">
                      <ThumbsUp className="w-5 h-5" /> {post.likes.length}
                    </button>
                    <button onClick={() => setActiveCommentPost(post._id === activeCommentPost ? null : post._id)} className="flex items-center gap-2 text-sm font-bold text-gray-600 dark:text-gray-400 hover:text-red-600">
                      <MessageSquare className="w-5 h-5" /> {post.comments.length}
                    </button>
                  </div>

                  {/* COMMENTS SECTION */}
                  {activeCommentPost === post._id && (
                    <div className="mt-6 space-y-4 animate-in fade-in slide-in-from-top-2">
                      {post.comments.map((c) => (
                        <div key={c._id} className="bg-gray-50 dark:bg-gray-900/50 p-4 rounded-xl">
                          <div className="flex items-center gap-3 mb-2">
                            <img
                              src={
                                c.user.avatar
                                  ? (c.user.avatar.startsWith("http") ? c.user.avatar : `http://localhost:5000${c.user.avatar}`)
                                  : `https://api.dicebear.com/7.x/avataaars/svg?seed=${c.user.name}`
                              }
                              className="w-8 h-8 rounded-full object-cover"
                              alt={c.user.name}
                            />
                            <div className="flex justify-between w-full text-sm">
                              <span className="font-bold text-red-700 dark:text-red-400">{c.user.name}</span>
                            </div>
                          </div>
                          <p className="text-gray-700 dark:text-gray-300 text-sm ml-11">{c.text}</p>

                          {/* Replies */}
                          {c.replies.map((r) => (
                            <div key={r._id} className="ml-11 mt-3 pl-3 border-l-2 border-red-200 text-sm">
                              <div className="flex items-center gap-2 mb-1">
                                <img
                                  src={
                                    r.user.avatar
                                      ? (r.user.avatar.startsWith("http") ? r.user.avatar : `http://localhost:5000${r.user.avatar}`)
                                      : `https://api.dicebear.com/7.x/avataaars/svg?seed=${r.user.name}`
                                  }
                                  className="w-6 h-6 rounded-full object-cover"
                                  alt={r.user.name}
                                />
                                <span className="font-bold text-gray-800 dark:text-gray-200">{r.user.name}</span>
                              </div>
                              <p className="text-gray-600 dark:text-gray-400 ml-8">{r.text}</p>
                            </div>
                          ))}

                          <div className="mt-3 flex gap-2">
                            <input
                              className="flex-1 bg-white dark:bg-gray-800 border-none rounded-lg px-3 py-1 text-sm focus:ring-1 ring-red-500"
                              placeholder="Reply..."
                              onChange={(e) => setReplyText(e.target.value)}
                            />
                            <button onClick={() => addReply(post._id, c._id)} className="text-red-600 p-1"><Send className="w-4 h-4" /></button>
                          </div>
                        </div>
                      ))}
                      <div className="flex gap-2">
                        <input
                          className="flex-1 bg-gray-100 dark:bg-gray-700 rounded-xl px-4 py-2 text-sm outline-none focus:ring-2 ring-red-500/50"
                          placeholder="Add a comment..."
                          value={commentText}
                          onChange={(e) => setCommentText(e.target.value)}
                        />
                        <button onClick={() => addComment(post._id)} className="bg-red-600 text-white px-4 py-2 rounded-xl text-sm font-bold shadow-lg hover:bg-red-700">Post</button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* SIDEBAR COLUMN */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-xl border border-gray-100 dark:border-gray-700 sticky top-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-extrabold text-gray-900 dark:text-white flex items-center gap-2">
                  <Users className="w-5 h-5 text-red-600" />
                  Members
                </h3>
                <button
                  onClick={() => setShowAddMember(!showAddMember)}
                  className="p-2 bg-red-50 dark:bg-red-900/30 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
                >
                  <UserPlus className="w-5 h-5" />
                </button>
              </div>

              {showAddMember && (
                <div className="mb-6 space-y-3">
                  <input
                    type="text"
                    placeholder="Search users to invite..."
                    className="w-full p-3 bg-gray-50 dark:bg-gray-700 border-none rounded-xl text-sm focus:ring-2 ring-red-500"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  <div className="max-h-48 overflow-y-auto space-y-2 custom-scrollbar">
                    {allUsers
                      .filter((u) => u.name.toLowerCase().includes(searchTerm.toLowerCase()))
                      .map((u) => (
                        <div key={u._id} className="flex items-center justify-between p-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors">
                          <div className="flex items-center gap-2">
                            <img src={u.avatar || `https://ui-avatars.com/api/?name=${u.name}`} className="w-8 h-8 rounded-full" alt="" />
                            <span className="text-sm font-medium dark:text-gray-200">{u.name}</span>
                          </div>
                          <button onClick={() => handleAddMember(u._id)} className="text-xs font-bold text-white bg-green-500 px-3 py-1 rounded-md hover:bg-green-600">Add</button>
                        </div>
                      ))}
                  </div>
                </div>
              )}

              <div className="space-y-4">
                {club.members.map((m) => (
                  <div key={m._id} className="flex items-center gap-3">
                    <img
                      src={
                        m.avatar
                          ? (m.avatar.startsWith("http") ? m.avatar : `http://localhost:5000${m.avatar}`)
                          : `https://api.dicebear.com/7.x/avataaars/svg?seed=${m.name}`
                      }
                      className="w-10 h-10 rounded-full border-2 border-red-50 object-cover"
                      alt={m.name}
                    />
                    <div>
                      <p className="text-sm font-bold text-gray-800 dark:text-gray-200">{m.name}</p>
                      {club.admin._id === m._id && <p className="text-[10px] uppercase tracking-widest text-red-500 font-bold">Admin</p>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* REQUESTS POPUP */}
      {showRequests && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={() => setShowRequests(false)}>
          <div className="bg-white dark:bg-gray-800 w-full max-w-md rounded-3xl shadow-2xl p-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold dark:text-white">Join Requests</h3>
              <button onClick={() => setShowRequests(false)}><X className="w-6 h-6 text-gray-400" /></button>
            </div>
            <div className="space-y-4">
              {club.invitedMembers.length === 0 ? (
                <p className="text-center text-gray-500 py-8">No pending requests</p>
              ) : (
                club.invitedMembers.map((u) => (
                  <div key={u._id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-2xl">
                    <span className="font-bold dark:text-gray-200">{u.name}</span>
                    <div className="flex gap-2">
                      <button onClick={() => handleAccept(u._id)} className="p-2 bg-green-500 text-white rounded-xl shadow-lg hover:bg-green-600"><Check className="w-5 h-5" /></button>
                      <button onClick={() => handleDeny(u._id)} className="p-2 bg-gray-200 text-gray-600 rounded-xl hover:bg-gray-300"><X className="w-5 h-5" /></button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* CREATE POST MODAL */}
      {showCreatePost && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={() => setShowCreatePost(false)}>
          <div className="bg-white dark:bg-gray-800 w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden transition-all scale-up-center" onClick={(e) => e.stopPropagation()}>
            <div className="p-6 border-b dark:border-gray-700 flex justify-between items-center bg-gray-50/50 dark:bg-gray-700/50">
              <h2 className="text-2xl font-bold dark:text-white">Create Club Post</h2>
              <button onClick={() => setShowCreatePost(false)} className="p-2 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-full"><X className="w-6 h-6" /></button>
            </div>
            <div className="p-6 space-y-4">
              <div
                className="min-h-[150px] p-4 bg-gray-50 dark:bg-gray-900 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-2xl focus-within:border-red-500 outline-none overflow-y-auto prose dark:prose-invert"
                contentEditable
                onInput={(e) => setPostContent(e.currentTarget.innerHTML)}
                placeholder="Write your thoughts..."
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <label className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-xl cursor-pointer hover:bg-gray-100 transition-colors">
                  <ImageIcon className="w-5 h-5 text-red-600" />
                  <span className="text-sm font-medium text-gray-600 dark:text-gray-300">{postImage ? postImage.name : "Add Image"}</span>
                  <input type="file" accept="image/*" className="hidden" onChange={(e) => setPostImage(e.target.files[0])} />
                </label>
                <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-xl">
                  <Hash className="w-5 h-5 text-red-600" />
                  <input className="bg-transparent border-none text-sm w-full outline-none" placeholder="Tags (comma separated)" value={postTags} onChange={(e) => setPostTags(e.target.value)} />
                </div>
              </div>
              <button
                onClick={createPost}
                disabled={!postContent}
                className="w-full py-4 bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white font-extrabold rounded-2xl shadow-xl shadow-red-500/20 transition-all flex items-center justify-center gap-2"
              >
                <Send className="w-5 h-5" /> Post to Community
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClubPage;