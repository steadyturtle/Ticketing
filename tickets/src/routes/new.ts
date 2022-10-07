import express, { Request, Response } from "express";
import { requireAuth, validateRequest } from "@steadyturtletickets/common";
import { body } from "express-validator";
const router = express.Router();

router.post(
  "/api/tickets",

  requireAuth,
  [
    body("title").trim().notEmpty().withMessage("Title must be provide"),
    body("price")
      .trim()
      .notEmpty()
      .isInt({ min: 0 })
      .withMessage("Invalid price"),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    res.send({});
  }
);

export { router as createTicketsRouter };
