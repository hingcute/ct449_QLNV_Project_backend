const { ObjectId } = require("mongodb");

class TodoService {
    constructor(client) {
        this.todo = client.db().collection("todo");
    }
    // Định nghĩa các phương thức truy xuất CSDL sử dụng mongodb API
    extractTodoData(payload) {
        const todo = {
            title: payload.title,
            description: payload.description,
            
        };
        // Remove undefined fields
        Object.keys(todo).forEach(
            (key) => todo[key] === undefined && delete todo[key]
        );
        return todo
    }
    async create(payload) {
        const todo = this.extractTodoData(payload);
        const result = await this.todo.findOneAndUpdate(
            todo,
            { $set: { favorite: todo.favorite === true } },
            { returnDocument: "after", upsert: true }
        );
        return result.value;
    }
    async find(filter) {
        const cursor = await this.todo.find(filter);
        return await cursor.toArray();
    }
    async findByTitle(title) {
        return await this.find({
            title: { $regex: new RegExp(title), $options: "i" },
        });
    }
    async findById(id){
        return await this.todo.findOne({
            _id: ObjectId.isValid(id)? new ObjectId(id) : null,
        });
    }
    async update(id, payload) {
        const filter = {
         _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
        };
        const update = this.extractTodoData(payload);
        const result = await this.todo.findOneAndUpdate(
            filter,
            { $set: update },
            { returnDocument: "after" }
        );
        return result.value;
    }
    async delete(id) {
        const result = await this.todo.findOneAndDelete({
             _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
        });
        return result.value;
    }
    async findFavorite(){
        return await this.find({ favorite: true});
    }   
    async deleteAll(){
        const result = await this.todo.deleteMany({});
        return result.deletedCount;
    }
}
module.exports = TodoService;