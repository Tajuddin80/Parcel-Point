// server.ts
import { app } from "./app";
import config from "./config";
import { MongoClient, ServerApiVersion } from "mongodb";

const port = config.port || 3000;

export const client = new MongoClient(config.mongoDB_uri as string, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
  // tls: true, // serverSelectionTimeoutMS: 3000, // autoSelectFamily: false,
});

// Connect to MongoDB before starting the server
async function startServer() {
  try {
    await client.connect();
    console.log(" Connected to MongoDB");

    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  } catch (err) {
    console.error(" Failed to start server:", err);
    process.exit(1);
  }
}

startServer();
