export default function validEnvVariables(config) {
    if (!config.MONGODB_URI) {
      throw new Error("MONGODB_URI is required");
    }

    if (!config.JWT_SECRET) {
      throw new Error("JWT_SECRET is required");
    }
}
