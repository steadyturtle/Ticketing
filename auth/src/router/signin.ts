import express, { Request, Response } from "express";
import { body } from "express-validator";
import { BadRequestError } from "../error/bad-request-error";
import { validateRequest } from "../middleware/validate-request";
import { User } from "../model/user-model";
import jwt from "jsonwebtoken";
import { Password } from "../services/password";
const router = express.Router();

router.post(
  "/api/users/signin",
  [
    body("email").isEmail().withMessage("Email must be valid"),
    body("password")
      .trim()
      .notEmpty()
      .withMessage("Must be supply a valid password"),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { email, password } = req.body;
    const userExist = await User.findOne({ email });
    if (!userExist) throw new BadRequestError("Invalid Credentials");
    const isPasswordMatch = await Password.comparePassword(
      userExist.password,
      password
    );
    if (!isPasswordMatch) throw new BadRequestError("Invalid Credentials");
    //Generating JWT
    const token = jwt.sign(
      { id: userExist.id, email: userExist.email },
      process.env.JWT_KEY!
    );

    //store in a cookie
    req.session = {
      jwt: token,
    };
    res.status(200).send(userExist);
  }
);
export { router as signInRouter };
