import { resolve } from "path";

export default {
    root: resolve(__dirname, "src"),
    build: {
        outDir: "../dist"
    },
    server: {
        port: 8080
    },
    proxy: {
        "/api": "http://localhost:3000"
    }
}
