import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { MongoClient, ObjectId } from "mongodb";
import cookieParser from "cookie-parser";

dotenv.config();

// Reuse a single MongoDB client instance
let client;
async function connectDB() {
  if (!client) {
    client = new MongoClient(process.env.MONGODB_ADDRESS); 
    await client.connect();
  }
  return client.db("test");
}

const protector = async (req, res, next) => {
  try {
    if (!req.cookies || !req.cookies.jwt) {
      return res.status(401).json({ Error: "Unauthorized: No token provided" });
    }

    // Verify JWT token
    const token = req.cookies.jwt;
    const jwtPayload = jwt.verify(token, process.env.SECRET_KEY);
    const userId = jwtPayload.id;

    // ✅ Validate and convert ObjectId
    if (!ObjectId.isValid(userId)) {
      return res.status(400).json({ Error: "Invalid user ID format" });
    }
    const objectId = new ObjectId(userId);

    // Connect to MongoDB
    const db = await connectDB();
    const adminCollection = db.collection("admin");

    // Find user by ObjectId
    const isAdmin = await adminCollection.findOne({ _id: objectId });
    if (!isAdmin) {
      return res.status(403).json({ Error: "Unauthorized entry" });
    }

    // Attach user info to request
    req.user = isAdmin;
    next();
  } catch (error) {
    return res.status(500).json({ Error: `Error verifying admin: ${error.message}` });
  }
};

export default protector;
