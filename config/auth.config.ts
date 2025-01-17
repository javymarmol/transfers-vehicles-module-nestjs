import { registerAs } from '@nestjs/config';
import 'dotenv/config';

export default registerAs('authConfig', () => {
  return {
    jwtAccessTokenSecret: process.env.JWT_ACCESS_TOKEN_SECRET,
    jwtAccessTokenExpirationTime: process.env.JWT_ACCESS_TOKEN_EXPIRATION_TIME,
  };
});
