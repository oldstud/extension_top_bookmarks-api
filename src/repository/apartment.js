const ApartmentShema = require('../schemas/apartment.js')
const ObjectId = require('mongoose').Types.ObjectId;
const { HttpCode } = require('../helpers/constants.js')
const { ErrorHandler } = require('../helpers/errorHandler')

class ApartmentRepository {
    constructor() {
        this.model = ApartmentShema
    }

    _checkId(id) {
        if (!ObjectId.isValid(id)) {
            throw new ErrorHandler(HttpCode.BAD_REQUEST, `id: not valid!`, "Bad Request")
        }
    }

    async getAll() {
        const results = await this.model.find({})
        return results
    }

    async getByID(objectId) {
        this._checkId(objectId)
        const result = await this.model.findOne({ _id: objectId })
        return result
    }

    async getAllMy(userId) {
        const results = await this.model.find({ owner: userId }).exec()
        return results
    }

    async getByIDMy(id, userId) {
        this._checkId(id)
        const result = await this.model.findOne({ _id: id, owner: userId }).select("-__v").populate({
            path: 'owner',
            select: 'name email -_id'
        })
        return result
    }

    async create(body, userId) {
        const result = await this.model.create({ ...body, owner: userId })
        return result
    }

    async update(id, body, userId) {
        this._checkId(id)
        const result = await this.model.findByIdAndUpdate({ _id: id }, { ...body }, { new: true }).select("-__v")
        return result
    }

    async remove(id, userId) {
        this._checkId(id)
        const result = await this.model.findByIdAndRemove({ _id: id, owner: userId }).select("-__v")
        return result
    }
}


module.exports = ApartmentRepository