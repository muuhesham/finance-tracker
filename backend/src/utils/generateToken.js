import { signToken } from "./jwt.js";

export default function generateToken(user, jwtSecret) {
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