const { sendErr } = require("../../utils");
const { Product, Category, Supplier } = require("../../models");
const { fuzzySearch } = require("../../utils");
const fs = require("fs");
const upload = require("../../middlewares/fileMulter");

module.exports = {
  getAll: async (req, res, next) => {
    try {
      let results = await Product.find({
        isDeleted: false,
      })
        .populate("category")
        .populate("supplier")
        .lean();

      return res.send(200, {
        payload: results,
      });
    } catch (error) {
      return res.send(400, {
        message: "Get all Product failed",
      });
    }
  },

  getList: async (req, res, next) => {
    try {
      const { page, pageSize } = req.query; //page is the page number, pageSize is the number of products on a page
      const limit = pageSize || 12;
      const skip = limit * (page - 1) || 0; //limit is the position of the product to start picking

      const conditionFind = { isDeleted: false };

      let results = await Product.find(conditionFind)
        .populate("category")
        .populate("supplier")
        .skip(skip)
        .limit(limit)
        .sort({
          name: 1,
          price: 1,
          discount: -1, // 1 is ascending, -1 is descending
        })
        .lean();

      const total = await Product.countDocuments(conditionFind);

      return res.send({
        code: 200,
        total,
        count: results.length,
        payload: results,
      });
    } catch (error) {
      console.log("««««« error »»»»»", error);
      return res.send(res, error.errors);
    }
  },

  search: async (req, res, next) => {
    try {
      const {
        keyword,
        categoryId,
        supplierId,
        priceStart,
        priceEnd,
        page,
        pageSize,
        stockStart,
        stockEnd,
        discountStart,
        discountEnd,
      } = req.query;

      const limit = pageSize || 12;
      const skip = limit * (page - 1) || 0;

      const conditionFind = { isDeleted: false };

      if (keyword) conditionFind.name = fuzzySearch(keyword);

      if (categoryId) {
        conditionFind.categoryId = categoryId;
      }
      if (supplierId) {
        conditionFind.supplierId = supplierId;
      }
      if (priceStart && priceEnd) {
        // 20 - 50
        const compareStart = { $lte: ["$price", priceEnd] }; // '$field'
        const compareEnd = { $gte: ["$price", priceStart] };
        conditionFind.$expr = { $and: [compareStart, compareEnd] };
      } else if (priceStart) {
        conditionFind.price = { $gte: parseFloat(priceStart) };
      } else if (priceEnd) {
        conditionFind.price = { $lte: parseFloat(priceEnd) };
      }

      const result = await Product.find(conditionFind)
        .populate("category")
        .populate("supplier")
        .skip(skip)
        .limit(limit);

      const total = await Product.countDocuments(conditionFind);

      return res.send(200, { message: "success", total, payload: result });
    } catch (error) {
      return res.send(404, {
        message: "not found",
      });
    }
  },
  getDetail: async (req, res, next) => {
    try {
      const { id } = req.params;
      let result = await Product.findOne({
        _id: id,
        isDeleted: false,
      })
        .populate("category")
        .populate("supplier");

      if (result) {
        return res.send(200, {
          message: "Get detail Product successfully",
          payload: result,
        });
      }
      return res.send(404, { message: "Product not found" });
    } catch (error) {
      console.log("««««« error »»»»»", error);
      return sendErr(res, error.errors);
    }
  },

  create: async (req, res, next) => {
    try {
      const {
        name,
        description,
        price,
        discount,
        stock,
        categoryId,
        supplierId,
      } = req.body;

      const getCategory = Category.findOne({
        _id: categoryId,
        isDeleted: false,
      });
      const getSupplier = Supplier.findOne({
        _id: supplierId,
        isDeleted: false,
      });

      const [existCategory, existSupplier] = await Promise.all([
        getCategory,
        getSupplier,
      ]);

      const error = [];
      if (!existCategory) error.push("Category not found");
      if (existCategory.isDeleted) error.push("Category is deleted");

      if (!existSupplier) error.push("Supplier not found");
      if (existSupplier.isDeleted) error.push("Supplier is deleted");

      if (error.length > 0) {
        return res.status(400).json({ message: "Unavailable", error });
      }
      const dataInsert = req.files.reduce((prev, file) => {
        prev.push({
          name: file.filename,
          location: file.path,
        });
        return prev;
      }, []);

      const newRecord = new Product({
        name,
        price,
        description,
        discount,
        stock,
        categoryId,
        supplierId,
        images: dataInsert,
      });

      let result = await newRecord.save();

      if (result) {
        return res.status(202).json({
          message: "Create a new Product successfully",
          payload: result,
        });
      }
    } catch (error) {
      return res
        .status(500)
        .json({ message: "Internal Server Error", error: error.message });
    }
  },
  fakeData: async (req, res, next) => {
    try {
      const { products } = req.body;

      const getSupplier = Supplier.findOne({
        isDeleted: false,
      });
      const getCategory = Category.findOne({
        isDeleted: false,
      });

      const [existSupplier, existCategory] = await Promise.all([
        getSupplier,
        getCategory,
      ]);

      const data = products.map((item) => ({
        ...item,
        supplierId: existSupplier._id,
        categoryId: existCategory._id,
      }));
      let result = await Product.insertMany(data);

      return res.send(200, {
        message: "Thành công",
        payload: result,
      });
    } catch (error) {
      console.log("««««« error »»»»»", error);
      return res.send(404, {
        message: "Có lỗi",
        error,
      });
    }
  },
  update: async (req, res, next) => {
    try {
      const { id } = req.params;
      const {
        name,
        price,
        description,
        stock,
        discount,
        image,
        categoryId,
        supplierId,
      } = req.body;

      // Check if the product exists and is not deleted
      const product = await Product.findOne({ _id: id, isDeleted: false });

      if (!product) {
        return res.send(404, { message: "Product not found" });
      }

      const error = [];

      if (product.categoryId.toString() !== categoryId.toString()) {
        const category = await Category.findOne({
          _id: categoryId,
          isDeleted: false,
        });

        if (!category) {
          return res.send(404, { message: " " });
        }
      }

      if (product.supplierId.toString() !== supplierId.toString()) {
        const supplier = await Supplier.findOne({
          _id: supplierId,
          isDeleted: false,
        });

        if (!supplier) {
          return res.send(404, { message: "supplier Unavailable" });
        }
      }

      if (error.length > 0) {
        return res.send(400, {
          error,
          message: "Unavailable",
        });
      }

      const updateProduct = await Product.findByIdAndUpdate(
        id,
        {
          name,
          price,
          description,
          discount,
          stock,
          categoryId,
          supplierId,
        },
        { new: true }
      );

      if (updateProduct) {
        return res.send(200, {
          message: "Update successful",
        });
      }

      return res.send(400, { message: "Update failed" });
    } catch (error) {
      console.log("««««« error »»»»»", error);
      return sendErr(res, error.errors);
    }
  },

  deleteFunc: async (req, res, next) => {
    try {
      const { id } = req.params;
      // Find the product to get its images' paths
      const product = await Product.findById(id);

      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }

      // Delete images from disk storage
      product.images.forEach((image) => {
        fs.unlinkSync(image.location); // Delete image file from disk
      });

      // Delete the product from database
      const result = await Product.findByIdAndDelete(id);

      return res.send(200, {
        message: "Delete Product successfully completed",
      });
    } catch (error) {
      console.log("««««« error »»»»»", error);
      return sendErr(res, error.errors);
    }
  },
};
