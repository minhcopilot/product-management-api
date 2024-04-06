const mongoose = require("mongoose");

const { Schema, model } = mongoose;

const supplierSchema = new Schema(
  {
    name: {
      type: String,
      unique: [true, "Supplier names cannot be duplicated"],
      maxLength: [100, "Supplier names can't exceed 100 characters"],
    },
    email: {
      type: String,
      validate: {
        validator: function (value) {
          const emailRegex = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
          return emailRegex.test(value);
        },
        message: `{VALUE} not a valid email!`,
      },
      unique: [true, "Supplier email cannot be duplicated"],
      maxLength: [50, "Supplier email can't exceed 50 characters"],
    },
    phoneNumber: {
      type: String,
      validate: {
        validator: function (value) {
          const phoneRegex =
            /^(0?)(3[2-9]|5[6|8|9]|7[0|6-9]|8[0-6|8|9]|9[0-4|6-9])[0-9]{7}$/;
          return phoneRegex.test(value);
        },
        message: `{VALUE} not a valid phone number!`,
      },
      unique: [true, "Supplier phone number cannot be duplicated"],
      maxLength: [50, "Supplier phone number can't exceed 50 characters"],
    },
    address: {
      type: String,
      maxLength: [500, "Supplier address can't exceed 500 characters"],
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

const Supplier = model("suppliers", supplierSchema);
module.exports = Supplier;
