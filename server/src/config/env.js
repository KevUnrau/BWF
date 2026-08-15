import "dotenv/config";

const env = {
  port: process.env.PORT,
  nodeEnv: process.env.NODE_ENV,
  jwtAccessSecret: process.env.JWT_ACCESS_SECRET,
  jwtRefreshSecret: process.env.JWT_REFRESH_SECRET,
};

export default env;
