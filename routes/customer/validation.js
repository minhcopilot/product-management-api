const yup = require("yup");
module.exports = {
  customerSchema: yup.object({
    body: yup.object({
      firstName: yup.string().max(50, "firstName not exceeding 50 characters"),
      lastName: yup.string().max(50, "lastName not exceeding 50 characters"),
      email: yup.string().email().max(50, "email not exceeding 50 characters"),
      phoneNumber: yup
        .string()
        .max(11)
        .matches(/(84|0[3|5|7|8|9])+([0-9]{8})\b/g, "Phone number not invalid"),
      address: yup.string().max(500, "email not exceeding 500 characters"),
      birthDay: yup.date(),
      password: yup.string().min(3).max(255),
    }),
  }),
  customerPatchSchema: yup.object({
    body: yup.object({
      firstName: yup.string().max(50, "firstName not exceeding 50 characters"),
      lastName: yup.string().max(50, "lastName not exceeding 50 characters"),
      email: yup.string().email().max(50, "email not exceeding 50 characters"),
      phoneNumber: yup
        .string()
        .max(11)
        .matches(/(84|0[3|5|7|8|9])+([0-9]{8})\b/g, "Phone number not invalid"),
      address: yup.string().max(500, "email not exceeding 500 characters"),
      birthDay: yup.date(),
      password: yup
        .string()
        .min(3, "Password must be at least 3 characters")
        .max(255, "Password must be at least 255 characters"),
    }),
  }),
};
