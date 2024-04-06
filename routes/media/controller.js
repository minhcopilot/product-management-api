const express = require("express");
const router = express.Router();
const multer = require("multer");
const { Media } = require("../../models");

const upload = require("../../middlewares/fileMulter");
const {
  insertDocument,
  updateDocument,
  findDocument,
  insertDocuments,
} = require("../../utils/MongoDbHelper");

module.exports = {
  uploadSingle: (req, res, next) =>
    // file => tên biến nhận từ FE
    upload.single("file")(req, res, async (err) => {
      try {
        if (err instanceof multer.MulterError) {
          res.status(500).json({ type: "MulterError", err: err });
        } else if (err) {
          res.status(500).json({ type: "UnknownError", err: err });
        } else {
          // const response = await insertDocument(
          //   {
          //     location: req.file.path,
          //     name: req.file.filename,
          //     employeeId: req.user._id,
          //     size: req.file.size,
          //   },
          //   'Media',
          // );
          const media = new Media({
            location: req.file.path,
            name: req.file.filename,
            customerId: req.user._id,
            size: req.file.size,
          });

          const response = await media.save();

          res
            .status(200)
            .json({ message: "upload successfully", payload: response });
        }
      } catch (error) {
        res.status(500).json({ message: "Upload file error", error });
      }
    }),

  uploadMultiple: (req, res) =>
    upload.array("files", 3)(req, res, async (err) => {
      try {
        if (err instanceof multer.MulterError) {
          res.status(500).json({ type: "MulterError", err: err });
        } else if (err) {
          res.status(500).json({ type: "UnknownError", err: err });
        } else {
          const dataInsert = req.files.reduce((prev, file) => {
            prev.push({
              name: file.filename,
              location: file.path,
              size: file.size,
              customerId: req.user._id,
            });
            return prev;
          }, []);

          // sử dụng Media.insertMany()

          const response = await insertDocuments(dataInsert, "Media");

          return res
            .status(200)
            .json({ message: "Tải lên thành công", payload: response });
        }
      } catch (error) {
        console.log("««««« error »»»»»", error);
        res.status(500).json({ message: "Upload files error", error });
      }
    }),

  getDetail: async (req, res, next) => {
    const { id } = req.params;
    console.log(id);
    const payload = await Media.findById(id);

    if (payload) return res.status(200).json({ payload });

    return res.status(400).json({ message: "Không tìm thấy" });
  },

  update: async (req, res) => {
    const { id } = req.params;

    const found = await findDocument(id, "Media");
    if (!found)
      res
        .status(410)
        .json({ message: `${collectionName} with id ${id} not found` });

    upload.single("file")(req, res, async (err) => {
      try {
        if (err instanceof multer.MulterError) {
          res.status(500).json({ type: "MulterError", err: err });
        } else if (err) {
          res.status(500).json({ type: "UnknownError", err: err });
        } else {
          // Media.findByIdAndUpdate()
          const response = await updateDocument(
            { _id: id },
            {
              location: req.file.path,
              name: req.file.filename,
              customerId: req.user._id,
              size: req.file.size,
            },
            "Media"
          );
          const updatedDocument = await findDocument(id, "Media");
          if (response) {
            res.status(200).json({ ok: true, payload: updatedDocument });
          }
          return res
            .status(400)
            .json({ ok: true, payload: { message: "Update failed" } });
        }
      } catch (error) {
        res.status(500).json({ ok: false, error });
      }
    });
  },
};
