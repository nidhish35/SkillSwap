import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
export const sign = (payload, exp='15m') => jwt.sign(payload, env.jwtSecret, { expiresIn: exp });
export const verify = (token) => jwt.verify(token, env.jwtSecret);
