const db = require('./db-connections/OrderManager-db');
const Libs = require('../libs');
var uniqueValidator = require('mongoose-unique-validator');

const Schema = db.mongoose.Schema;

const UserSchema = Schema(
    {
        name: {
            type: String,
            unique: true,
            required: true,
            uniqueCaseInsensitive: true,
            index: true,
        },
        password: {
            type: String,
        },
        type: {
            type: String,
            required: true,
            default: 'customer',
            enum: ['admin', 'customer'],
        },
        image: {
            type: String,
        },
    },
    {
        collection: 'Users',
        versionKey: false,
        timestamps: true,
    }
);

UserSchema.plugin(uniqueValidator, {
    message: 'Error, expected {PATH} to be unique.',
});

UserSchema.statics.getExistanceAndType = function (name) {
    return this.findOne({ name: { $regex: `^${name}$`, $options: 'i' } });
};

UserSchema.statics.createUser = function (userObj) {
    return this.create(userObj);
};

UserSchema.statics.getAllUsers = function () {
    return this.find({}, { password: 0 }).sort({ name: 1 }).exec();
};

UserSchema.statics.getById = function (userId) {
    return this.findById(userId);
};

UserSchema.statics.deleteUser = function (userId) {
    return this.deleteOne({ _id: userId });
};

UserSchema.statics.updateUser = function (userObj) {
    return this.findOneAndUpdate(
        { _id: userObj._id },
        {
            $set: {
                name: userObj.name,
                password: userObj.password,
            },
        },
        { new: true }
    );
};

exports.UserModel = db.connection.model('User', UserSchema);
