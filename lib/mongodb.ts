import mongoose, { Connection } from "mongoose";

/**
 * Retrieves and validates the MongoDB connection URI from environment variables.
 * Throws an error if not defined to fail fast during startup.
 */
function getMongoUri(): string {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    throw new Error(
      "Please define the MONGODB_URI environment variable inside .env.local"
    );
  }

  return uri;
}

/**
 * Type definition for the cached connection object.
 * - conn: The active Mongoose connection
 * - promise: The pending connection promise
 */
interface MongooseCache {
  conn: Connection | null;
  promise: Promise<Connection> | null;
}

/**
 * Extend the global namespace to include the mongoose cache.
 * This prevents TypeScript errors when accessing global.mongoose.
 */
declare global {
  // eslint-disable-next-line no-var
  var mongoose: MongooseCache | undefined;
}

/**
 * Cached connection object stored on the global object.
 * In development, Next.js clears the Node.js module cache on every request,
 * which would create new database connections on each hot reload.
 * Storing the connection on globalThis preserves it across hot reloads.
 */
const cached: MongooseCache = globalThis.mongoose ?? { conn: null, promise: null };

// Initialize the global cache if it doesn't exist
if (!globalThis.mongoose) {
  globalThis.mongoose = cached;
}

/**
 * Establishes and returns a cached Mongoose connection to MongoDB.
 *
 * Reuses an existing connection or an in-progress connection promise to avoid duplicate connections; if a connection attempt fails the cached promise is cleared so subsequent calls can retry.
 *
 * @returns The active Mongoose Connection
 */
async function connectDB(): Promise<Connection> {
  // Return existing connection if available
  if (cached.conn) {
    return cached.conn;
  }

  // Reuse existing connection promise if connection is in progress
  if (!cached.promise) {
    const opts: mongoose.ConnectOptions = {
      // Buffer commands until connection is established
      bufferCommands: true,
    };

    // Create new connection promise
    cached.promise = mongoose.connect(getMongoUri(), opts).then((mongooseInstance) => {
      return mongooseInstance.connection;
    });
  }

  try {
    // Await the connection and cache it
    cached.conn = await cached.promise;
  } catch (error) {
    // Reset promise on failure to allow retry on next call
    cached.promise = null;
    throw error;
  }

  return cached.conn;
}

export default connectDB;