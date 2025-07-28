const { body, validationResult } = require("express-validator");

exports.validateRateInput = [
  body("metalType")
    .notEmpty()
    .withMessage("Metal Type is required")
    .isIn(["Gold", "Silver", "Diamond", "Platinum"])
    .withMessage("Invalid Metal Type"),
  body("carat")
    .notEmpty()
    .withMessage("Carat is required")
    .isIn(["24K", "22K", "18K"])
    .withMessage("Carat must be 24K, 22K, or 18K"),
  body("marketPrice")
    .isNumeric()
    .withMessage("Market Price must be a number")
    .isFloat({ min: 0 })
    .withMessage("Market Price cannot be negative"),
  body("ratePerGram")
    .isNumeric()
    .withMessage("Rate per gram must be a number")
    .isFloat({ min: 0 })
    .withMessage("Rate per gram cannot be negative"),
  body("makingCharges")
    .isNumeric()
    .withMessage("Making Charges must be a number")
    .isFloat({ min: 0 })
    .withMessage("Cannot be negative"),
  body("wastagePercentage")
    .optional()
    .isNumeric()
    .withMessage("Must be numeric")
    .isFloat({ min: 0 }),
  body("stoneCharges")
    .optional()
    .isNumeric()
    .withMessage("Must be numeric")
    .isFloat({ min: 0 }),
  body("otherCharges")
    .optional()
    .isNumeric()
    .withMessage("Must be numeric")
    .isFloat({ min: 0 }),
  body("effectiveDate")
    .notEmpty()
    .withMessage("Effective Date required")
    .isISO8601()
    .withMessage("Invalid date format"),
  body("source")
    .notEmpty()
    .withMessage("Source is required")
    .isIn(["Manual", "MMTC-PAMP"])
    .withMessage("Source must be Manual or MMTC-PAMP"),

  // Final check
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });
    next();
  },
];
exports.validateCreateInput = [
  body("metalType").notEmpty().isIn(["Gold", "Silver", "Diamond", "Platinum"]),
  body("source").notEmpty().isIn(["Manual", "MMTC-PAMP"]),
  body("marketPrice").optional().isNumeric().isFloat({ min: 0 }),
  body("effectiveDate").notEmpty().isISO8601(),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });
    next();
  },
];
  