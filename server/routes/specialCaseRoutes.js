const express = require("express");
const router = express.Router();
const specialCaseController = require("../controllers/specialCaseController");

router.post("/", specialCaseController.createSpecialCase);
router.get("/", specialCaseController.getAllSpecialCases);
router.get("/:id", specialCaseController.getSpecialCaseById);
router.put("/:id", specialCaseController.updateSpecialCase);
router.delete("/:id", specialCaseController.deleteSpecialCase);

module.exports = router;
