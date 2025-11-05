import { createClerkClient } from '@clerk/backend';
import type { NextFunction, Request, Response } from 'express';

// Extend Express Request type to include auth
declare global {
  namespace Express {
    interface Request {
      auth?: {
        userId: string;
      };
    }
  }
}

let clerkClient: ReturnType<typeof createClerkClient> | null = null;

/**
 * Initialize Clerk client if not already initialized
 */
const getClerkClient = () => {
  if (!clerkClient) {
    const secretKey = process.env.CLERK_SECRET_KEY;
    
    if (!secretKey) {
      throw new Error(
        'CLERK_SECRET_KEY environment variable is required for authentication'
      );
    }

    clerkClient = createClerkClient({
      secretKey,
    });
  }

  return clerkClient;
};

/**
 * Middleware to authenticate requests using Clerk session tokens
 * Expects Authorization header with format: "Bearer <session_token>"
 * 
 * The session token should be obtained from Clerk's frontend SDK using:
 * const { getToken } = useAuth();
 * const token = await getToken();
 */
export const requireAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Extract token from Authorization header
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        error: 'Unauthorized: Missing or invalid Authorization header',
      });
    }

    const token = authHeader.substring(7); // Remove "Bearer " prefix

    if (!token) {
      return res.status(401).json({
        error: 'Unauthorized: Missing session token',
      });
    }

    // Verify the token with Clerk
    const clerk = getClerkClient();
    
    // The token from getToken() is a JWT session token
    // We need to verify it using Clerk's session verification
    try {
      // Create a minimal request object for authenticateRequest
      // Clerk's authenticateRequest expects a Request-like object
      const request = new Request('http://localhost', {
        headers: {
          'authorization': authHeader,
        },
      });

      const authResult = await clerk.authenticateRequest(request);

      // Check if authentication was successful
      if (authResult.status === 'signed-in') {
        const auth = authResult.toAuth();
        
        // Extract userId - it's in the subject field for JWT tokens
        const userId = (auth as any).userId || (auth as any).sub || (auth as any).subject;

        if (!userId) {
          return res.status(401).json({
            error: 'Unauthorized: Invalid token payload - missing user ID',
          });
        }

        // Attach authenticated user ID to request
        req.auth = {
          userId: String(userId),
        };
      } else {
        // Authentication failed
        return res.status(401).json({
          error: 'Unauthorized: Invalid or expired session token',
        });
      }
    } catch (verifyError: any) {
      // Token verification failed
      return res.status(401).json({
        error: 'Unauthorized: Invalid or expired session token',
      });
    }

    next();
  } catch (error: any) {
    // Handle different error types
    if (
      error.message?.includes('Invalid') || 
      error.message?.includes('expired') ||
      error.message?.includes('jwt') ||
      error.status === 401
    ) {
      return res.status(401).json({
        error: 'Unauthorized: Invalid or expired session token',
      });
    }

    console.error('Authentication error:', error);
    return res.status(500).json({
      error: 'Internal server error during authentication',
    });
  }
};

