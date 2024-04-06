const yup = require("yup");
module.exports = {
  supplierSchema: yup.object({
    body: yup.object({
      name: yup
        .string()
        .max(100, "name not exceeding 100 characters")
        .required("Name must not be blank"),
      email: yup
        .string()
        .email()
        .max(50, "email not exceeding 50 characters")
        .required("Email must not be blank"),
      phoneNumber: yup
        .string()
        .max(11)
        .matches(/(84|0[3|5|7|8|9])+([0-9]{8})\b/g, "Phone number not invalid")
        .required("Phone number must not be blank"),
      address: yup
        .string()
        .max(500, "email not exceeding 500 characters")
        .required("Address must not be blank"),
    }),
  }),
  supplierPatchSchema: yup.object({
    body: yup.object({
      name: yup.string().max(100, "name not exceeding 100 characters"),
      email: yup.string().email().max(50, "email not exceeding 50 characters"),
      phoneNumber: yup
        .string()
        .max(11)
        .matches(/(84|0[3|5|7|8|9])+([0-9]{8})\b/g, "Phone number not invalid"),
      address: yup.string().max(500, "email not exceeding 500 characters"),
    }),
  }),
};
