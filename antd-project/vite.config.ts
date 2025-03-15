import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { visualizer } from "rollup-plugin-visualizer";

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
  ],
  build: {
    sourcemap: true, // 建议开启 sourcemap
    rollupOptions: {
      output: {
        manualChunks(id) {
          // 拆包策略
          if (id.includes("node_modules")) {
            // 分离 antd 相关包
            if (id.includes("antd")) {
              return "antd-vendor";
            }
            // 分离 react 相关包
            if (id.includes("react")) {
              return "react-vendor";
            }
            // 其他 node_modules 包
            return "vendor";
          }
          // 分离自定义组件
          if (id.includes("mycomponent")) {
            return "custom-components";
          }
          // 分离业务代码中的路由组件
          if (id.includes("/src/routes/")) {
            return "route-" + id.split("/src/routes/")[1].split("/")[0];
          }
        },
      },
    },
    chunkSizeWarningLimit: 1000, // 提高 chunk 大小警告限制
  },
});
