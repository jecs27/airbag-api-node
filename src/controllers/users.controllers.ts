import { Request, Response } from "express";

export const getUser = async (_req: Request, res: Response) => {
  try {
    return res.status(200).send({ status: 200, message: 'User data', data: {} });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      status: 500,
      message: 'An error was generated when trying to get User data.',
      data: { error }
    });
  }
};

export const createUser = async (req: Request, res: Response) => {
  try {
    const { name, phone, email } = req.body;
    return res.status(200).send({ status: 200, message: 'User created', data: { name, phone, email } });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      status: 500,
      message: 'An error was generated when trying to create User data.',
      data: { error }
    });
  }
};
