import mongoose from "mongoose";

let isConnected = false;

export async function connectDB(mongoUri) {
  if (isConnected) {
    return;
  }
  
  try {
    mongoose.set("strictQuery", true); 
    await mongoose.connect(mongoUri);
    console.log("✅️ DB IS CONNECTED");
    isConnected = true;
  } catch (err) {
    console.error("FAILED TO CONNECT TO DATABASE", err);
    process.exit(1); 
  }
}
