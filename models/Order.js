const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const productSchema = new Schema(
  {
    productId: {
      type: Schema.Types.ObjectId,
      ref: "products",
      required: true,
    },
    name: {
      type: String,
    },
    quantity: {
      type: Number,
      min: 0,
      default: 1,
    },
    discount: {
      type: Number,
      default: 0,
    },
    price: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  {
    versionKey: false,
  }
);

productSchema.virtual("product", {
  foreignField: "_id",
  ref: "products",
  localField: "productId",
  justOne: true,
});

productSchema.set("toObject", { virtuals: true });
productSchema.set("toJSON", { virtuals: true });

const orderSchema = new Schema(
  {
    createdDate: {
      type: Date,
      default: Date.now,
    },
    shippedDate: {
      type: Date,
    },
    paymentType: {
      type: String,
      default: "CASH",
      enum: ["CASH", "CREDIT_CARD"],
    },
    status: {
      type: String,
      enum: ["WAITING", "COMPLETED", "CANCELED", "REJECTED", "DELIVERING"],
      default: "WAITING",
    },
    customerId: {
      type: Schema.Types.ObjectId,
      ref: "customers",
    },
    employeeId: {
      type: Schema.Types.ObjectId,
      ref: "employees",
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    productList: [productSchema],
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

orderSchema.virtual("customer", {
  ref: "customers",
  localField: "customerId",
  foreignField: "_id",
  justOne: true,
});

orderSchema.virtual("employee", {
  ref: "employees",
  localField: "employeeId",
  foreignField: "_id",
  justOne: true,
});

orderSchema.set("toObject", { virtuals: true });
orderSchema.set("toJSON", { virtuals: true });

const Order = model("orders", orderSchema);
module.exports = Order;
