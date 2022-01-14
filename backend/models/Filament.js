const db = require("./db-connections/OrderManager-db");
const Libs = require("../libs");

const Schema = db.mongoose.Schema;

const FilamentSchema = Schema(
    {
        color: {
            type: String,
            required: true,
        },
        vendor: {
            type: String,
            required: true,
        },
        store: {
            type: String,
            required: true,
        },
        price: {
            type: Number,
            required: true,
        },
        weight: {
            type: Number,
            required: true,
            default: 1000
        },
    },
    {
        collection: "Filaments",
        versionKey: false,
        timestamps: true,
    }
);

FilamentSchema.statics.createFilament = function (FilamentObj) {
    return this.create(FilamentObj);
};

FilamentSchema.statics.getAllFilaments = function () {
    return this.find({}).exec();
};

FilamentSchema.statics.deleteFilamentPermanent = function (FilamentObj) {
    return this.deleteOne({ _id: FilamentObj });
};

FilamentSchema.statics.decreaseWeight = function (filamentId, weightToRemove) {
    return this.updateOne({ _id: filamentId },
        {
            $inc: {
                weight: -weightToRemove
            }
        }
    )
}

FilamentSchema.statics.increaseWeight = function (filamentId, weightToAdd) {
    return this.updateOne({ _id: filamentId },
        {
            $inc: {
                weight: weightToAdd
            }
        }
    )
}

exports.FilamentModel = db.connection.model("Filament", FilamentSchema);
