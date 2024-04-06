const mongoose = require("mongoose");

const { Schema, model } = mongoose;

const categorySchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Category names can't be left blank"],
      unique: [true, "Category names cannot be duplicated"],
      maxLength: [50, "Category names can't exceed 50 characters"],
    },
    description: {
      type: String,
      maxLength: [500, "Description can't exceed 500 characters"],
    },
    isDeleted: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

const Category = model("categories", categorySchema);
module.exports = Category;
