export default function validEnvVariables(config) {
    if (!config.MONGODB_URI) {
      throw new Error("MONGODB_URI is required");
    }

    if (!config.JWT_SECRET) {
      throw new Error("JWT_SECRET is required");
    }

    if (!config.GOOGLE_CLIENT_ID) {
      throw new Error("GOOGLE_CLIENT_ID is required");
    }

    if (!config.GOOGLE_CLIENT_SECRET) {
      throw new Error("GOOGLE_CLIENT_SECRET is required");
    }

    if(!config.GOOGLE_REDIRECT_URI) {
      throw new Error("GOOGLE_REDIRECT_URI is required");
    }
}
