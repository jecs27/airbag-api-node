import { Request, Response } from "express";
import { v4 as uuidv4 } from 'uuid';
import User from "@database/nosql/models/user.model";
import { sendEmail } from "@utils/mail";
import { generateTemporaryPassword } from "@utils/temporaryPassword";
import { extractUserFromToken, generateToken } from "@middleware/auth.middleware";
import { hashString, validateHash } from "@utils/cipher";

export const getUsers = async (req: Request, res: Response) => {
  try {
    const userUuid = extractUserFromToken(req);
    const user = await User.findOne({ uuid: userUuid });
    return res.status(200).send({ status: 200, message: 'User data', data: {user} });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      status: 500,
      message: 'An error was generated when trying to get User data.',
      data: { error }
    });
  }
};

export const createUsers = async (req: Request, res: Response) => {
  try {
    const { name, phone, email } = req.body;
    const user = new User({
      uuid: uuidv4(),
      name,
      phone,
      email
    });
    await user.save();
    return res.status(201).send({ status: 201, message: 'User created', data: { user } });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      status: 500,
      message: 'An error was generated when trying to create User data.',
      data: { error }
    });
  }
};

export const signIn = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).send({ status: 404, message: 'User not found' });
    }
    const code = await generateTemporaryPassword();
    user.temporaryCode = await hashString(code);
    await user.save();

    sendEmail(email, 'Code verification', `Your code is ${code}`);
    return res.status(200).send({ status: 200, message: 'Sign in successful, code sent to email', data: {} });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      status: 500,
      message: 'An error occurred during sign in',
      data: { error }
    });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, code } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).send({ status: 404, message: 'User not found' });
    }
    const validPassword = await validateHash(code, user.temporaryCode);
    if (!validPassword) {
      return res.status(401).send({ status: 401, message: 'Invalid code' });
    }
    user.temporaryCode = null;
    await user.save();
    const userData = {
      uuid: user.uuid,
      email: user.email
    };
    const token = await generateToken(userData);
    return res.status(200).send({ status: 200, message: 'Login successful', data: { user: userData, token } });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      status: 500,
      message: 'An error occurred during login',
      data: { error }
    });
  }
};
