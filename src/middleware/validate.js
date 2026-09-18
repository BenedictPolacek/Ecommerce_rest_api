import { ZodError } from 'zod';
import { AppError } from '../utils/AppError.js';

/**
 * Middleware generator for Zod request validation.
 * Parses and sanitizes req.body, attaching validated data back to req.body.
 *
 * @param {import('zod').ZodSchema} schema - Zod schema to validate against
 */
export const validate = (schema) => (req, res, next) => {
  try {
    req.body = schema.parse(req.body);
    next();
  } catch (error) {
    if (error instanceof ZodError) {
      const details = error.errors.map((err) => ({
        field: err.path.join('.'),
        message: err.message,
      }));
      return next(new AppError('Validation failed', 400, details));
    }
    next(error);
  }
};

export default validate;
