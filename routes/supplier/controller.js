const { sendErr, fuzzySearch } = require("../../utils");
const { Supplier } = require("../../models");

module.exports = {
  getAll: async (req, res, next) => {
    try {
      const payload = await Supplier.find({ isDeleted: false });

      return res.send(200, {
        message: "Get all Supplier successfully",
        payload: payload,
      });
    } catch (error) {
      return res.send(400, {
        message: "Get all Supplier failed",
      });
    }
  },

  getDetail: async (req, res, next) => {
    try {
      const { id } = req.params;
      const payload = await Supplier.findOne({ _id: id, isDeleted: false });

      if (!payload) {
        return res.send(404, {
          message: "Supplier not found",
        });
      }
      if (payload.isDeleted) {
        return res.send(404, { message: "Supplier is deleted" });
      }
      return res.send(202, {
        message: "Get detail Supplier successfully",
        payload: payload,
      });
    } catch (error) {
      console.log("««««« error »»»»»", error);
      return sendErr(res, error.errors);
    }
  },

  create: async (req, res, next) => {
    try {
      const { name, email, phoneNumber, address } = req.body;

      const newSupplier = new Supplier({ name, email, phoneNumber, address });

      const payload = await newSupplier.save();

      return res.send(202, {
        message: "Create a new Supplier successfully",
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

      const payload = await Supplier.findOneAndUpdate(
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
          message: "Update supplier successful ",
          payload: payload,
        });
      }
      return res.send(404, {
        message: "Update supplier failed ",
      });
    } catch (error) {
      console.log("««««« error »»»»»", error);
      return sendErr(res, error.errors);
    }
  },
  deleteFunc: async (req, res, next) => {
    try {
      const { id } = req.params;

      const payload = await Supplier.findOneAndUpdate(
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
          message: "Delete supplier successfully completed",
          payload,
        });
      }

      return res.send(404, { message: "supplier not found" });
    } catch (error) {
      console.log("««««« error »»»»»", error);
      return sendErr(res, error.errors);
    }
  },
  search: async (req, res, next) => {
    try {
      const { name, address, email } = req.query;
      const conditionalFind = { isDeleted: false };

      if (name) conditionalFind.name = fuzzySearch(name);
      if (address) conditionalFind.address = fuzzySearch(address);
      if (email) conditionalFind.email = fuzzySearch(email);

      const payload = await Supplier.find(conditionalFind);

      res.send(200, {
        message: "Search successfully completed",
      });
    } catch (error) {
      console.log("««««« error »»»»»", error);
      return sendErr(res, error.errors);
    }
  },
};
