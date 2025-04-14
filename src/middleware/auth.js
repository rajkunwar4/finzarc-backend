import { verifyToken } from '../utils/jwt.js'
import prisma from '../utils/prisma.js'

// Middleware to protect routes that require authentication
export const auth = async (
  req,
  res,
  next
) => {
  try {
    // Get token from cookies
    const token = req.cookies.token

    if (!token) {
      const errorResponse = {
        success: false,
        message: 'Not authorized to access this route',
      }
      return res.status(401).json(errorResponse)
    }

    // Verify token
    const decoded = verifyToken(token)

    // Check if user still exists
    const userId = typeof decoded === 'string' ? null : decoded.id;
    const user = await prisma.user.findUnique({
      where: { id: userId },
    })

    if (!user) {
      const errorResponse = {
        success: false,
        message: 'User no longer exists',
      }
      return res.status(401).json(errorResponse)
    }

    // Attach user to request object
    if (typeof decoded !== 'string') {
      req.user = {
        id: decoded.id,
        email: decoded.email,
      }
    }
    next()
  } catch (error) {
    const errorResponse = {
      success: false,
      message: 'Not authorized to access this route',
    }
    return res.status(401).json(errorResponse)
  }
}