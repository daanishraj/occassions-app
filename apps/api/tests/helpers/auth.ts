import type { NextFunction, Request, Response } from 'express';
import { TEST_USER_ID } from './constants';

/**
 * Creates a mock Clerk session token for testing
 * Format: "test_token_<userId>"
 */
export const createMockToken = (userId: string = TEST_USER_ID): string => {
  return `test_token_${userId}`;
};

/**
 * Mock requireAuth middleware that accepts test tokens
 * This replaces the real Clerk authentication in tests
 */
export const mockRequireAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      error: 'Unauthorized: Missing or invalid Authorization header',
    });
  }

  const token = authHeader.substring(7);
  
  // Extract userId from test token format: "test_token_<userId>"
  if (token.startsWith('test_token_')) {
    const userId = token.replace('test_token_', '');
    
    // Attach authenticated user ID to request (same as real middleware)
    req.auth = {
      userId,
    };
    
    return next();
  }

  // Invalid token format
  return res.status(401).json({
    error: 'Unauthorized: Invalid or expired session token',
  });
};

/**
 * Helper to get a mock authorization header for test requests
 */
export const getAuthHeader = (userId: string = TEST_USER_ID): string => {
  return `Bearer ${createMockToken(userId)}`;
};

