import type { Access, FieldAccess, PayloadRequest } from 'payload'

export const isLoggedIn = ({ req }: { req: PayloadRequest }) => Boolean(req.user)
export const isAdmin = ({ req }: { req: PayloadRequest }) => req.user?.collection === 'users' && (req.user as { role?: string }).role === 'admin'

export const authenticated: Access = ({ req }) => isLoggedIn({ req })
export const adminOnly: Access = ({ req }) => isAdmin({ req })
export const adminOnlyField: FieldAccess = ({ req }) => isAdmin({ req })
export const anyone: Access = () => true

/** Logged-in users see everything; the public only sees published documents. */
export const publishedOrAuthenticated: Access = ({ req }) => {
  if (req.user) return true
  return { _status: { equals: 'published' } }
}
