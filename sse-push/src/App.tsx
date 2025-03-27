import { useState, useEffect } from "react";
import "./App.css";

interface Comment {
  id: number;
  content: string;
  timestamp: number;
}

const CommentAPI = {
  getComments: async () => {
    try {
      const response = await fetch("http://localhost:3000/api/comments");
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Failed to submit comment:", error);
    }
  },
  addComment: async (content: string) => {
    try {
      await fetch("http://localhost:3000/api/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content }),
      });
    } catch (error) {
      console.error("Failed to submit comment:", error);
    }
  },
};

function App() {
  // const { comments } = useCommentsStore();
  const [newComment, setNewComment] = useState("");
  const [comments, setComments] = useState<Comment[]>([]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    await CommentAPI.addComment(newComment);
    setNewComment("");
  };

  useEffect(() => {
    const initComment = async () => {
      const comments = await CommentAPI.getComments();
      setComments(comments);
    };
    initComment();
  }, []);

  useEffect(() => {
    let eventSource: EventSource | null = null;

    if (eventSource) return;
    eventSource = new EventSource("http://localhost:3000/api/comments/stream", { withCredentials: false });

    // 没有设置事件类型，默认为 message
    eventSource.onmessage = (event) => {
      console.log("onmessage", event);
    };

    eventSource.onerror = () => {
      console.log("SSE 连接断开，尝试重连...");
      // setTimeout(initSSE, 3000);
    };

    eventSource.onopen = () => {
      console.log("connection open");
    };

    // 根据事件类型进行处理
    eventSource.addEventListener("comment", (event) => {
      const comment = JSON.parse(event.data);
      setComments((prevComments) => [comment, ...prevComments]);
    });

    eventSource.addEventListener("other", (event) => {
      console.log("other event", event);
    });

    return () => {
      if (eventSource) eventSource.close();
    };
  }, []);

  return (
    <div className='container'>
      <h1>实时评论</h1>

      <form onSubmit={handleSubmit} className='comment-form'>
        <input
          type='text'
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder='输入评论...'
        />
        <button type='submit'>发送</button>
      </form>

      <div className='comments-list'>
        {comments.map((comment) => (
          <div key={comment.id} className='comment'>
            <p>{comment.content}</p>
            <small>{new Date(comment.timestamp).toLocaleString()}</small>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
