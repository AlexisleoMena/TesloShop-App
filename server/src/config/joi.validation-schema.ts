import * as Joi from 'joi';

export const JoiValidationSchema = Joi.object({
  NODE_ENV: Joi.string(),
  NODE_API_PORT: Joi.number(),
  NODE_API_HOST: Joi.string(),

  DB_HOST: Joi.string().required(),
  DB_PORT: Joi.number().required(),
  DB_USERNAME: Joi.string().required(),
  DB_PASSWORD: Joi.string().required(),
  DB_NAME: Joi.string().required(),

  JWT_SECRET: Joi.string().required(),
  JWT_REFRESH_SECRET: Joi.string().required(),
  REFRESH_TOKEN_EXPIRATION: Joi.string().required(),
  ACCESS_TOKEN_EXPIRATION: Joi.string().required(),
});
