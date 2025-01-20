import dotenv from 'dotenv';

dotenv.config();

const jwtSecret = process.env.JWT_SECRET;

if (!jwtSecret) {
  throw new Error('JWT_SECRET is not defined in environment variables');
}

export default {
  jwt: {
    secret: jwtSecret,
    expiresIn: '24h'
  }
};
