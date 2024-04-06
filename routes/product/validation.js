const yup = require("yup");
const ObjectId = require("mongodb").ObjectId;
module.exports = {
  productSchema: yup.object().shape({
    body: yup.object({
      name: yup.string().max(50, "Product name must not exceed 50 characters"),
      price: yup.number().min(0, "Price cannot be negative").integer(),
      discount: yup
        .number()
        .min(0, "Discount cannot be negative")
        .max(75, "Discount less than 75")
        .integer(),
      stock: yup.number().min(0, "stock cannot be negative").integer(),
      description: yup
        .string()
        .max(3000, "Description must not exceed 3000 characters"),
      categoryId: yup
        .string()
        .required()
        .test("Validate ObjectID", "${path} is not valid ObjectID", (value) => {
          if (!value) return true;
          return ObjectId.isValid(value);
        }),

      supplierId: yup
        .string()
        .required()
        .test("Valid objectID", "${path} is not valid ObjectID", (value) => {
          if (!value) return true;
          return ObjectId.isValid(value);
        }),
    }),
  }),
  patchProductSchema: yup.object().shape({
    body: yup.object({
      name: yup.string().max(50, "Product name must not exceed 50 characters"),
      price: yup.number().min(0, "Price cannot be negative").integer(),
      discount: yup
        .number()
        .min(0, "Discount cannot be negative")
        .max(75, "Discount less than 75")
        .integer(),
      stock: yup.number().min(0, "stock cannot be negative").integer(),
      description: yup
        .string()
        .max(3000, "Description must not exceed 3000 characters"),
      categoryId: yup
        .string()
        .test("validate objectID", "${path} is not valid ObjectID", (value) => {
          if (!value) return true;
          return ObjectId.isValid(value);
        }),
      supplierId: yup
        .string()
        .test("Valid objectID", "${path} is not valid ObjectID", (value) => {
          if (!value) return true;
          return ObjectId.isValid(value);
        }),
    }),
  }),

  validationQuerySchema: yup.object().shape({
    query: yup.object({
      categoryId: yup
        .string()
        .test(
          "validation ObjectId",
          "${path} is not valid ObjectID",
          (value) => {
            if (!value) return true;
            return ObjectId.isValid(value);
          }
        ),

      supplierId: yup
        .string()
        .test(
          "validation ObjectId",
          "${path} is not valid ObjectID",
          (value) => {
            if (!value) return true;
            return ObjectId.isValid(value);
          }
        ),
      priceStart: yup
        .number()
        .min(0)
        .test("Invalid starting price", (value, context) => {
          if (!value) return true; // Do not fill in the value

          if (context.parent.priceEnd) {
            return value < context.parent.priceEnd; // priceStart must be less than priceEnd
          }
        }),

      priceEnd: yup
        .number()
        .min(0)
        .test("Invalid ending price", (value, context) => {
          if (!value) return true; // Do not fill in the value

          if (context.parent.priceStart) {
            return value > context.parent.priceStart;
          }
        }),

      page: yup.number().min(1),

      limit: yup.number().min(2),

      keyword: yup.string(),
      stockStart: yup.number().min(0),
      stockEnd: yup.number(),
      discountStart: yup.number().min(0).max(75),
      discountEnd: yup.number().min(0).max(75),
    }),
  }),
};
