import "dotenv/config";
import app from "./src/app.js";
import { connectDatabase } from "./src/config/database.js";

const PORT = process.env.PORT || 4000;
<<<<<<< HEAD
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
=======

const startServer = async () => {
  await connectDatabase();

  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
};

startServer().catch((error) => {
  console.error(`Server failed to start: ${error.message}`);
  process.exit(1);
});
>>>>>>> be16480289ad63fec734bebd065047e33fb66a84
