const yup = require("yup");
module.exports = {
  employeeSchema: yup.object({
    body: yup.object({
      firstName: yup
        .string()
        .max(50, "firstName not exceeding 50 characters")
        .required("firstName must not be blank"),
      lastName: yup
        .string()
        .max(50, "lastName not exceeding 50 characters")
        .required("lastName must not be blank"),
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
      birthDay: yup.date(),
      password: yup
        .string()
        .required("Password must not be blank")
        .min(3)
        .max(255),
    }),
  }),
  employeePatchSchema: yup.object({
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
