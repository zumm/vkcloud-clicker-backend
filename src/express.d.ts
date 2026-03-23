import type { AuthContext } from 'src/auth/interfaces'

declare global {
  namespace Express {
    interface Request {
      authContext?: AuthContext
    }
  }
}
