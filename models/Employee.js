const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const { Schema, model } = mongoose;
const mongooseLeanVirtuals = require("mongoose-lean-virtuals");

const employeeSchema = new Schema(
  {
    firstName: {
      type: String,
      required: [true, "employee firstName can't be left blank"],
      maxLength: [50, "employee firstName can't exceed 50 characters"],
    },
    lastName: {
      type: String,
      required: [true, "employee lastName can't be left blank"],
      maxLength: [50, "employee lastName can't exceed 50 characters"],
    },
    email: {
      type: String,
      required: [true, "employee email can't be left blank"],
      validate: {
        validator: function (value) {
          const emailRegex = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
          return emailRegex.test(value);
        },
        message: `{VALUE} not a valid email!`,
      },
      unique: [true, "employee email cannot be duplicated"],
      maxLength: [50, "employee email can't exceed 50 characters"],
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
      unique: [true, "employee phone number cannot be duplicated"],
      maxLength: [50, "employee phone number can't exceed 50 characters"],
    },
    address: {
      type: String,
      required: [true, "employee address can't be left blank"],
      maxLength: [500, "employee address can't exceed 500 characters"],
    },
    isDeleted: {
      type: Boolean,
      required: true,
      default: false,
    },
    birthday: {
      type: Date,
    },
    password: {
      type: String,
      required: true,
      minLength: [3, "Password must be at least 3 characters"],
      maxLength: [255, "Password must be at least 255 characters"],
    },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

employeeSchema.virtual("fullname").get(function () {
  return `${this.firstName} ${this.lastName}`;
});
employeeSchema.pre("save", async function (next) {
  try {
    //generate salt key
    const salt = await bcrypt.genSalt(10); //10 ký tự + MK:123456
    const hashPass = await bcrypt.hash(this.password, salt);
    //override password
    this.password = hashPass;

    next();
  } catch (error) {
    next(error);
  }
});

//isValidPassword => custom
employeeSchema.methods.isValidPass = async function (password) {
  try {
    return await bcrypt.compare(password, this.password);
  } catch (error) {
    throw new Error(error);
  }
};
//config
employeeSchema.set("toJSON", { virtuals: true });
employeeSchema.set("toObject", { virtuals: true });

employeeSchema.plugin(mongooseLeanVirtuals);

const Employee = model("employees", employeeSchema);
module.exports = Employee;
