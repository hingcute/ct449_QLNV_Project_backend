const express = require("express");
const cors = require("cors");
const staffsRouter = require("./app/routes/staff.route");
const usersRouter = require("./app/routes/user.route");
const req = require("express/lib/request");
const res = require("express/lib/response");
const ApiError = require("./app/api-error");

const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/contacts", staffsRouter);
app.use("/api/users", usersRouter);

app.get("/", (req, res) => {
    res.json({ message: "Chào mừng đến với ứng dụng quản lý thông tin nhân sự!"});
});

// handle 404 response
app.use((req, res, next) => {
    // Code ở đây sẽ chạy khi không có route được định nghĩa nào
    //      khớp với yêu cầu. Gọi next() để chuyển sang middleware xử lý lỗi
    return next(new ApiError(404, "Resource not found"));
});

// define error-handling middleware last, after other app.use() and routes calls
app.use((err, req, res, next) => {
    // Middleware xử lý lỗi tập trung.
    // Trong các đoạn code xử lý ở các route, gọi next(error)
    //      sẽ chuyển về middleware xử lý lỗi này
    return res.status(err.statusCode || 500).json({
        message: err.message || "Internal Server Error",
    });
});

module.exports = app;