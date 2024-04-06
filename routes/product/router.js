var express = require("express");
var router = express.Router();
const upload = require("../../middlewares/fileMulter");

const {
  getAll,
  create,
  getDetail,
  update,
  getList,
  search,
  fakeData,
  deleteFunc,
} = require("./controller");
const { validateSchema, checkIdSchema } = require("../../utils");
const { productSchema, validationQuerySchema } = require("./validation");

router
  .route("/")
  .get(getAll)
  .post(upload.array("files", 5), validateSchema(productSchema), create);

router.route("/list").get(getList);
router.get("/search", validateSchema(validationQuerySchema), search);
router
  .route("/:id")
  .get(validateSchema(checkIdSchema), getDetail)
  .put(validateSchema(checkIdSchema), validateSchema(productSchema), update)
  .patch(
    validateSchema(checkIdSchema),
    validateSchema(validationQuerySchema),
    update
  )
  .delete(validateSchema(checkIdSchema), deleteFunc);

router.route("/fake").post(fakeData);
module.exports = router;
