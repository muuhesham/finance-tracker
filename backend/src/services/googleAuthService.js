import { OAuth2Client } from "google-auth-library";
import mongoose from "mongoose";
import generateToken from "../utils/generateToken.js";
import {
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  GOOGLE_REDIRECT_URI,
  JWT_SECRET
} from "../config/env.js";
import { AppError } from "../utils/errors.js";

const client = new OAuth2Client(
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  GOOGLE_REDIRECT_URI,
);

export function createGoogleAuthService({ userModel }) {
  return {
    getGoogleAuthUrl: function () {
      const url = client.generateAuthUrl({
        access_type: "offline",
        scope: ["profile", "email"],
      });
      console.log('Generated Google Auth URL:', url);
      return url;
    },

    handleGoogleCallback: async function (code) {
      const { tokens } = await client.getToken(code);
      client.setCredentials(tokens);

      const ticket = await client.verifyIdToken({
        idToken: tokens.id_token,
        audience: GOOGLE_CLIENT_ID,
      });

      const payload = ticket.getPayload();
      const { sub: googleId, email, name } = payload;

      let user = await userModel.findOne({ googleId });
      if (!user) {
        user = await userModel.findOne({ email });
        if (user) {
          user = await userModel.findOneAndUpdate(
            { _id: user._id },
            { $set: { googleId } },
            { new: true }
          );
          user.googleId = googleId;
        } else {
          const newUser = await userModel.create({ googleId, email, name });
          user = newUser;
        }
      }

      return generateToken(user, JWT_SECRET);
    },
  };
}
