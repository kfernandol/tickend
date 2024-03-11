export interface AuthResponse {
  token: string;
  expirationMin: number;
  tokenType: string;
  refreshToken: string;
  KeepLogged: boolean;
}
