const { ObjectId } = require("mongodb");
const { email } = require("mongodb");

class UserService {
    constructor(client) {
        this.user = client.db().collection("user");
    }
    // Định nghĩa các phương thức truy xuất CSDL sử dụng mongodb API
    extractUserData(payload) {
        const user = {
            name: payload.name,
            email: payload.email,
            pass: payload.pass,
            address: payload.address,
	        year: payload.year,
        };
        // Remove undefined fields
        Object.keys(user).forEach(
            (key) => user[key] === undefined && delete user[key]
        );
        return user;
    }
    async createUser(payload) {
        const user = this.extractUserData(payload);
        const result = await this.user.findOneAndUpdate(
            user,
            { $set: {} },
            { returnDocument: "after", upsert: true }
        );
        return result.value;
    }
    async findUser(emailuser) {
        // const cursor = await this.user.findUser(filter);
        return await this.user.findOne({
            email: emailuser
        });
    }
}
module.exports = UserService;