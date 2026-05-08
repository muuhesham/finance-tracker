import { AppError } from "../utils/errors.js";
import { hashPassword } from "../utils/hashPassword.js";
import { comparePassword } from "../utils/comparePassword.js";
import generateToken from "../utils/generateToken.js";

export function createAuthService({ userModel, jwtSecret }) {
  return {
    async register(payload) {
      const existingUser = await userModel.findOne({ email: payload.email });

      if (existingUser) {
        throw new AppError("Invalid email or password", 401);
      }

      const passwordHash = await hashPassword(payload.password);
      const user = await userModel.create({name: payload.name, email: payload.email, passwordHash});
      
      return generateToken(user, jwtSecret);
    },

    async login(payload) {
      const user = await userModel.findOne({ email: payload.email });

      if (!user) {
        throw new AppError("Invalid email or password", 401);
      }

      const passwordMatches = await comparePassword(payload.password, user.passwordHash);

      if (!passwordMatches) {
        throw new AppError("Invalid email or password", 401);
      }

      return generateToken(user, jwtSecret);
    },

    async getProfile(userId) {
      const user = await userModel.findById(userId);

      if (!user) {
        throw new AppError("User not found", 404);
      }

      return {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
      };
    },
  };
}
