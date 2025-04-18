import express, { Request, Response } from "express";
import cors from "cors";

interface Comment {
  id: number;
  content: string;
  timestamp: number;
}

const app = express();
app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type"],
    credentials: true,
  })
);

const comments: Comment[] = [
  {
    id: 1,
    content: "这是第一条默认评论",
    timestamp: Date.now() - 3000,
  },
  {
    id: 2,
    content: "这是第二条默认评论",
    timestamp: Date.now() - 2000,
  },
  {
    id: 3,
    content: "这是第三条默认评论",
    timestamp: Date.now() - 1000,
  },
];
let clients: Response[] = [];

// 获取所有评论
app.get("/api/comments", (req: Request, res: Response) => {
  res.json(comments);
});

let id = 0;
// 添加新评论
app.post("/api/comments", (req: Request, res: Response) => {
  const { content } = req.body;
  if (!content) {
    res.status(400).json({ error: "评论内容不能为空" });
    return;
  }

  const newComment: Comment = {
    id: Date.now(),
    content,
    timestamp: Date.now(),
  };

  comments.unshift(newComment);

  // 向所有已连接的客户端推送新评论
  clients.forEach((client) => {
    if (!client.writableEnded) {
      // Event 格式
      // 可以对 type/id/data/time 进行设置
      // devtool 中 type 字段对应 event字段
      client.write(`event: comment\nid: ${id++}\ndata: ${JSON.stringify(newComment)}\n\n`);
      // 一次可以发送多个 Event
      client.write(`event: other\nid: ${id++}\ndata:new data\n\n`);
    }
  });

  res.status(201).json(newComment);
});

// SSE 连接端点
app.get("/api/comments/stream", (req: Request, res: Response) => {
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  res.flushHeaders();

  res.write(`retry: 5000\n`);

  clients.push(res);

  // 客户端断开连接时，移除客户端
  req.on("close", () => {
    clients = clients.filter((client) => client !== res); // 移除关闭的客户端
  });
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
