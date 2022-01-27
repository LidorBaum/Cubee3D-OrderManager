const db = require('./db-connections/OrderManager-db');
const Libs = require('../libs');

const Schema = db.mongoose.Schema;

const OrderSchema = Schema(
    {
        customerName: {
            type: String,
            required: true,
        },
        customerId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true
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
                        enum: ['Pending', 'Printing', 'Ready', 'Cancelled'],
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

OrderSchema.statics.getCustomerOrders = function (customerId){
    return this.find({customerId: customerId}).sort({createdAt: -1}).exec()
}


OrderSchema.statics.createOrder = function (orderObj) {
    console.log(orderObj);
    return this.create(orderObj);
};

OrderSchema.statics.getAllOrders = function () {
    return this.find({}).sort({ createdAt: -1 }).exec();
};

OrderSchema.statics.getOrderById = function (orderId) {
    return this.findOne({ _id: orderId });
};

OrderSchema.statics.updateVaseStatus = function (
    orderId,
    uniqueKey,
    newStatus
) {
    return this.findOneAndUpdate(
        {
            _id: orderId,
            selectedVasesArray: {
                $elemMatch: uniqueKey,
            },
        },
        {
            $set: {
                'selectedVasesArray.$.status': newStatus,
            },
        },
        {
            new: true,
        }
    );
};

OrderSchema.statics.updateStatus = function (orderId, newStatus) {
    return this.findOneAndUpdate(
        { _id: orderId },
        {
            $set: {
                status: newStatus,
            },
        },
        {
            new: true,
        }
    );
};

exports.OrderModel = db.connection.model('Order', OrderSchema);
