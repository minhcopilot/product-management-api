const mongoose = require("mongoose");

const { Schema, model } = mongoose;
const mongooseLeanVirtuals = require("mongoose-lean-virtuals");

const productSchema = new Schema(
  {
    name: {
      type: String,
      unique: [true, "Product names cannot be duplicated"],
      maxLength: [50, "Product names can't exceed 50 characters"],
    },
    price: {
      type: Number,
      min: 0,
      default: 0,
    },
    discount: {
      type: Number,
      min: 0,
      max: 75,
      default: 0,
    },
    stock: { type: Number, min: 0, default: 0 },
    description: {
      type: String,
      default: "",
      maxLength: [3000, "Description can't exceed 3000 characters"],
    },
    images: [],
    // Reference to Category
    categoryId: {
      type: Schema.Types.ObjectId,
      ref: "categories",
    },
    // Reference to Supplier
    supplierId: {
      type: Schema.Types.ObjectId,
      ref: "suppliers",
    },

    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

productSchema.virtual("discountedPrice").get(function () {
  return (this.price * (100 - this.discount)) / 100;
});

//Virtual with Populate
productSchema.virtual("category", {
  ref: "categories",
  localField: "categoryId",
  foreignField: "_id",
  justOne: true,
});
//Virtual with Populate
productSchema.virtual("supplier", {
  ref: "suppliers",
  localField: "supplierId",
  foreignField: "_id",
  justOne: true,
});

//config
productSchema.set("toJSON", { virtuals: true });
productSchema.set("toObject", { virtuals: true });

productSchema.plugin(mongooseLeanVirtuals);

const Product = model("products", productSchema);
module.exports = Product;
