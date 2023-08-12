import { Request, Response, NextFunction } from "express";
import { verify } from "jsonwebtoken"; // Import the verify function from the jsonwebtoken library
import { JWT_SECRET } from "../env";

interface TokenPayload {
  username: string; // Customize this based on your token payload structure
  // ... other properties from the token payload
}

interface UserRequest extends Request {
  user?: TokenPayload; // Use the TokenPayload interface here
}

// Middleware to protect a route
export const jwtTokenVerification = (
  req: UserRequest,
  res: Response,
  next: NextFunction
) => {
  const token = req.headers.authorization?.split(" ")[1]; // Get the token from the Authorization header

  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  try {
    // Verify the token using your secret key
    const decodedToken = verify(token, JWT_SECRET) as TokenPayload;

    req.user = decodedToken; // Now req.user holds the decoded token payload

    // Move to the next middleware
    next();
  } catch (error) {
    console.error("Token verification failed:", error.message);
    return res.status(403).json({ message: "Invalid token" });
  }
};
