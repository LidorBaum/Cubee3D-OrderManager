const db = require('./db-connections/OrderManager-db');
const Libs = require('../libs');

const Schema = db.mongoose.Schema;
const VaseSizeSchema = Schema({
    height: {
        type: Number,
        required: true,
    },
    diamter: {
        type: Number,
        required: true,
    },
    weight: {
        type: Number,
        required: true,
    },
    printTime: {
        type: Number,
        required: true,
    },
});
const VaseSchema = Schema(
    {
        name: {
            type: String,
            required: true,
        },
        image: {
            type: String,
        },
        type: {
            type: String,
            enum: ['Bowl', 'Planter', 'Vase'],
        },
        sizes: {
            small: {
                type: VaseSizeSchema,
                default: null,
            },
            medium: {
                type: VaseSizeSchema,
                default: null,
            },
            large: {
                type: VaseSizeSchema,
                default: null,
            },
        },
    },
    {
        collection: 'Vases',
        versionKey: false,
        timestamps: true,
    }
);

VaseSchema.statics.createVase = function (vaseObj) {
    return this.create(vaseObj);
};

VaseSchema.statics.getAllVases = function () {
    return this.find({}).exec();
};

VaseSchema.statics.deleteVase = function (vaseObj) {
    return this.deleteOne({ _id: vaseObj });
};

// UserSchema.statics.getByEmail = async function (email) {
//   console.log("getting by email");
//   const user = await this.findOne({ email: email });
//   console.log(user, "USER FROM EMAIL");
//   return user;
// };
// UserSchema.statics.getById = function (userId) {
//   return this.findById(userId);
// };
// VaseSchema.statics.updateVase = function (vaseObj) {
//   return this.findOneAndUpdate(
//     { _id: vaseObj._id },
//     {
//       $set: {
//         name: userObj.name,
//         email: userObj.email,
//       },
//     },
//     { new: true }
//   );
// };

exports.VaseModel = db.connection.model('Vase', VaseSchema);
