import "dotenv/config";
import app from "./src/app.js";
import { connectDatabase } from "./src/config/database.js";

const PORT = process.env.PORT || 4000;
const HOST = "0.0.0.0";

app.locals.isDatabaseConnected = false;

const server = app.listen(PORT, HOST, () => {
  console.log(`Server is running on http://${HOST}:${PORT}`);
});

const startDatabase = async () => {
  try {
    await connectDatabase();
    app.locals.isDatabaseConnected = true;
  } catch (error) {
    app.locals.isDatabaseConnected = false;
    console.error(`MongoDB connection failed: ${error.message}`);
  }
};

startDatabase();

const shutdown = () => {
  server.close(() => {
    process.exit(0);
  });
};

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
