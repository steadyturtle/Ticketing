import express, { Request, Response } from "express";
import { body } from "express-validator";
import { BadRequestError } from "../error/bad-request-error";
import { User } from "../model/user-model";
import { validateRequest } from "../middleware/validate-request";
import jwt from "jsonwebtoken";
const router = express.Router();

router.post(
  "/api/users/signup",
  [
    body("email").isEmail().withMessage("Email must be valid"),
    body("password")
      .trim()
      .isLength({ min: 4, max: 20 })
      .withMessage("Password must be between 4 and 20 characters"),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { email, password } = req.body;
    const userExist = await User.findOne({ email });
    if (userExist) throw new BadRequestError("Email in use");

    const user = User.build({ email, password });
    await user.save();
    //Generating JWT
    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_KEY!
    );

    //store in a cookie
    req.session = {
      jwt: token,
    };
    res.status(201).send(user);
  }
);
export { router as signupRouter };
