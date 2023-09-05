import * as mongodb from "mongodb";

const MongoClient = mongodb.MongoClient;

// Define the types for the AWS Lambda function event and context
interface LambdaEvent {
  // ... any specific properties you expect in the event
  [key: string]: any;  // This is a catch-all, you can refine it based on your needs
}

interface LambdaContext {
  callbackWaitsForEmptyEventLoop: boolean;
  // ... any other context properties you want to use
}

// Once we connect to the database once, we'll store that connection
// and reuse it so that we don't have to connect to the database on every request.
let cachedDb: mongodb.Db | null = null;

const mongoUri = process.env.MONGODB_URI;

if (!mongoUri) {
    throw new Error("MONGODB_URI is not defined in environment variables!");
}
async function connectToDatabase(): Promise<mongodb.Db> {
  if (cachedDb) {
    return cachedDb;
  }

  // Connect to our MongoDB database hosted on MongoDB Atlas
  const client = await MongoClient.connect(mongoUri!);

  // Specify which database we want to use
  cachedDb = await client.db("Demo");

  return cachedDb;
}

export async function handler(event: LambdaEvent, context: LambdaContext) {
  context.callbackWaitsForEmptyEventLoop = false;

  // Get an instance of our database
  const db = await connectToDatabase();

  // Make a MongoDB MQL Query
  const users = await db.collection("users").find({}).limit(1).toArray();

  console.log(users)

  return {
    statusCode: 200,
    body: JSON.stringify(users, null, 2),
  };
}