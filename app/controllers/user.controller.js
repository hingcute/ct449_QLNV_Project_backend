const { ObjectId } = require("mongodb");
const UserService = require("../services/user.service");
const MongoDB = require ("../utils/mongodb.util");
const ApiError = require("../api-error");

// exports.createUser = (req, res) => {
//     res.send({message:"create handler"});
// };
// exports.findUser = (req, res) => {
//     res.send({message:"findAll handler"});
// };

// Tạo và lưu một tài khoản
exports.createUser = async (req, res, next) =>{
    if (!req.body?.email && !req.body?.pass){
        return next(new ApiError(400, "email hoặc mật khẩu không được để trống"));
    }

    try{
        const userservice = new UserService(MongoDB.client);
        const document = await userservice.createUser(req.body);
        return res.send(document);    
    } catch (error) {
        return next(
          new ApiError(500, "Đã xảy ra lỗi khi tạo tài khoản")
        )
    }
};
// Tìm liên hệ duy nhất với một id
exports.findUser = async (req, res, next) => {
    try{
        const userservice = new UserService(MongoDB.client);
        const document = await userservice.findUser(req.params.email);
        console.log(req.params.email);
        console.log(document);
        if (!document){
            return next(new ApiError(404, "Không tìm thấy tài khoản"));
        }
        return res.send(document);
    }catch (error){
        return next(
            new ApiError(
                500,
                `Lỗi khi truy xuất tài khoản với id=${req.params.email}`
            )
        );
    }
}