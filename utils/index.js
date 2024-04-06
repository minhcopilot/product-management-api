const yup = require("yup");
const fs = require("fs");
const { ObjectId } = require("mongodb");

// ấn alt để mơ hết
//mongodb atlas

module.exports = {
  writeFileSync: (path, data) => {
    fs.writeFileSync(path, JSON.stringify(data), function (err) {
      if (err) {
        console.log("««««« err »»»»»", err);
        throw err;
      }
      console.log("Saved!!!");
    });
  },
  sendErr: (res, errors) =>
    res.send(400, {
      message: "Thất bại",
      errors: errors,
    }),
  generationID: () => Math.floor(Date.now()),
  validateSchema: (schema) => async (req, res, next) => {
    try {
      await schema.validate(
        {
          params: req.params,
          body: req.body,
          query: req.query,
        },
        {
          abortEarly: false,
        }
      );

      return next();
    } catch (err) {
      console.log("««««« err »»»»»", err);
      return res.send(400, {
        type: err.name,
        errors: err.errors,
        provider: "YUP",
      });
    }
  },
  getQueryDateTime: (from, to, type = "IN") => {
    fromDate = new Date(from);
    fromDate.setHours(0, 0, 0, 0);

    const tmpToDate = new Date(to);
    tmpToDate.setHours(0, 0, 0, 0);
    toDate = new Date(tmpToDate.setDate(tmpToDate.getDate() + 1));

    let query = {};

    if (type === "IN") {
      const compareFromDate = { $gte: ["$createdDate", fromDate] };
      const compareToDate = { $lt: ["$createdDate", toDate] };

      query = {
        $expr: { $and: [compareFromDate, compareToDate] },
      };
    } else {
      const compareFromDate = { $lt: ["$createdDate", fromDate] };
      const compareToDate = { $gt: ["$createdDate", toDate] };

      query = {
        $expr: { $or: [compareFromDate, compareToDate] },
      };
    }

    return query;
  },
  fuzzySearch: (text) => {
    const regex = text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");

    return new RegExp(regex, "gi");
  },

  checkIdSchema: yup.object({
    params: yup.object({
      id: yup.string().test("invalid", "ID is in wrong format", (value) => {
        return ObjectId.isValid(value);
      }),
    }),
  }),

  asyncForEach: async (array, callback) => {
    for (let i = 0; i < array.length; i += 1) {
      await callback(array[i], i, array);
    }
  },
};
