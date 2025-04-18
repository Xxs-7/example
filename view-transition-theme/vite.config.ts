import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { visualizer } from "rollup-plugin-visualizer";
// import importToCDN from "vite-plugin-cdn-import";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    visualizer({
      open: true, // 构建完成后自动打开
      filename: "stats.html", // 分析文件名
      gzipSize: true, // 显示 gzip 大小
      brotliSize: true, // 显示 brotli 大小
    }),
    // importToCDN({
    //   modules: [
    //     {
    //       name: "react",
    //       var: "React",
    //       path: "https://unpkg.com/react@18/umd/react.production.min.js",
    //     },
    //     {
    //       name: "react-dom",
    //       var: "ReactDOM",
    //       path: "https://unpkg.com/react-dom@18/umd/react-dom.production.min.js",
    //     },
    //     {
    //       name: "antd",
    //       var: "antd",
    //       path: "https://cdnjs.cloudflare.com/ajax/libs/antd/5.17.3/antd.min.js",
    //     },
    //   ],
    // }),
  ],
  // build: {
  //   rollupOptions: {
  //     external: ["react", "react-dom", "antd"],
  //     output: {
  //       globals: {
  //         react: "React",
  //         "react-dom": "ReactDOM",
  //         antd: "antd",
  //       },
  //     },
  //   },
  // },
});
