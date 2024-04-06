const { sendErr } = require("../../utils");
const { Order, Customer, Employee, Product } = require("../../models");
const { fuzzySearch, asyncForEach } = require("../../utils");

module.exports = {
  getAll: async (req, res, next) => {
    try {
      const conditionFind = { isDeleted: false };
      let results = await Order.find(conditionFind).populate("customer");

      return res.send(200, {
        payload: results,
      });
    } catch (error) {
      return res.send(400, {
        message: "Get all Order failed",
      });
    }
  },

  getList: async (req, res, next) => {
    try {
      const { page, pageSize } = req.query; //page is the page number, pageSize is the number of products on a page
      const limit = pageSize || 12;
      const skip = limit * (page - 1) || 0; //limit is the position of the order to start picking

      const conditionFind = { isDeleted: false };

      let results = await Order.find(conditionFind)
        .populate("customer")
        .populate("employee")
        .skip(skip)
        .limit(limit)
        .sort({
          name: 1,
          price: 1,
          discount: -1, // 1 is ascending, -1 is descending
        })
        .lean();

      const total = await Order.countDocuments(conditionFind);

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

  getDetail: async (req, res, next) => {
    try {
      const { id } = req.params;
      let results = await Order.findOne({
        _id: id,
        isDeleted: false,
      });

      if (results) {
        return res.send(200, {
          message: "Get detail Order successfully",
          payload: results,
        });
      }
      return res.send(404, { message: "Order not found" });
    } catch (error) {
      console.log("««««« error »»»»»", error);
      return sendErr(res, error.errors);
    }
  },

  create: async function (req, res, next) {
    try {
      const data = req.body;
      const {
        customerId,
        employeeId,
        productList,
        paymentType,
        status,
        shippedDate,
        createdDate,
      } = req.body;

      const getCustomer = Customer.findOne({
        _id: customerId,
        isDeleted: false,
      });

      const getEmployee = Employee.findOne({
        _id: employeeId,
        isDeleted: false,
      });

      const [customer, employee] = await Promise.all([
        getCustomer,
        getEmployee,
      ]);

      const errors = [];
      if (!customer) errors.push("Customer not found");
      if (!employee) errors.push("Employee not found");

      let finalProductList = [];

      await asyncForEach(productList, async (item) => {
        const product = await Product.findOne({
          _id: item.productId,
          isDeleted: false,
        });

        if (!product) {
          errors.push(`Product ${item.productId} not found`);
        } else {
          if (product.stock < item.quantity)
            errors.push(
              `the quantity of product '${item.productId}' is greater than the quantity in stock`
            );
        }

        finalProductList.push({
          productId: item.productId,
          quantity: item.quantity,
          name: product.name,
          price: product.price,
          discount: product.discount,
        });
      });

      if (errors.length > 0) {
        return res.status(400).json({
          code: 400,
          message: "Error ",
          errors,
        });
      }

      const newItem = new Order({
        ...data,
        productList: finalProductList,
      });

      let result = await newItem.save();

      await asyncForEach(result.productList, async (item) => {
        await Product.findOneAndUpdate(
          { _id: item.productId },
          { $inc: { stock: -item.quantity } }
        );
      });

      return res.send({
        code: 200,
        message: "create order successfully!",
        payload: result,
      });
    } catch (err) {
      return sendErr(res, err.errors);
    }
  },

  updateStatus: async function (req, res, next) {
    try {
      const { id } = req.params;
      const { status } = req.body;

      let found = await Order.findOne({
        _id: id,
        $nor: [
          { status: "CANCELED" },
          { status: "REJECTED" },
          { status: "COMPLETED" },
        ],
      });

      if (found) {
        if (
          (found.status === "DELIVERING" && status === "WAITING") ||
          found.status === status
        ) {
          return res
            .status(410)
            .send({ code: 400, message: "Trạng thái không khả dụng" });
        }

        const result = await Order.findByIdAndUpdate(
          found._id,
          { status },
          { new: true }
        );

        return res.send({
          code: 200,
          payload: result,
          message: "Cập nhật trạng thái thành công",
        });
      }

      return res.status(410).send({ code: 404, message: "Thất bại" });
    } catch (err) {
      return res.status(500).json({ code: 500, error: err });
    }
  },

  updateEmployee: async (req, res, next) => {
    try {
      const { id } = req.params;
      const { employeeId } = req.body;

      let checkOrder = await Order.findOne({
        _id: id,
        $or: [{ status: "DELIVERING" }, { status: "WAITING" }],
      });

      if (!checkOrder) {
        return res.send(404, { message: "Status not found" });
      }

      if (checkOrder.employeeId !== employeeId) {
        const employee = await Employee.findOne({
          _id: employeeId,
          isDeleted: false,
        });
        if (!employee) {
          return res.send(404, { message: "Employee not found" });
        }
        const updateOrder = await Order.findByIdAndUpdate(
          id,
          { employeeId },
          { new: true }
        );
        if (updateOrder) {
          return res.send(200, {
            message: "Update employee successfully",
            payload: updateOrder,
          });
        }
        return res.send(404, { message: "not found" });
      }
      return res.send(400, { message: "cannot update employee" });
    } catch (error) {
      console.log("««««« error »»»»»", error);
      return sendErr(res, error.errors);
    }
  },

  updateShippingDate: async (req, res, next) => {
    try {
      const { id } = req.params;
      const { shippedDate } = req.body;

      const updateOrder = await Order.findByIdAndUpdate(
        id,
        { shippedDate },
        { new: true }
      );

      if (!updateOrder) {
        return res.send(404, { message: "Order not found" });
      }

      return res.send(200, {
        message: "Order updated successfully",
        payload: updateOrder,
      });
    } catch (error) {
      console.log("««««« error »»»»»", error);
      return sendErr(res, error.errors);
    }
  },

  deleteFunc: async (req, res, next) => {
    try {
      const { id } = req.params;
      const result = await Order.findByIdAndDelete(id);

      return res.status(200).json({
        code: 200,
        message: "Delete order successfully",
      });
    } catch (err) {
      return res.status(500).json({
        code: 500,
        error: err,
      });
    }
  },

  update: async (req, res, next) => {
    try {
      const { id } = req.params;
      const error = [];
      const { productList } = req.body;

      const order = await Order.findOne({ _id: id, isDeleted: false });
      if (!order) {
        return res.status(404).json({
          code: 404,
          message: "Order not found",
        });
      }

      if (error.length > 0) {
        return res.status(400).json({
          code: 400,
          message: "Error ",
          error,
        });
      }
      const updateOrder = await Order.findByIdAndUpdate(
        id,
        {
          productList: productList,
        },
        { new: true }
      );
      if (updateOrder) {
        return res.status(200).json({
          code: 200,
          message: "Update order successfully",
          payload: updateOrder,
        });
      }
      return res.status(400).json({
        message: "Update order failed",
      });
    } catch (err) {
      return res.status(500).json({
        code: 500,
        error: err,
      });
    }
  },
};
