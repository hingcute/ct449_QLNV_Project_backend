const { ObjectId } = require("mongodb");

class StaffService {
    constructor(client) {
        this.staff = client.db().collection("staff");
    }
    // Định nghĩa các phương thức truy xuất CSDL sử dụng mongodb API
    extractStaffData(payload) {
        const staff = {
            name: payload.name,
            author: payload.author,
            address: payload.address,
            year: payload.year,
            describe: payload.describe,
            brief: payload.brief,
            favorite: payload.favorite,
        };
        // Remove undefined fields
        Object.keys(staff).forEach(
            (key) => staff[key] === undefined && delete staff[key]
        );
        return staff
    }
    async create(payload) {
        const staff = this.extractStaffData(payload);
        const result = await this.staff.findOneAndUpdate(
            staff,
            { $set: { favorite: staff.favorite === true } },
            { returnDocument: "after", upsert: true }
        );
        return result.value;
    }
    async find(filter) {
        const cursor = await this.staff.find(filter);
        return await cursor.toArray();
    }
    async findByName(name) {
        return await this.find({
            name: { $regex: new RegExp(name), $options: "i" },
        });
    }
    async findById(id){
        return await this.staff.findOne({
            _id: ObjectId.isValid(id)? new ObjectId(id) : null,
        });
    }
    async update(id, payload) {
        const filter = {
         _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
        };
        const update = this.extractStaffData(payload);
        const result = await this.staff.findOneAndUpdate(
            filter,
            { $set: update },
            { returnDocument: "after" }
        );
        return result.value;
    }
    async delete(id) {
        const result = await this.staff.findOneAndDelete({
             _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
        });
        return result.value;
    }
    async findFavorite(){
        return await this.find({ favorite: true});
    }   
    async deleteAll(){
        const result = await this.staff.deleteMany({});
        return result.deletedCount;
    }
}
module.exports = StaffService;