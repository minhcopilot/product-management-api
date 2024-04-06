var express = require("express");
var router = express.Router();

const {
  getAll,
  create,
  getDetail,
  update,
  deleteFunc,
} = require("./controller");
const { validateSchema, checkIdSchema } = require("../../utils");
const { categorySchema, patchCategorySchema } = require("./validation");

router.route("/").get(getAll).post(validateSchema(categorySchema), create);

router
  .route("/:id")
  .get(validateSchema(checkIdSchema), getDetail)
  .put(validateSchema(checkIdSchema), validateSchema(categorySchema), update)
  .patch(
    validateSchema(checkIdSchema),
    validateSchema(patchCategorySchema),
    update
  )
  .delete(validateSchema(checkIdSchema), deleteFunc);
module.exports = router;
