import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"), // Gốc là 'src'
      "@components": "@/components", // Không cần lặp lại path.resolve
      "@services": "@/services",
      "@contexts": "@/context",
    },
  },
  server: {
    host: "0.0.0.0", // Lắng nghe trên mọi địa chỉ IP
    port: 5173, // Đặt cổng mặc định
    open: true, // Tự động mở trình duyệt khi chạy dev server
  },
});
