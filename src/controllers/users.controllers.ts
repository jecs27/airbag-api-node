import { Request, Response } from "express";
import { v4 as uuidv4 } from 'uuid';
import User from "@database/nosql/models/user.model";
import { sendEmail } from "@utils/mail";
import { generateTemporaryPassword } from "@utils/temporaryPassword";
import { extractUserFromToken, generateToken } from "@middleware/auth.middleware";
import { hashString, validateHash } from "@utils/cipher";

/**
 * This function retrieves user data based on the user UUID extracted from the request token and
 * handles errors appropriately.
 * @param {Request} req - Request object containing information about the HTTP request
 * @param {Response} res - The `res` parameter in the `getUsers` function stands for the response
 * object. It is used to send the HTTP response back to the client making the request. In this case,
 * the function is sending a response with status codes and data back to the client based on the
 * outcome of the database
 * @returns The getUsers function is returning a response with status code 200 and a JSON object
 * containing the status, message, and user data if the user data is successfully retrieved from the
 * database. If an error occurs during the process, it will return a response with status code 500 and
 * an error message along with the error details.
 */
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

/**
 * The function `createUsers` is an asynchronous function that creates a new user with provided data
 * and returns a success message or an error message accordingly.
 * @param {Request} req - The `req` parameter in the `createUsers` function stands for the request
 * object. It contains information about the HTTP request that triggered the function, such as request
 * headers, parameters, body, and more. In this specific function, `req.body` is used to extract the
 * `name`, `
 * @param {Response} res - The `res` parameter in the `createUsers` function is an object representing
 * the HTTP response that the server sends back to the client. It allows you to send data back to the
 * client, set status codes, headers, and more. In this function, `res` is used to send a
 * @returns The function `createUsers` is returning a response with status code 201 if the user
 * creation is successful. The response includes a message 'User created' and the user data that was
 * created. If there is an error during the user creation process, it returns a response with status
 * code 500, an error message, and the error data.
 */
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

/**
 * The function `signIn` handles user sign-in by generating a temporary password, saving it securely,
 * sending a verification code to the user's email, and returning appropriate responses based on the
 * outcome.
 * @param {Request} req - The `req` parameter in the `signIn` function stands for the request object,
 * which contains information about the HTTP request that triggered the function. This object typically
 * includes details such as the request headers, body, parameters, query strings, and more. In this
 * specific function, `req` is of
 * @param {Response} res - The `res` parameter in the `signIn` function stands for the response object.
 * It is used to send the HTTP response back to the client making the request. In this case, the `res`
 * object is used to send different status codes and messages based on the outcome of the sign-in
 * process
 * @returns The `signIn` function returns a response based on the outcome of the sign-in process. If
 * the user is found, a temporary code is generated, saved to the user object, and an email containing
 * the code is sent. The function then returns a success message with status code 200. If an error
 * occurs during the sign-in process, it returns an error message with status code 500.
 */
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

/**
 * The `login` function in TypeScript handles user authentication by verifying the email and code
 * provided, updating the temporary code, generating a token, and returning a response accordingly.
 * @param {Request} req - Request object containing information about the HTTP request
 * @param {Response} res - The `res` parameter in the `login` function is an instance of the Response
 * object in Express.js. It is used to send a response back to the client making the request. In the
 * provided code snippet, `res` is used to send different HTTP responses based on the outcome of the
 * login
 * @returns The login function returns a response with status code and message based on the outcome of
 * the login process. If the user is not found, it returns a 404 status with a message 'User not
 * found'. If the code provided is invalid, it returns a 401 status with a message 'Invalid code'. If
 * the login is successful, it returns a 200 status with a message 'Login successful'
 */
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
