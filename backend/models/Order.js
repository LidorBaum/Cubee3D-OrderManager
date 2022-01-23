const db = require('./db-connections/OrderManager-db');
const Libs = require('../libs');

const Schema = db.mongoose.Schema;

const OrderSchema = Schema(
    {
        customerName: {
            type: String,
            required: true,
        },
        comment: {
            type: String,
        },
        selectedVasesArray: {
            type: [
                {
                    vaseId: {
                        type: Schema.Types.ObjectId,
                        ref: 'Vase',
                        required: true,
                    },
                    vaseSize: {
                        type: String,
                        enum: ['small', 'medium', 'large'],
                        required: true,
                    },
                    filamentId: {
                        type: Schema.Types.ObjectId,
                        ref: 'Filament',
                        required: true,
                    },
                    quantity: {
                        type: Number,
                        default: 0,
                    },
                    status: {
                        type: String,
                        enum: ['Pending', 'Printing', 'Ready'],
                        default: 'Pending',
                    },
                },
            ],
            required: true,
            default: [],
        },
        status: {
            type: String,
            enum: [
                'Pending',
                'Approved',
                'Printing',
                'Ready',
                'Shipped',
                'Delivered',
                'Cancelled',
            ],
            default: 'Pending',
        },
        storeAddress: {
            type: String,
        },
    },
    {
        collection: 'Orders',
        versionKey: false,
        timestamps: true,
    }
);

OrderSchema.statics.getPrintTimeArray = function (vaseArray) {};

OrderSchema.statics.createOrder = function (orderObj) {
    return this.create(orderObj);
};

OrderSchema.statics.getAllOrders = function () {
    return this.find({}).exec();
};

OrderSchema.statics.getOrderById = function (orderId) {
    return this.findOne({ _id: orderId });
};

OrderSchema.statics.updateStatus = function (orderId, newStatus) {
    return this.updateOne(
        { _id: orderId },
        {
            $set: {
                status: newStatus,
            },
        }
    );
};

exports.OrderModel = db.connection.model('Order', OrderSchema);
