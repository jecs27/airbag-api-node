import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';

interface ValidationErrorDetail {
  message: string;
  path: string[];
  type: string;
}

export const validates = (schema: Joi.Schema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const data = { ...req.params, ...req.query, ...req.body };
    try {
      const { error } = schema.validate(data, { abortEarly: false });
      if (error) {
        const errorDetails: ValidationErrorDetail[] = error.details.map((detail: any) => {
          const fieldType = getTypeFromSchema(schema, detail.path);

          return {
            message: detail.message.replace(/\"/g, ''),
            path: detail.path,
            type: fieldType
          };
        });

        return res.status(400).json({ 
          error: {
            message: 'Validation failed',
            details: errorDetails
          } 
        });
      }
    } catch (err) {
      return res.status(500).json({ 
        error: { 
          message: 'Validation error occurred', 
          details: err 
        } 
      });
    }
    next();
  };
};


const getTypeFromSchema = (schema: Joi.Schema, path: string[]): string => {
  let type = 'unknown';

  const description = schema.describe();
  let current = description;

  for (const key of path) {
    if (current?.keys) {
      current = current.keys[key];
    }
  }

  if (current?.type) {
    type = current.type;
  }

  return type;
};
