const { sendErr, fuzzySearch } = require("../../utils");
const { Customer } = require("../../models");

module.exports = {
  getAll: async (req, res, next) => {
    try {
      const payload = await Customer.find({ isDeleted: false });

      return res.send(200, {
        message: "Get all Customer successfully",
        payload: payload,
      });
    } catch (error) {
      return res.send(400, {
        message: "Get all Customer failed",
      });
    }
  },

  getDetail: async (req, res, next) => {
    try {
      const { id } = req.params;
      const payload = await Customer.findOne({ _id: id, isDeleted: false });

      if (!payload) {
        return res.send(404, {
          message: "Customer not found",
        });
      }
      if (payload.isDeleted) {
        return res.send(404, { message: "Customer is deleted" });
      }
      return res.send(202, {
        message: "Get detail Customer successfully",
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

      const newCustomer = new Customer({
        firstName,
        lastName,
        email,
        phoneNumber,
        address,
        password,
        birthDay,
      });

      const payload = await newCustomer.save();

      return res.send(202, {
        message: "Create a new Customer successfully",
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

      const payload = await Customer.findOneAndUpdate(
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
          message: "Update customer successful ",
          payload: payload,
        });
      }
      return res.send(404, {
        message: "Update customer failed ",
      });
    } catch (error) {
      console.log("««««« error »»»»»", error);
      return sendErr(res, error.errors);
    }
  },
  deleteFunc: async (req, res, next) => {
    try {
      const { id } = req.params;

      const payload = await Customer.findByIdAndDelete(id);

      return res.send(200, {
        message: "Delete Customer successfully completed",
        payload,
      });
    } catch (error) {
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

      const payload = await Customer.find(conditionalFind);

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
