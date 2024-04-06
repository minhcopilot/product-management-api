const { MongoClient } = require("mongodb");
const mongoose = require("mongoose");
const path = require("path");

function toSafeFileName(fileName) {
  const fileInfo = path.parse(fileName);

  const safeFileName =
    fileInfo.name.replace(/[^a-z0-9]/gi, "-").toLowerCase() + fileInfo.ext;
  return `${Date.now()}-${safeFileName}`;
}

//Insert one file
function insertDocument(data, collectionName) {
  return new Promise((resolve, reject) => {
    mongoose
      .model(collectionName)
      .create(data)
      .then((result) => {
        resolve({ result: result });
      })
      .catch((err) => {
        reject(err);
      });
  });
}

//Insert mane documents
function insertDocuments(list, collectionName) {
  return new Promise((resolve, reject) => {
    mongoose
      .model(collectionName)
      .insertMany(list)
      .then((result) => {
        resolve({ result: result });
      })
      .catch((err) => {
        reject(err);
      });
  });
}

//Update file
function updateDocument(condition, data, collectionName) {
  return new Promise((resolve, reject) => {
    mongoose
      .model(collectionName)
      .findOneAndUpdate(condition, { $set: data })
      .then((result) => {
        resolve(result);
      })
      .catch((err) => {
        reject(err);
      });
  });
}

//Find Document
function findDocument(id, collectionName) {
  return new Promise((resolve, reject) => {
    const collection = mongoose.model(collectionName);
    const query = { _id: id };
    collection
      .findOne(query)
      .then((result) => {
        resolve(result);
      })
      .catch((err) => {
        reject(err);
      });
  });
}
module.exports = {
  toSafeFileName,
  insertDocument,
  insertDocuments,
  findDocument,
  updateDocument,
};
