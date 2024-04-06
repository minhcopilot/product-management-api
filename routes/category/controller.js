const { Category } = require("../../models");

const { sendErr, fuzzySearch } = require("../../utils");

module.exports = {
  getAll: async (req, res, next) => {
    try {
      const result = await Category.find({ isDeleted: false });
      return res.send(200, {
        message: "Get all category successfully",
        payload: result, //filter để loại bỏ những item đã bị xóa
      });
    } catch (error) {
      return res.send(400, {
        message: "Get all category failed",
      });
    }
  },

  getDetail: async (req, res, next) => {
    try {
      const { id } = req.params;
      // const result = await Category.findOne({
      //   _id: id,
      //   isDeleted: false,
      // });
      const result = await Category.findById(id);
      if (!result) {
        return res.send(404, {
          message: "Category not found",
        });
      }
      if (result.isDeleted) {
        return res.send(404, { message: "Category is deleted" });
      }
      return res.send(202, {
        message: "Get detail category successfully",
        payload: result,
      });
    } catch (error) {
      console.log("««««« error »»»»»", error);
      return sendErr(res, error.errors);
    }
  },

  create: async (req, res, next) => {
    try {
      const { name, description } = req.body;

      const newCategory = new Category({
        name,
        description,
      });

      const result = await newCategory.save();

      return res.send(202, {
        message: "Create a new category successfully",
        payload: result,
      });
    } catch (error) {
      console.log("««««« error »»»»»", error);
      return sendErr(res, error.errors);
    }
  },

  // patch: async (req, res, next) => {
  //   try {
  //     const { id } = req.params;
  //     const { name, description } = req.body;

  //     const checkCategory = await Category.findById(id);
  //     //Id not found in category
  //     if (!checkCategory) {
  //       return res.send(404, {
  //         message: "Category not found",
  //       });
  //     }

  //     //Category is deleted
  //     if (checkCategory.isDeleted) {
  //       return res.send(404, {
  //         message: "Category is Deleted",
  //       });
  //     }

  //     const result = await Category.findByIdAndUpdate(
  //       id,
  //       {
  //         $set: {
  //           name: name,
  //           description: description,
  //         },
  //       },
  //       { new: true }
  //     );

  //     return res.send(400, {
  //       message: "Update category successfully",
  //       payload: result,
  //     });
  //   } catch (error) {
  //     console.log("««««« error »»»»»", error);
  //     return sendErr(res, error.errors);
  //   }
  // },

  // put: async (req, res, next) => {
  //   try {
  //     const { id } = req.params;
  //     const { name, description } = req.body;

  //     const checkCategory = await Category.findById(id);
  //     if (!checkCategory) {
  //       return res.send(404, {
  //         message: "Category not found",
  //       });
  //     }

  //     if (checkCategory.isDeleted) {
  //       return res.send(404, {
  //         message: "Category is deleted",
  //       });
  //     }

  //     const result = await Category.findByIdAndUpdate(
  //       id,
  //       { $set: { name: name, description: null } },
  //       { new: true }
  //     );
  //     return res.send(202, {
  //       message: "Update category data successfully",
  //       payload: result,
  //     });
  //   } catch (error) {
  //     console.log("««««« error »»»»»", error);
  //     return sendErr(res, error.errors);
  //   }
  // },
  update: async (req, res, next) => {
    try {
      const { id } = req.params;

      const payload = await Category.findOneAndUpdate(
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
          message: "Update Category successful ",
          payload: payload,
        });
      }
      return res.send(404, {
        message: "Update Category failed ",
      });
    } catch (error) {
      console.log("««««« error »»»»»", error);
      return sendErr(res, error.errors);
    }
  },
  deleteFunc: async (req, res, next) => {
    try {
      const { id } = req.params;

      const checkCategory = await Category.findByIdAndDelete(id);
      return res.send(200, {
        message: "Delete Category successfully completed",
      });
    } catch (error) {
      console.log("««««« error »»»»»", error);
      return sendErr(res, error.errors);
    }
  },
  search: async (req, res, next) => {
    try {
      const { name } = req.query;
      const conditionalFind = { isDeleted: false };

      if (name) conditionalFind.name = fuzzySearch(name);

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
