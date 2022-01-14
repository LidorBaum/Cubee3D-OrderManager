const db = require("./db-connections/OrderManager-db");
const Libs = require("../libs");

const Schema = db.mongoose.Schema;

const OrderSchema = Schema(
    {
        customerName: {
            type: String,
            required: true,
        },
        selectedVasesArray: {
            type: [
                {
                    vaseId: {
                        type: Schema.Types.ObjectId,
                        ref: "Vase",
                        required: true
                    },
                    vaseSize: {
                        type: String,
                        enum: ['small', 'medium', 'large'],
                        required: true
                    },
                    filamentId: {
                        type: Schema.Types.ObjectId,
                        ref: "Filament",
                        required: true
                    },
                    quantity: {
                        type: Number,
                        default: 0
                    },
                    status: {
                        type: String,
                        enum: ["Pending","Approved","Printing","Ready","Shipped","Delivered","Cancelled"],
                        default: "Pending",
                    },
                    storeAddress:{
                        type: String,
                    }
                },
            ],
            required: true,
            default: []
        }
    },
    {
        collection: "Orders",
        versionKey: false,
        timestamps: true,
    }
);


// UserSchema.statics.linkDogToUser = function (userId, dogId) {
//   return this.findOneAndUpdate(
//     {
//       _id: userId,
//     },
//     {
//       $addToSet: {
//         dogsIds: dogId,
//       },
//     }
//   );
// };

// UserSchema.statics.createUser = function (userObj) {
//   return this.create(userObj);
// };

// UserSchema.statics.checkEmailAvailable = function (email) {
//   console.log(email, "email is ");
//   return this.findOne({ email: email });
// };

// UserSchema.statics.getByEmail = async function (email) {
//   console.log("getting by email");
//   const user = await this.findOne({ email: email });
//   console.log(user, "USER FROM EMAIL");
//   return user;
// };

// UserSchema.statics.getAllUsers = function () {
//   return this.find({}).sort({ name: 1 }).exec();
// };

// UserSchema.statics.getById = function (userId) {
//   return this.findById(userId);
// };

// UserSchema.statics.deleteUser = function (userId) {
//   return this.deleteOne({ _id: userId });
// };

// UserSchema.statics.updateUser = function (userObj) {
//   return this.findOneAndUpdate(
//     { _id: userObj._id },
//     {
//       $set: {
//         name: userObj.name,
//         email: userObj.email,
//       },
//     },
//     { new: true }
//   );
// };

exports.OrderModel = db.connection.model("Order", OrderSchema);
