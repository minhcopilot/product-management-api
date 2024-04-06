const yup = require("yup");
const ObjectId = require("mongodb").ObjectId;
module.exports = {
  orderSchema: yup.object().shape({
    body: yup.object({
      createDate: yup.date(),
      shippedDate: yup
        .date()
        .min(
          yup.ref("createDate"),
          "Shipped date must be greater than create date"
        ),
      paymentType: yup
        .string()
        .oneOf(["CASH", "CREDIT_CARD"], "Invalid payment method"),
      status: yup
        .string()
        .oneOf(["WAITING", "COMPLETED", "CANCELED"], "Invalid status"),
      customerId: yup
        .string()
        .test("Validate ObjectID", "${path} is not valid ObjectID", (value) => {
          if (!value) return true;
          return ObjectId.isValid(value);
        }),

      employeeId: yup
        .string()
        .test("Valid objectID", "${path} is not valid ObjectID", (value) => {
          if (!value) return true;
          return ObjectId.isValid(value);
        }),

      productList: yup.array().of(
        yup.object().shape({
          productId: yup
            .string()
            .test("validationProductID", "Invalid productId", (value) => {
              return ObjectId.isValid(value);
            }),
          quantity: yup.number().required().min(0),
        })
      ),
    }),
  }),

  updateStatusSchema: yup.object({
    body: yup.object({
      status: yup
        .string()
        .required()
        .oneOf(
          ["WAITING", "COMPLETED", "CANCELED", "REJECTED", "DELIVERING"],
          "Status invalid"
        ),
    }),
  }),

  updateShippingDateSchema: yup.object({
    body: yup.object({
      shippedDate: yup
        .date()
        .test("check shipped date", "${path} invalid date", (value) => {
          if (!value) return true;

          if (value && this.createDate && value < this.createDate) {
            return false;
          }
          if (value < new Date()) {
            return false;
          }
          return true;
        }),
    }),
  }),

  updateEmployeeSchema: yup.object({
    body: yup.object({
      employeeId: yup
        .string()
        .test("validationEmployeeId", "Invalid id", (value) => {
          return ObjectId.isValid(value);
        }),
    }),
  }),

  validationQuerySchema: yup.object().shape({
    query: yup.object({
      customerId: yup
        .string()
        .test(
          "validation ObjectId",
          "${path} is not valid ObjectID",
          (value) => {
            if (!value) return true;
            return ObjectId.isValid(value);
          }
        ),

      employeeId: yup
        .string()
        .test(
          "validation ObjectId",
          "${path} is not valid ObjectID",
          (value) => {
            if (!value) return true;
            return ObjectId.isValid(value);
          }
        ),
      paymentType: yup
        .string()
        .oneOf(["CASH", "CREDIT_CARD"], "Invalid payment type"),
      status: yup
        .string()
        .oneOf(
          ["WAITING", "COMPLETED", "CANCELED", "REJECTED", "DELIVERING"],
          "Invalid status"
        ),
    }),
  }),
};
