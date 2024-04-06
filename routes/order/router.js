var express = require("express");
var router = express.Router();

const {
  getAll,
  create,
  getDetail,
  updateStatus,
  updateShippingDate,
  updateEmployee,
  update,
  deleteFunc,
  getList,
} = require("./controller");
const { validateSchema, checkIdSchema } = require("../../utils");
const {
  orderSchema,
  updateStatusSchema,
  updateShippingDateSchema,
  updateEmployeeSchema,
  validationQuerySchema,
} = require("./validation");

router.route("/").get(getAll).post(validateSchema(orderSchema), create);

router
  .route("/:id")
  .get(validateSchema(checkIdSchema), getDetail)
  .put(
    validateSchema(checkIdSchema),
    validateSchema(validationQuerySchema),
    update
  )
  .patch(
    validateSchema(checkIdSchema),
    validateSchema(validationQuerySchema),
    update
  )
  .delete(validateSchema(checkIdSchema), deleteFunc);
router
  .route("/status/:id")
  .patch(
    validateSchema(checkIdSchema),
    validateSchema(updateStatusSchema),
    updateStatus
  );
router
  .route("/shipped/:id")
  .patch(
    validateSchema(checkIdSchema),
    validateSchema(updateShippingDateSchema),
    updateShippingDate
  );
router
  .route("/employee/:id")
  .patch(
    validateSchema(checkIdSchema),
    validateSchema(updateEmployeeSchema),
    updateEmployee
  );

router.delete("/:id");

module.exports = router;
