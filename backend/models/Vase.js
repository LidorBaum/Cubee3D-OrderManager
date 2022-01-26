const db = require('./db-connections/OrderManager-db');
const Libs = require('../libs');

const Schema = db.mongoose.Schema;

const VaseSizeSchema = Schema({
    height: {
        type: Number,
    },
    diameter: {
        type: Number,
    },
    weight: {
        type: Number,
    },
    printTime: {
        type: String,
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
                // default: {height: null, diameter: null, printTime: null, weight: null},
            },
            medium: {
                type: VaseSizeSchema,
                // default: {height: null, diameter: null, printTime: null, weight: null},
            },
            large: {
                type: VaseSizeSchema,
                // default: {height: null, diameter: null, printTime: null, weight: null},
            },
        },
    },
    {
        collection: 'Vases',
        versionKey: false,
        timestamps: true,
    }
);

VaseSchema.statics.updateVase = async function (vaseObj) {
    return this.findOneAndUpdate(
        { _id: vaseObj._id },
        {
            $set: {
                name: vaseObj.name,
                type: vaseObj.type,
                image: vaseObj.image,
                sizes: vaseObj.sizes,
            },
        },
        { new: true }
    );
};

VaseSchema.statics.createVase = function (vaseObj) {
    return this.create(vaseObj);
};

VaseSchema.statics.getAllVases = function () {
    return this.find({}).exec();
};

VaseSchema.statics.deleteVase = function (vaseObj) {
    return this.deleteOne({ _id: vaseObj });
};

exports.VaseModel = db.connection.model('Vase', VaseSchema);
