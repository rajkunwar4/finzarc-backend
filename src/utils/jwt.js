import jwt from "jsonwebtoken"



// JWT secret
const JWT_SECRET = process.env.JWT_SECRET || "dev_secret"

// Generate JWT token expires in 7 days
export const generateToken = (payload) => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" })
}

// Verify JWT token
export const verifyToken = (token) => {
  return jwt.verify(token, JWT_SECRET)
}

// Decode JWT token
export const decodeToken = (token) => {
  return jwt.decode(token)
}
