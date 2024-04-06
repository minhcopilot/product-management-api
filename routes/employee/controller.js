const { sendErr, fuzzySearch } = require("../../utils");
const { Employee } = require("../../models");

module.exports = {
  getAll: async (req, res, next) => {
    try {
      const payload = await Employee.find({ isDeleted: false });

      return res.send(200, {
        message: "Get all Employee successfully",
        payload: payload,
      });
    } catch (error) {
      return res.send(400, {
        message: "Get all Employee failed",
      });
    }
  },

  getDetail: async (req, res, next) => {
    try {
      const { id } = req.params;
      const payload = await Employee.findOne({ _id: id, isDeleted: false });

      if (!payload) {
        return res.send(404, {
          message: "Employee not found",
        });
      }
      if (payload.isDeleted) {
        return res.send(404, { message: "Employee is deleted" });
      }
      return res.send(202, {
        message: "Get detail Employee successfully",
        payload: payload,
      });
    } catch (error) {
      console.log("««««« error »»»»»", error);
      return sendErr(res, error.errors);
    }
  },

  create: async (req, res, next) => {
    try {
      const {
        firstName,
        lastName,
        email,
        phoneNumber,
        address,
        password,
        birthDay,
      } = req.body;

      const newEmployee = new Employee({
        firstName,
        lastName,
        email,
        phoneNumber,
        address,
        password,
        birthDay,
      });

      const payload = await newEmployee.save();

      return res.send(202, {
        message: "Create a new Employee successfully",
        payload: payload,
      });
    } catch (error) {
      console.log("««««« error »»»»»", error);
      return sendErr(res, error.errors);
    }
  },

  update: async (req, res, next) => {
    try {
      const { id } = req.params;

      const payload = await Employee.findOneAndUpdate(
        {
          _id: id,
          isDeleted: false,
        },
        {
          ...req.body,
        },
        {
          new: true,
        }
      );

      if (payload) {
        return res.send(200, {
          message: "Update employee successful ",
          payload: payload,
        });
      }
      return res.send(404, {
        message: "Update employee failed ",
      });
    } catch (error) {
      console.log("««««« error »»»»»", error);
      return sendErr(res, error.errors);
    }
  },
  deleteFunc: async (req, res, next) => {
    try {
      const { id } = req.params;

      const payload = await Employee.findOneAndUpdate(
        {
          _id: id,
          isDeleted: false,
        },
        {
          isDeleted: true,
        },
        { new: true }
      );
      if (payload) {
        return res.send(200, {
          message: "Delete Employee successfully completed",
        });
      }

      return res.send(404, { message: "Employee not found" });
    } catch (error) {
      console.log("««««« error »»»»»", error);
      return sendErr(res, error.errors);
    }
  },
  search: async (req, res, next) => {
    try {
      const { firstName, lastName, address, email } = req.query;
      const conditionalFind = { isDeleted: false };

      if (firstName) conditionalFind.firstName = fuzzySearch(firstName);
      if (lastName) conditionalFind.lastName = fuzzySearch(lastName);
      if (address) conditionalFind.address = fuzzySearch(address);
      if (email) conditionalFind.email = fuzzySearch(email);

      const payload = await Employee.find(conditionalFind);

      res.send(200, {
        message: "Search successfully completed",
        payload,
      });
    } catch (error) {
      console.log("««««« error »»»»»", error);
      return sendErr(res, error.errors);
    }
  },
};
