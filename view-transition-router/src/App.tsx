import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import "./App.css";
import Home from "./pages/Home";
import About from "./pages/About";

function AppContent() {
  function handleClick(e: React.MouseEvent) {
    // 劫持路由修改
    // todo：需要优化
    // 阻止默认的链接点击行为
    e.preventDefault();

    // 获取点击的链接元素
    const link = e.target as HTMLElement;
    if (!link.closest("a")) return;

    const href = (link.closest("a") as HTMLAnchorElement).href;

    // 使用 View Transition API 包装路由切换
    if (document.startViewTransition) {
      document.startViewTransition(() => {
        window.history.pushState({}, "", href);
      });
    } else {
      // 降级处理：直接进行路由跳转
      window.history.pushState({}, "", href);
    }
  }

  return (
    <div className='app'>
      <nav className='nav-bar' onClick={handleClick}>
        <Link to='/' className='nav-link'>
          首页
        </Link>
        <Link to='/about' className='nav-link'>
          关于我们
        </Link>
      </nav>

      <div className='transition-container'>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/about' element={<About />} />
        </Routes>
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
