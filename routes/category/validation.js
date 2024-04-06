const yup = require("yup");
module.exports = {
  categorySchema: yup.object({
    body: yup.object({
      name: yup
        .string()
        .max(50, "Name not exceeding 50 characters")
        .required("Name must not be blank"),
      description: yup
        .string()
        .max(500, "description not exceeding 500 characters"),
    }),
  }),

  patchCategorySchema: yup.object({
    body: yup.object({
      name: yup.string().max(50, "Name not exceeding 50 characters"),
      description: yup.string().max(500, "Name not exceeding 500 characters"),
    }),
  }),
};
