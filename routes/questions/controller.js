const {
  Product,
  Category,
  Order,
  Supplier,
  Customer,
  Employee,
} = require("../../models");
const { fuzzySearch, getQueryDateTime } = require("../../utils");

module.exports = {
  question1: async (req, res, next) => {
    try {
      const conditionFind = {
        stock: { $lt: 10 },
      };

      let results = await Product.find(conditionFind);
      let total = await Product.countDocuments();

      return res.send({
        code: 200,
        total,
        totalResults: results.length,
        payload: results,
      });
    } catch (error) {
      return res.status(400).json({
        code: 500,
        error: error,
      });
    }
  },
  question1a: async (req, res, next) => {
    try {
      const { discount } = req.query;
      const conditionFind = {};
      if (discount) conditionFind.discount = { $lt: discount };

      let results = await Product.find(conditionFind)
        .populate("category")
        .populate("supplier");
      let total = await Product.countDocuments();

      return res.send({
        code: 200,
        total,
        totalResults: results.length,
        payload: results,
      });
    } catch (error) {
      return res.status(400).json({ code: 500, error: error });
    }
  },
  question1b: async (req, res, next) => {
    try {
      const { discount, type } = req.query;
      const conditionFind = {};
      if (discount) {
        switch (+type) {
          case 0:
            conditionFind.discount = { $eq: discount };
            break;
          case 1:
            conditionFind.discount = { $lt: discount };
            break;
          case 2:
            conditionFind.discount = { $lte: discount };
            break;
          case 3:
            conditionFind.discount = { $gt: discount };
            break;
          case 4:
            conditionFind.discount = { $gte: discount };
            break;
          default:
            conditionFind.discount = { $eq: discount };
            break;
        }
      }

      let results = await Product.find(conditionFind)
        .populate("category")
        .populate("supplier");
      let total = await Product.countDocuments();

      return res.send({
        code: 200,
        total,
        totalResults: results.length,
        payload: results,
      });
    } catch (error) {
      return res.status(400).json({ code: 500, error: error });
    }
  },
  question2: async (req, res, next) => {
    try {
      const conditionFind = {
        stock: { $lte: 100 },
      };

      let results = await Product.find(conditionFind);
      let total = await Product.countDocuments();

      return res.send({
        code: 200,
        total,
        totalResults: results.length,
        payload: results,
      });
    } catch (error) {
      return res.status(400).json({
        code: 500,
        error: error,
      });
    }
  },
  question2a: async (req, res, next) => {
    try {
      const { stock } = req.query;
      const conditionFind = {};
      if (stock) conditionFind.stock = { $lt: stock };

      let results = await Product.find(conditionFind)
        .populate("category")
        .populate("supplier");
      let total = await Product.countDocuments();

      return res.send({
        code: 200,
        total,
        totalResults: results.length,
        payload: results,
      });
    } catch (error) {
      return res.status(400).json({ code: 500, error: error });
    }
  },
  question2b: async (req, res, next) => {
    try {
      const { stock, type } = req.query;
      const conditionFind = {};
      if (stock) {
        switch (+type) {
          case 0:
            conditionFind.stock = { $eq: stock };
            break;
          case 1:
            conditionFind.stock = { $lt: stock };
            break;
          case 2:
            conditionFind.stock = { $lte: stock };
            break;
          case 3:
            conditionFind.stock = { $gt: stock };
            break;
          case 4:
            conditionFind.stock = { $gte: stock };
            break;
          default:
            conditionFind.stock = { $eq: stock };
            break;
        }
      }

      let results = await Product.find(conditionFind)
        .populate("category")
        .populate("supplier");
      let total = await Product.countDocuments();

      return res.send({
        code: 200,
        total,
        totalResults: results.length,
        payload: results,
      });
    } catch (error) {
      return res.status(400).json({ code: 500, error: error });
    }
  },
  question3: async (req, res, next) => {
    try {
      const s = { $subtract: [100, "$discount"] };
      const m = { $multiply: [s, "$price"] };
      const d = { $divide: [m, 100] };
      const conditionFind = { $expr: { $lte: [d, 100] } };

      let results = await Product.find(conditionFind);

      let total = await Product.countDocuments();

      return res.send({
        code: 200,
        total,
        totalResults: results.length,
        payload: results,
      });
    } catch (error) {
      return res.status(400).json({ code: 500, error: error });
    }
  },
  question3a: async (req, res, next) => {
    try {
      const { discountPrice } = req.query;
      const s = { $subtract: [100, "$discount"] };
      const m = { $multiply: [s, "$price"] };
      const d = { $divide: [m, 100] };
      if (discountPrice) {
        conditionFind = { $expr: { $lte: [d, parseFloat(discountPrice)] } };
      }

      let results = await Product.find(conditionFind).lean();

      let total = await Product.countDocuments();

      return res.send({
        code: 200,
        total,
        totalResults: results.length,
        payload: results,
      });
    } catch (error) {
      return res.status(400).json({ code: 500, error: error });
    }
  },
  question3c: async (req, res, next) => {
    try {
      const s = { $subtract: [100, "$discount"] };
      const m = { $multiply: [s, "$price"] };
      const d = { $divide: [m, 100] };

      let results = await Product.aggregate().match({
        $expr: { $lte: [d, 100] },
      });

      let total = await Product.countDocuments();

      return res.send({
        code: 200,
        total,
        totalResults: results.length,
        payload: results,
      });
    } catch (error) {
      return res.status(400).json({ code: 500, error: error });
    }
  },
  question3d: async (req, res, next) => {
    try {
      const s = { $subtract: [100, "$discount"] };
      const m = { $multiply: [s, "$price"] };
      const d = { $divide: [m, 100] };

      let results = await Product.aggregate()
        .addFields({ disPrice: d })
        .match({ $expr: { $lte: ["$disPrice", 100] } })
        .project({
          categoryId: 0,
          supplierId: 0,
          description: 0,
          isDeleted: 0,
          price: 0,
          discount: 0,
        });

      let total = await Product.countDocuments();

      return res.send({
        code: 200,
        total,
        totalResults: results.length,
        payload: results,
      });
    } catch (error) {
      return res.status(400).json({ code: 500, error: error });
    }
  },
  question3e: async (req, res, next) => {
    try {
      const s = { $subtract: [100, "$discount"] };
      const m = { $multiply: [s, "$price"] };
      const d = { $divide: [m, 100] };

      let results = await Product.aggregate()
        .addFields({ disPrice: d })
        .match({ $expr: { $lte: ["$disPrice", 100] } })
        .lookup({
          from: "categories",
          localField: "categoryId",
          foreignField: "_id",
          as: "categories",
        })
        .unwind("categories")
        .lookup({
          from: "suppliers",
          localField: "supplierId",
          foreignField: "_id",
          as: "suppliers",
        })
        .unwind("suppliers")
        .project({
          categoryId: 0,
          supplierId: 0,
          description: 0,
          isDeleted: 0,
          suppliers: {
            isDeleted: 0,
            createdAt: 0,
            updatedAt: 0,
          },
          categories: {
            isDeleted: 0,
            createdAt: 0,
            updatedAt: 0,
          },
        });

      let total = await Product.countDocuments();

      return res.send({
        code: 200,
        total,
        totalResults: results.length,
        payload: results,
      });
    } catch (error) {
      return res.status(400).json({ code: 500, error: error });
    }
  },
  question4: async (req, res, next) => {
    try {
      const { address } = req.query;
      const conditionFind = {
        address: fuzzySearch(address),
      };

      let results = await Customer.find(conditionFind);
      let total = await Customer.countDocuments();

      return res.send({
        code: 200,
        total,
        totalResults: results.length,
        payload: results,
      });
    } catch (error) {
      return res.status(400).json({ code: 500, error: error });
    }
  },
  question4a: async (req, res, next) => {
    try {
      const { address } = req.query;

      // const conditionFind = { address: { $regex: new RegExp(`${address}`), $options: 'i' } };
      // const conditionFind = { address: new RegExp(`${address}`) };
      // const conditionFind = { address: {$eq: address } };

      let results = await Customer.aggregate().match({
        address: { $regex: new RegExp(`${address}`), $options: "i" },
      });

      let total = await Customer.countDocuments();

      return res.send({
        code: 200,
        total,
        totalResult: results.length,
        payload: results,
      });
    } catch (err) {
      console.log("««««« err »»»»»", err);
      return res.status(500).json({ code: 500, error: err });
    }
  },
  question5: async (req, res, next) => {
    try {
      const { year } = req.query;

      const conditionFind = {
        $expr: {
          $eq: [{ $year: "$birthday" }, year],
        },
      };

      let results = await Customer.find(conditionFind);

      let total = await Customer.countDocuments();

      return res.send({
        code: 200,
        total,
        totalResult: results.length,
        payload: results,
      });
    } catch (err) {
      return res.status(500).json({ code: 500, error: err });
    }
  },
  question5a: async (req, res, next) => {
    try {
      const year = Number(req.query.year);
      const conditionFind = {
        $expr: { $eq: [{ $year: "$birthday" }, year] },
      };

      let results = await Customer.aggregate()
        .match(conditionFind)
        .addFields({
          birthYear: { $year: "$birthday" },
        });
      let total = await Customer.countDocuments();

      return res.send({
        code: 200,
        total,
        totalResults: results.length,
        payload: results,
      });
    } catch (error) {
      return res.status(400).json({ code: 500, error: error });
    }
  },
  question6: async (req, res, next) => {
    try {
      const { date } = req.query;
      let today;
      if (!date) {
        today = new Date();
      } else {
        today = new Date(date);
      }
      const conditionFind = {
        $expr: {
          $and: [
            {
              $eq: [{ $dayOfMonth: "$birthday" }, { $dayOfMonth: today }],
            },
            {
              $eq: [{ $month: "$birthday" }, { $month: today }],
            },
          ],
        },
      };

      let results = await Customer.find(conditionFind);

      let total = await Customer.countDocuments();

      return res.send({
        code: 200,
        total,
        totalResult: results.length,
        payload: results,
      });
    } catch (err) {
      return res.status(500).json({ code: 500, error: err });
    }
  },
  question7: async (req, res, next) => {
    try {
      const { status } = req.query;

      let results = await Order.find({ status })
        .populate({
          path: "customer",
          select: "firstName lastName",
        })
        .populate("employee")
        .populate({
          path: "productList.product",
          select: { name: 1, stock: 1 },
        })
        .lean();

      let total = await Order.countDocuments();

      return res.send({
        code: 200,
        total,
        totalResults: results.length,
        payload: results,
      });
    } catch (error) {
      return res.status(400).json({ code: 500, error: error });
    }
  },
  question7a: async (req, res, next) => {
    try {
      const { status } = req.query;

      let results = await Order.aggregate()
        .match({ status })
        .lookup({
          from: "customers",
          localField: "customerId",
          foreignField: "_id",
          as: "customer",
        })
        .unwind("customer")
        .lookup({
          from: "employees",
          localField: "employeeId",
          foreignField: "_id",
          as: "employee",
        })
        .unwind("employee")
        .project({
          customerId: 0,
          employeeId: 0,
        });

      let total = await Order.countDocuments();

      return res.send({
        code: 200,
        total,
        totalResults: results.length,
        payload: results,
      });
    } catch (error) {
      return res.status(400).json({ code: 500, error: error });
    }
  },
  question8a: async (req, res, next) => {
    try {
      const { status, date } = req.query;
      const findDate = date ? new Date(new Date(date)) : new Date();

      const conditionFind = {
        $expr: {
          $and: [
            { status },
            {
              $eq: [{ $dayOfMonth: "$shippedDate" }, { $dayOfMonth: findDate }],
            },
            { $eq: [{ $month: "$shippedDate" }, { $month: findDate }] },
            { $eq: [{ $year: "$shippedDate" }, { $year: findDate }] },
          ],
        },
      };
      let results = await Order.find(conditionFind).lean();

      let total = await Order.countDocuments();

      return res.send({
        code: 200,
        total,
        totalResults: results.length,
        payload: results,
      });
    } catch (error) {
      return res.status(400).json({ code: 500, error: error });
    }
  },
  question8b: async (req, res, next) => {
    try {
      let { status, fromDate, toDate } = req.query;

      fromDate = new Date(fromDate);
      fromDate.setHours(0, 0, 0, 0);

      tmpToDate = new Date(toDate);
      tmpToDate.setHours(0, 0, 0, 0);
      toDate = new Date(tmpToDate.setDate(tmpToDate.getDate() + 1));

      const compareStatus = { $eq: ["$status", status] };
      const compareFromDate = { $gte: ["$shippedDate", fromDate] };
      const compareToDate = { $lt: ["$shippedDate", toDate] };

      const conditionFind = {
        $expr: {
          $and: [compareStatus, compareFromDate, compareToDate],
        },
      };
      let results = await Order.find(conditionFind)
        .populate("productList.product")
        .populate("customer")
        .populate("employee")
        .lean();

      let total = await Order.countDocuments();

      return res.send({
        code: 200,
        total,
        totalResults: results.length,
        payload: results,
      });
    } catch (error) {
      return res.status(400).json({ code: 500, error: error });
    }
  },
  question8c: async (req, res, next) => {
    try {
      let { status, fromDate, toDate } = req.query;

      fromDate = new Date(fromDate);
      fromDate.setHours(0, 0, 0, 0);

      tmpToDate = new Date(toDate);
      tmpToDate.setHours(0, 0, 0, 0);
      toDate = new Date(tmpToDate.setDate(tmpToDate.getDate() + 1));

      const compareStatus = { $eq: ["$status", status] };
      const compareFromDate = { $lt: ["$shippedDate", fromDate] };
      const compareToDate = { $gt: ["$shippedDate", toDate] };

      const conditionFind = {
        $expr: {
          $or: [
            {
              $and: [compareStatus, compareFromDate],
            },
            {
              $and: [compareStatus, compareToDate],
            },
          ],
        },
      };
      let results = await Order.find(conditionFind)
        .populate("productList.product")
        .populate("customer")
        .populate("employee")
        .lean();

      let total = await Order.countDocuments();

      return res.send({
        code: 200,
        total,
        totalResults: results.length,
        payload: results,
      });
    } catch (error) {
      return res.status(400).json({ code: 500, error: error });
    }
  },
  question9: async (req, res, next) => {
    try {
      const { status } = req.query;

      let results = await Order.find({ status })
        .populate({
          path: "customer",
          select: "firstName lastName",
        })
        .populate("employee")
        .populate({
          path: "productList.product",
          select: { name: 1, stock: 1 },
        })
        .lean();

      let total = await Order.countDocuments();

      return res.send({
        code: 200,
        total,
        totalResults: results.length,
        payload: results,
      });
    } catch (error) {
      return res.status(400).json({ code: 500, error: error });
    }
  },
  question10: async (req, res, next) => {
    try {
      const { status, date } = req.query;
      const findDate = date ? new Date(new Date(date)) : new Date();

      const conditionFind = {
        $expr: {
          $and: [
            { status },
            {
              $eq: [{ $dayOfMonth: "$shippedDate" }, { $dayOfMonth: findDate }],
            },
            { $eq: [{ $month: "$shippedDate" }, { $month: findDate }] },
            { $eq: [{ $year: "$shippedDate" }, { $year: findDate }] },
          ],
        },
      };
      let results = await Order.find(conditionFind).lean();

      let total = await Order.countDocuments();

      return res.send({
        code: 200,
        total,
        totalResults: results.length,
        payload: results,
      });
    } catch (error) {
      return res.status(400).json({ code: 500, error: error });
    }
  },
  question11: async (req, res, next) => {
    try {
      const { paymentType } = req.query;

      let results = await Order.find({ paymentType })
        .populate({
          path: "customer",
          select: "firstName lastName",
        })
        .populate("employee")
        .populate({
          path: "productList.product",
          select: { name: 1, stock: 1 },
        })
        .lean();

      let total = await Order.countDocuments();

      return res.send({
        code: 200,
        total,
        totalResults: results.length,
        payload: results,
      });
    } catch (error) {
      return res.status(400).json({ code: 500, error: error });
    }
  },
  question13: async (req, res, next) => {
    try {
      let { address } = req.query;

      let results = await Order.aggregate()
        .lookup({
          from: "customers",
          localField: "customerId",
          foreignField: "_id",
          as: "customer",
        })
        .unwind("customer")
        .match({
          "customer.address": {
            $regex: new RegExp(`${address}`),
            $options: "i",
          },
        })
        .project({
          customerId: 0,
          employeeId: 0,
        });
      let total = await Order.countDocuments();

      return res.send({
        code: 200,
        total,
        totalResults: results.length,
        payload: results,
      });
    } catch (error) {
      return res.status(400).json({ code: 500, error: error });
    }
  },
  question14: async (req, res, next) => {
    try {
      const { date } = req.query;
      let today;
      if (!date) {
        today = new Date();
      } else {
        today = new Date(date);
      }
      const conditionFind = {
        $expr: {
          $and: [
            {
              $eq: [{ $dayOfMonth: "$birthday" }, { $dayOfMonth: today }],
            },
            {
              $eq: [{ $month: "$birthday" }, { $month: today }],
            },
          ],
        },
      };

      let results = await Employee.find(conditionFind);

      let total = await Employee.countDocuments();

      return res.send({
        code: 200,
        total,
        totalResult: results.length,
        payload: results,
      });
    } catch (err) {
      return res.status(500).json({ code: 500, error: err });
    }
  },
  question15: async (req, res, next) => {
    try {
      let { supplierNames } = req.query;

      let conditionFind = {
        name: { $in: supplierNames },
      };

      let results = await Supplier.find(conditionFind);

      let total = await Supplier.countDocuments();

      return res.send({
        code: 200,
        total,
        totalResult: results.length,
        payload: results,
      });
    } catch (err) {
      console.log("««««« err »»»»»", err);
      return res.status(500).json({ code: 500, error: err });
    }
  },
  question16: async (req, res, next) => {
    try {
      let results = await Order.find().populate("customer");
      let total = await Order.countDocuments();

      return res.send({
        code: 200,
        total,
        totalResult: results.length,
        payload: results,
      });
    } catch (err) {
      console.log("««««« err »»»»»", err);
      return res.status(500).json({ code: 500, error: err });
    }
  },
  question16a: async (req, res, next) => {
    try {
      let results = await Order.aggregate()
        .lookup({
          from: "customers",
          localField: "customerId",
          foreignField: "_id",
          as: "customers",
        })
        .unwind("customers");
      let total = await Order.countDocuments();

      return res.send({
        code: 200,
        total,
        totalResult: results.length,
        payload: results,
      });
    } catch (err) {
      console.log("««««« err »»»»»", err);
      return res.status(500).json({ code: 500, error: err });
    }
  },
  question17: async (req, res, next) => {
    try {
      let results = await Product.find()
        .populate("category")
        .populate("supplier");
      let total = await Product.countDocuments();

      return res.send({
        code: 200,
        total,
        totalResult: results.length,
        payload: results,
      });
    } catch (err) {
      console.log("««««« err »»»»»", err);
      return res.status(500).json({ code: 500, error: err });
    }
  },
  question18: async (req, res, next) => {
    try {
      let results = await Category.aggregate()
        .lookup({
          from: "products",
          localField: "_id", // Truy vấn ngược từ Category sang Products
          foreignField: "categoryId", //categoryId của bảng Products
          as: "products",
        })
        .unwind({
          path: "$products",
          preserveNullAndEmptyArrays: true,
        })
        .group({
          _id: "$_id",
          name: { $first: "$name" },
          description: { $first: "$description" },
          totalStock: {
            $sum: "$products.stock",
          },
          totalProduct: {
            $sum: {
              $cond: {
                if: {
                  $and: [{ $gt: ["$products.stock", 0] }],
                },
                then: 1,
                else: 0,
              },
            },
          },
        })
        .sort({
          totalProduct: -1,
          name: -1,
        });
      let total = await Category.countDocuments();

      return res.send({
        code: 200,
        total,
        totalResult: results.length,
        payload: results,
      });
    } catch (err) {
      console.log("««««« err »»»»»", err);
      return res.status(500).json({ code: 500, error: err });
    }
  },
  question19: async (req, res, next) => {
    try {
      let results = await Supplier.aggregate()
        .lookup({
          from: "products",
          localField: "_id", // Truy vấn ngược từ Category sang Products
          foreignField: "supplierId", //categoryId của bảng Products
          as: "products",
        })
        .unwind({
          path: "$products",
          preserveNullAndEmptyArrays: true,
        })
        .group({
          _id: "$_id",
          name: { $first: "$name" },
          email: { $first: "$email" },
          phoneNumber: { $first: "$phoneNumber" },
          address: { $first: "$address" },
          totalStock: {
            $sum: "$products.stock",
          },
          totalProduct: {
            $sum: {
              $cond: {
                if: {
                  $and: [{ $gt: ["$products.stock", 0] }],
                },
                then: 1,
                else: 0,
              },
            },
          },
        })
        .sort({
          totalProduct: -1,
          name: -1,
        });
      let total = await Supplier.countDocuments();

      return res.send({
        code: 200,
        total,
        totalResult: results.length,
        payload: results,
      });
    } catch (err) {
      console.log("««««« err »»»»»", err);
      return res.status(500).json({ code: 500, error: err });
    }
  },
  question20: async (req, res, next) => {
    try {
      let { fromDate, toDate } = req.query;
      const conditionFind = getQueryDateTime(fromDate, toDate);

      let results = await Order.aggregate()
        .match({
          ...conditionFind,
          status: { $in: ["WAITING"] },
        })
        .unwind("productList")
        .lookup({
          from: "products",
          localField: "productList.productId",
          foreignField: "_id",
          as: "product",
        })
        .project({
          createdDate: 0,
          shippedDate: 0,
          customerId: 0,
          employeeId: 0,
          createdAt: 0,
          updatedAt: 0,
        })
        .unwind("product")
        .group({
          _id: "$product._id",
          // _id: '$productList.product._id',
          name: { $first: "$product.name" },
          price: { $first: "$product.price" },
          discount: { $first: "$product.discount" },
          stock: { $first: "$product.stock" },
          birthday: { $sum: "$productList.quantity" },
          inBill: { $sum: 1 },
        });

      let total = await Order.countDocuments();

      return res.send({
        code: 200,
        total,
        totalResult: results.length,
        payload: results,
      });
    } catch (err) {
      console.log("««««« err »»»»»", err);
      return res.status(500).json({ code: 500, error: err });
    }
  },
  question21: async (req, res, next) => {
    try {
      let { fromDate, toDate } = req.query;
      const conditionFind = getQueryDateTime(fromDate, toDate);

      let results = await Order.aggregate()
        .match(conditionFind)
        .lookup({
          from: "customers",
          localField: "customerId",
          foreignField: "_id",
          as: "customer",
        })
        .project({
          createdDate: 0,
          shippedDate: 0,
          customerId: 0,
          employeeId: 0,
          createdAt: 0,
          updatedAt: 0,
        })
        .unwind("customer")
        .group({
          _id: "$customer._id",
          // _id: '$productList.product._id',
          firstName: { $first: "$customer.firstName" },
          email: { $first: "$customer.email" },
          phoneNumber: { $first: "$customer.phoneNumber" },
          address: { $first: "$customer.address" },
          birthday: { $first: "$customer.birthday" },
        });

      let total = await Order.countDocuments();

      return res.send({
        code: 200,
        total,
        totalResult: results.length,
        payload: results,
      });
    } catch (err) {
      console.log("««««« err »»»»»", err);
      return res.status(500).json({ code: 500, error: err });
    }
  },
  question22: async (req, res, next) => {
    try {
      let { fromDate, toDate } = req.query;
      const conditionFind = getQueryDateTime(fromDate, toDate);

      let results = await Order.aggregate()
        .match(conditionFind)
        .unwind("productList")
        .lookup({
          from: "customers",
          localField: "customerId",
          foreignField: "_id",
          as: "customer",
        })
        .unwind("customer")
        .addFields({
          total: {
            $divide: [
              {
                $multiply: [
                  "$productList.price",
                  {
                    $subtract: [100, "$productList.discount"],
                  },
                  "$productList.quantity",
                ],
              },
              100,
            ],
          },
        })
        .group({
          _id: "$customerId",
          firstName: { $first: "$customer.firstName" },
          email: { $first: "$customer.email" },
          phoneNumber: { $first: "$customer.phoneNumber" },
          address: { $first: "$customer.address" },
          birthday: { $first: "$customer.birthday" },
          total: { $sum: "$total" },
        });

      let total = await Order.countDocuments();

      return res.send({
        code: 200,
        total,
        totalResult: results.length,
        payload: results,
      });
    } catch (err) {
      console.log("««««« err »»»»»", err);
      return res.status(500).json({ code: 500, error: err });
    }
  },
  question23: async (req, res, next) => {
    try {
      let { fromDate, toDate } = req.query;
      const conditionFind = getQueryDateTime(fromDate, toDate);

      let results = await Order.aggregate()
        .match(conditionFind)
        .unwind({
          path: "$productList",
          preserveNullAndEmptyArrays: true,
        })
        .addFields({
          total: {
            $divide: [
              {
                $multiply: [
                  "$productList.price",
                  {
                    $subtract: [100, "$productList.discount"],
                  },
                  "$productList.quantity",
                ],
              },
              100,
            ],
          },
        })
        .group({
          _id: "$_id",
          total: { $sum: "$total" },
        });

      let total = await Order.countDocuments();

      return res.send({
        code: 200,
        total,
        totalResult: results.length,
        payload: results,
      });
    } catch (err) {
      console.log("««««« err »»»»»", err);
      return res.status(500).json({ code: 500, error: err });
    }
  },
  question24: async (req, res, next) => {
    try {
      // let { fromDate, toDate } = req.query;
      // const conditionFind = getQueryDateTime(fromDate, toDate);

      let results = await Employee.aggregate()
        .lookup({
          from: "orders",
          localField: "_id",
          foreignField: "employeeId",
          as: "orders",
        })
        .unwind({
          path: "$orders",
          preserveNullAndEmptyArrays: true,
        })
        .unwind({
          path: "$orders.productList",
          preserveNullAndEmptyArrays: true,
        })
        .addFields({
          total: {
            $divide: [
              {
                $multiply: [
                  "$orders.productList.price",
                  { $subtract: [100, "$orders.productList.discount"] },
                  "$orders.productList.quantity",
                ],
              },
              100,
            ],
          },
        })
        .group({
          _id: "$_id",
          firstName: { $first: "$firstName" },
          lastName: { $first: "$lastName" },
          phoneNumber: { $first: "$phoneNumber" },
          email: { $first: "$email" },
          total: { $sum: "$total" },
        });

      let total = await Order.countDocuments();

      return res.send({
        code: 200,
        total,
        totalResult: results.length,
        payload: results,
      });
    } catch (err) {
      console.log("««««« err »»»»»", err);
      return res.status(500).json({ code: 500, error: err });
    }
  },
  question24a: async (req, res, next) => {
    try {
      let { fromDate, toDate } = req.query;
      const conditionFind = getQueryDateTime(fromDate, toDate);

      let results = await Order.aggregate()
        .match(conditionFind)
        .unwind("productList")
        .lookup({
          from: "employees",
          localField: "employeeId",
          foreignField: "_id",
          as: "employee",
        })
        .unwind("employee")
        .addFields({
          total: {
            $divide: [
              {
                $multiply: [
                  "$productList.price",
                  {
                    $subtract: [100, "$productList.discount"],
                  },
                  "$productList.quantity",
                ],
              },
              100,
            ],
          },
        })
        .group({
          _id: "$employeeId",
          firstName: { $first: "$employee.firstName" },
          email: { $first: "$employee.email" },
          phoneNumber: { $first: "$employee.phoneNumber" },
          address: { $first: "$employee.address" },
          birthday: { $first: "$employee.birthday" },
          total: { $sum: "$total" },
        });

      let total = await Order.countDocuments();

      return res.send({
        code: 200,
        total,
        totalResult: results.length,
        payload: results,
      });
    } catch (err) {
      console.log("««««« err »»»»»", err);
      return res.status(500).json({ code: 500, error: err });
    }
  },
  question25: async (req, res, next) => {
    try {
      let results = await Product.aggregate()
        .lookup({
          from: "orders",
          localField: "_id",
          foreignField: "productList.productId",
          as: "orders",
        })
        .match({
          orders: { $size: 0 },
        })
        .project({
          name: 1,
          price: 1,
          stock: 1,
        });

      let total = await Product.countDocuments();

      return res.send({
        code: 200,
        total,
        totalResult: results.length,
        payload: results,
      });
    } catch (err) {
      console.log("««««« err »»»»»", err);
      return res.status(500).json({ code: 500, error: err });
    }
  },
  question26: async (req, res, next) => {
    try {
      let { fromDate, toDate } = req.query;
      fromDate = new Date(fromDate);

      const tmpToDate = new Date(toDate);
      toDate = new Date(tmpToDate.setDate(tmpToDate.getDate() + 1));

      let results = await Supplier.aggregate()
        .lookup({
          from: "products",
          localField: "_id",
          foreignField: "supplierId",
          as: "products",
        })
        .unwind({
          path: "$products",
          preserveNullAndEmptyArrays: true,
        })
        .lookup({
          from: "orders",
          localField: "products._id",
          foreignField: "productList.productId",
          as: "orders",
        })
        .unwind({
          path: "$orders",
          preserveNullAndEmptyArrays: true,
        })
        .project({
          name: 1,
          orders: 1,
          // products: 0,
        })
        .match({
          $or: [
            { orders: null },
            {
              $and: [
                { orders: { $ne: null } },
                {
                  $or: [
                    { "orders.createdDate": { $lte: fromDate } },
                    { "orders.createdDate": { $gte: toDate } },
                  ],
                },
              ],
            },
          ],
        })
        .group({
          _id: "$_id",
          name: { $first: "$name" },
        });

      let total = await Supplier.countDocuments();

      return res.send({
        code: 200,
        total,
        totalResult: results.length,
        payload: results,
      });
    } catch (err) {
      console.log("««««« err »»»»»", err);
      return res.status(500).json({ code: 500, error: err });
    }
  },
  // Không lọc theo ngày tháng
  question26c: async (req, res, next) => {
    try {
      let results = await Product.aggregate()
        .lookup({
          from: "orders",
          localField: "_id",
          foreignField: "productList.productId",
          as: "orders",
        })
        .unwind({
          path: "$orders",
          preserveNullAndEmptyArrays: true,
        })
        // thêm bộ lọc ngày tháng ở đây nếu có
        .group({
          _id: "$supplierId",
          ordersArr: { $push: "$orders" },
        })
        .match({
          ordersArr: { $size: 0 },
        })
        .lookup({
          from: "suppliers",
          localField: "_id",
          foreignField: "_id",
          as: "supplier",
        })
        .unwind("supplier")
        .project({
          name: "$supplier.name",
          email: "$supplier.email",
          phoneNumber: "$supplier.phoneNumber",
          address: "$supplier.address",
        });

      let total = await Supplier.countDocuments();

      return res.send({
        code: 200,
        total,
        totalResult: results.length,
        payload: results,
      });
    } catch (err) {
      console.log("««««« err »»»»»", err);
      return res.status(500).json({ code: 500, error: err });
    }
  },
  question27: async (req, res, next) => {
    try {
      let { fromDate, toDate } = req.query;
      const conditionFind = getQueryDateTime(fromDate, toDate);

      let results = await Order.aggregate()
        .match(conditionFind)
        .unwind("productList")
        .lookup({
          from: "employees",
          localField: "employeeId",
          foreignField: "_id",
          as: "employee",
        })
        .unwind("employee")
        .addFields({
          total: {
            $divide: [
              {
                $multiply: [
                  "$productList.price",
                  {
                    $subtract: [100, "$productList.discount"],
                  },
                  "$productList.quantity",
                ],
              },
              100,
            ],
          },
        })
        .group({
          _id: "$employeeId",
          firstName: { $first: "$employee.firstName" },
          email: { $first: "$employee.email" },
          phoneNumber: { $first: "$employee.phoneNumber" },
          address: { $first: "$employee.address" },
          birthday: { $first: "$employee.birthday" },
          total: { $sum: "$total" },
        })
        .sort({ total: -1 })
        .group({
          _id: "$total",
          employee: { $push: "$$ROOT" },
        })
        .sort({ _id: -1 })
        .limit(3)
        .skip(0);

      let total = await Order.countDocuments();

      return res.send({
        code: 200,
        total,
        totalResult: results.length,
        payload: results,
      });
    } catch (err) {
      console.log("««««« err »»»»»", err);
      return res.status(500).json({ code: 500, error: err });
    }
  },
  question28: async (req, res, next) => {
    try {
      let { fromDate, toDate } = req.query;
      const conditionFind = getQueryDateTime(fromDate, toDate);

      let results = await Order.aggregate()
        .match(conditionFind)
        .unwind("productList")
        .lookup({
          from: "customers",
          localField: "customerId",
          foreignField: "_id",
          as: "customer",
        })
        .unwind("customer")
        .addFields({
          total: {
            $divide: [
              {
                $multiply: [
                  "$productList.price",
                  {
                    $subtract: [100, "$productList.discount"],
                  },
                  "$productList.quantity",
                ],
              },
              100,
            ],
          },
        })
        .group({
          _id: "$customerId",
          firstName: { $first: "$customer.firstName" },
          email: { $first: "$customer.email" },
          phoneNumber: { $first: "$customer.phoneNumber" },
          address: { $first: "$customer.address" },
          birthday: { $first: "$customer.birthday" },
          total: { $sum: "$total" },
        })
        .sort({ total: -1 })
        .group({
          _id: "$total",
          customer: { $push: "$$ROOT" },
        })
        .sort({ _id: -1 })
        .limit(3)
        .skip(0);

      let total = await Order.countDocuments();

      return res.send({
        code: 200,
        total,
        totalResult: results.length,
        payload: results,
      });
    } catch (err) {
      console.log("««««« err »»»»»", err);
      return res.status(500).json({ code: 500, error: err });
    }
  },
  question29: async (req, res, next) => {
    try {
      let results = await Product.distinct("discount");

      let total = await Supplier.countDocuments();

      return res.send({
        code: 200,
        total,
        totalResult: results.length,
        payload: results,
      });
    } catch (err) {
      console.log("««««« err »»»»»", err);
      return res.status(500).json({ code: 500, error: err });
    }
  },
  question30: async (req, res, next) => {
    try {
      let results = await Category.aggregate()
        .lookup({
          from: "products",
          localField: "_id",
          foreignField: "categoryId",
          as: "products",
        })
        .project({
          description: 0,
          isDeleted: 0,
          createdAt: 0,
          updatedAt: 0,
          products: {
            categoryId: 0,
            supplierId: 0,
            description: 0,
            isDeleted: 0,
            stock: 0,
            price: 0,
            discount: 0,
          },
        })
        .unwind({
          path: "$products",
          preserveNullAndEmptyArrays: true,
        })
        .lookup({
          from: "orders",
          localField: "products._id",
          foreignField: "productList.productId",
          as: "orders",
        })
        .project({
          orders: {
            paymentType: 0,
            status: 0,
            createdDate: 0,
            createdAt: 0,
            updatedAt: 0,
            employeeId: 0,
            customerId: 0,
          },
        })
        .unwind({
          path: "$orders",
          preserveNullAndEmptyArrays: true,
        })
        .unwind({
          path: "$orders.productList",
          preserveNullAndEmptyArrays: true,
        })
        .match({
          // Lọc các sản phẩm trùng nhau
          $or: [
            {
              $expr: {
                $eq: ["$products._id", "$orders.productList.productId"],
              },
            },
            {
              orders: { $exists: false },
            },
          ],
        })
        .addFields({
          intoMoney: {
            $multiply: [
              "$orders.productList.price",
              "$orders.productList.quantity",
              {
                $divide: [
                  { $subtract: [100, "$orders.productList.discount"] },
                  100,
                ],
              },
            ],
          },
        })
        .project({
          orders: 0,
        })
        .group({
          _id: "$_id",
          name: { $first: "$name" },
          totalAmount: { $sum: "$intoMoney" },
        })
        .sort({
          name: 1,
        });

      let total = await Category.countDocuments();

      return res.send({
        code: 200,
        total,
        totalResult: results.length,
        payload: results,
      });
    } catch (err) {
      console.log("««««« err »»»»»", err);
      return res.status(500).json({ code: 500, error: err });
    }
  },
  question31: async (req, res, next) => {
    try {
      let { status, fromDate, toDate } = req.query;

      fromDate = new Date(fromDate);
      fromDate.setHours(0, 0, 0, 0);

      tmpToDate = new Date(toDate);
      tmpToDate.setHours(0, 0, 0, 0);
      toDate = new Date(tmpToDate.setDate(tmpToDate.getDate() + 1));

      const compareStatus = { $eq: ["$status", status] };
      const compareFromDate = { $lt: ["$shippedDate", fromDate] };
      const compareToDate = { $gt: ["$shippedDate", toDate] };

      const conditionFind = {
        $expr: {
          $or: [
            {
              $and: [compareStatus, compareFromDate],
            },
            {
              $and: [compareStatus, compareToDate],
            },
          ],
        },
      };

      let results = await Order.aggregate()
        .match(conditionFind)
        .unwind({
          path: "$productList",
          preserveNullAndEmptyArrays: true,
        })
        .addFields({
          total: {
            $divide: [
              {
                $multiply: [
                  "$productList.price",
                  {
                    $subtract: [100, "$productList.discount"],
                  },
                  "$productList.quantity",
                ],
              },
              100,
            ],
          },
        })
        .group({
          _id: "$_id",
          total: { $sum: "$total" },
        });

      let total = await Order.countDocuments();

      return res.send({
        code: 200,
        total,
        totalResult: results.length,
        payload: results,
      });
    } catch (err) {
      console.log("««««« err »»»»»", err);
      return res.status(500).json({ code: 500, error: err });
    }
  },
  question32: async (req, res, next) => {
    try {
      let { fromDate, toDate } = req.query;

      fromDate = new Date(fromDate);
      fromDate.setHours(0, 0, 0, 0);

      tmpToDate = new Date(toDate);
      tmpToDate.setHours(0, 0, 0, 0);
      toDate = new Date(tmpToDate.setDate(tmpToDate.getDate() + 1));

      const compareFromDate = { $gte: ["$createdDate", fromDate] };
      const compareToDate = { $lt: ["$createdDate", toDate] };

      const conditionFind = {
        $expr: { $and: [compareFromDate, compareToDate] },
      };

      let results = await Order.aggregate()
        .match(conditionFind)
        .unwind({
          path: "$productList",
          preserveNullAndEmptyArrays: true,
        })
        .addFields({
          total: {
            $divide: [
              {
                $multiply: [
                  "$productList.price",
                  {
                    $subtract: [100, "$productList.discount"],
                  },
                  "$productList.quantity",
                ],
              },
              100,
            ],
          },
        })
        .group({
          _id: "$_id",
          total: { $sum: "$total" },
        })
        .sort({
          total: -1,
        });

      let total = await Order.countDocuments();

      return res.send({
        code: 200,
        total,
        totalResult: results.length,
        payload: results,
      });
    } catch (err) {
      console.log("««««« err »»»»»", err);
      return res.status(500).json({ code: 500, error: err });
    }
  },
  question33: async (req, res, next) => {
    try {
      let { fromDate, toDate } = req.query;
      const conditionFind = getQueryDateTime(fromDate, toDate);

      let results = await Order.aggregate()
        .match(conditionFind)
        .unwind("productList")
        .addFields({
          originalPrice: {
            $divide: [
              {
                $multiply: [
                  "$productList.price",
                  { $subtract: [100, "$productList.discount"] },
                ],
              },
              100,
            ],
          },
        })
        .group({
          _id: "$productList._id",
          createdDate: { $first: "$createdDate" },
          shippedDate: { $first: "$shippedDate" },
          status: { $first: "$status" },
          shippingAddress: { $first: "$shippingAddress" },
          description: { $first: "$description" },
          total: {
            $sum: { $multiply: ["$originalPrice", "$productList.quantity"] },
          },
        })
        .group({
          _id: null,
          avg: { $avg: "$total" },
        })
        .project({
          _id: 0,
          avg: 1,
        });

      let total = await Order.countDocuments();

      return res.send({
        code: 200,
        total,
        totalResult: results.length,
        payload: results,
      });
    } catch (err) {
      console.log("««««« err »»»»»", err);
      return res.status(500).json({ code: 500, error: err });
    }
  },
  question34: async (req, res, next) => {
    try {
      let { fromDate, toDate } = req.query;
      const conditionFind = getQueryDateTime(fromDate, toDate);

      let results = await Order.aggregate()
        .match(conditionFind)
        .unwind("productList")
        .addFields({
          originalPrice: {
            $divide: [
              {
                $multiply: [
                  "$productList.price",
                  { $subtract: [100, "$productList.discount"] },
                ],
              },
              100,
            ],
          },
        })
        .group({
          _id: "$_id",
          createdDate: { $first: "$createdDate" },
          shippedDate: { $first: "$shippedDate" },
          status: { $first: "$status" },
          shippingAddress: { $first: "$shippingAddress" },
          description: { $first: "$description" },
          total: {
            $sum: { $multiply: ["$originalPrice", "$productList.quantity"] },
          },
        })
        .group({
          _id: null,
          avg: { $avg: "$total" },
          total: { $sum: "$total" },
          count: { $sum: 1 },
        })
        .project({
          _id: 0,
          avg: 1,
          total: 1,
          count: 1,
        });

      let total = await Order.countDocuments();

      return res.send({
        code: 200,
        total,
        totalResult: results.length,
        payload: results,
      });
    } catch (err) {
      console.log("««««« err »»»»»", err);
      return res.status(500).json({ code: 500, error: err });
    }
  },
};
