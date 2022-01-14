const db = require("./db-connections/OrderManager-db");
const Libs = require("../libs");

const Schema = db.mongoose.Schema;
const VaseSizeSchema = Schema(
  {
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
      required: true
    },
    printTime: {
      type: Number,
      required: true,
    },
  }
)
const VaseSchema = Schema(
  {
    name: {
      type: String,
      required: true,
    },
    sizes: {
      small:{
        type: VaseSizeSchema,
        default: null
      },
      meduim:{
        type: VaseSizeSchema,
        default: null
      },
      large:{
        type: VaseSizeSchema,
        default: null
      },
      required: true,
    },
  },
  {
    collection: "Vases",
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

exports.VaseModel = db.connection.model("Vase", VaseSchema);
