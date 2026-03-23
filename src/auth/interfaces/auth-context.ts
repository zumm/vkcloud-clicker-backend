export interface JwtPayload {
  sub: number
}

export interface AuthContext {
  jwtPayload: JwtPayload
}
