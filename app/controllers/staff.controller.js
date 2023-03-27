const StaffService = require("../services/staff.service");
const MongoDB = require ("../utils/mongodb.util");
const ApiError = require("../api-error");

exports.create = (req, res) => {
    res.send({message:"create handler"});
};
exports.findAll = (req, res) => {
    res.send({message:"findAll handler"});
};
exports.findOne = (req, res) => {
    res.send({message:"findOne handler"});
};
exports.update = (req, res) => {
    res.send({message:"update handler"});
};
exports.delete = (req, res) => {
    res.send({message:"delete handler"});
};
exports.deleteAll = (req, res) => {
    res.send({message:"deleteAll handler"});
};
exports.findAllFavorite = (req, res) => {
    res.send({message:"findAllFavorite handler"});
};
// Tạo và lưu một nhân sự văn học mới
exports.create = async (req, res, next) =>{
    if (!req.body?.name){
        return next(new ApiError(400, "Tên không được để trống"));
    }

    try{
        const staffservice = new StaffService(MongoDB.client);
        const document = await staffservice.create(req.body);
        return res.send(document);    
    } catch (error) {
        return next(
          new ApiError(500, "Đã xảy ra lỗi khi thêm thông tin nhân sự")
        )
    }
};
// Truy xuất tất cả các liên hệ của người dùng từ cơ sở dữ liệu
exports.findAll = async (req, res, next) => {
    let documents = [];

    try {
        const staffService = new StaffService(MongoDB.client);
        const { name } = req.query;
        if (name) {
            documents = await staffService.findByName(name);
        } else {
            documents = await staffService.find({});
        }
    } catch (error) {
        return next(
            new ApiError(500, "Đã xảy ra lỗi khi thêm thông tin nhân sự")
        );
    }

    return res.send(documents);
};
// Tìm liên hệ duy nhất với một id
exports.findOne = async (req, res, next) => {
    try{
        const staffService = new StaffService(MongoDB.client);
        const document = await staffService.findById(req.params.id);
        if (!document){
            return next(new ApiError(404, "Không tìm thấy nhân sự này"));
        }
        return res.send(document);
    }catch (error){
        return next(
            new ApiError(
                500,
                `Lỗi khi truy xuất nhân sự với id=${req.params.id}`
            )
        );
    }
}
// Cập nhật một nhân sự theo id trong yêu cầu
exports.update = async (req, res, next) => {
    if (Object.keys(req.body).length === 0){
        return next(new ApiError(400, "Không được để trống dữ liệu cần cập nhật"));
    }
    try{
        const staffService = new StaffService(MongoDB.client);
        const document = await staffService.update(req.params.id, req.body);
        if(!document){
            return next(new ApiError(404, "Không tìm thấy nhân sự này"));
        }
        return res.send({ message: "nhân sự đã được cập nhật thành công"});
    }catch (error){
        return next(
            new ApiError(500, `Lỗi khi cập nhật nhân sự với id=${req.params.id}`)
        );
    }
};
// Xóa một nhân sự với id được chỉ định theo yêu cầu
exports.delete = async (req, res, next) => {
    try {
        const staffService = new StaffService(MongoDB.client);
        const document = await staffService.delete(req.params.id);
        if(!document) {
            return next(new ApiError(404, "Không tìm thấy nhân sự này"));
        }
        return res.send({message: "Xóa nhân sự thành công"});
    } catch (error) {
        return next(
            new ApiError(
                500,
                `Không thể xóa nhân sự với id=${req.params.id}`
            )
        );
    }
};
// Tìm tất cả các nhân sự yêu thích của người dùng
exports.findAllFavorite = async (_req, res, next) => {
    try{
        const staffService = new StaffService(MongoDB.client);
        const documents = await staffService.findFavorite();
        return res.send(documents);
    }catch (error){
        return next(
            new ApiError(
                500,
                "Đã xảy ra lỗi khi truy xuất nhân sự yêu thích"
            )
        );
    }
};
// Xóa tất cả nhân sự của người dùng khỏi cơ sở dữ liệu
exports.deleteAll = async (_req, res, next) => {
    try {
        const staffService = new StaffService(MongoDB.client);
        const deletedCount = await staffService.deleteAll();
        return res.send({
            message: `${deletedCount} Nhân sự đã được xóa thành công`,
        });
    }catch (error){
        return next(
            new ApiError(500, "Đã xảy ra lỗi khi xóa tất cả nhân sự")
        );
    }
};