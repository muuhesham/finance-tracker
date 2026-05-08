import { createApp } from './app.js';
import { connectDB } from './config/db.js';
import { PORT, MONGODB_URI } from './config/env.js';

async function startServer() {
  await connectDB(MONGODB_URI);
  const app = createApp();

  try {
      app.listen(PORT, () => {
        console.log(`✅️ API LISTENING ON http://localhost:${PORT}`);
      });
  }catch (err) {
      console.error('FAILED TO START API', err);
      process.exit(1);
  }
}

startServer();