import bcrypt from "bcryptjs";
import { AppError } from "../utils/errors.js";
import { signToken } from "../utils/token.js";

function buildAuthResponse(user, jwtSecret) {
  return {
    token: signToken(
      {
        sub: user._id.toString(),
        email: user.email,
        name: user.name,
      },
      jwtSecret,
    ),
    user: {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
    },
  };
}

export function createAuthService({ userModel, jwtSecret }) {
  return {
    async register(payload) {
      const existingUser = await userModel.findOne({ email: payload.email });

      if (existingUser) {
        throw new AppError("An account with this email already exists", 409);
      }

      const passwordHash = await bcrypt.hash(payload.password, 10);
      const user = await userModel.create({
        name: payload.name,
        email: payload.email,
        passwordHash,
      });

      return buildAuthResponse(user, jwtSecret);
    },

    async login(payload) {
      const user = await userModel.findOne({ email: payload.email });

      if (!user) {
        throw new AppError("Invalid email or password", 401);
      }

      const passwordMatches = await bcrypt.compare(
        payload.password,
        user.passwordHash,
      );

      if (!passwordMatches) {
        throw new AppError("Invalid email or password", 401);
      }

      return buildAuthResponse(user, jwtSecret);
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
